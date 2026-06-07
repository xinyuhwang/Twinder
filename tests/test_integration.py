"""Integration tests for the Weave LLM integration plan (automated verification items)."""
import json
from unittest.mock import AsyncMock, patch

from sqlmodel import select

INTAKE_YAML = """\
identity_snapshot:
  public_safe_summary: Test user — curious builder
  short_internal_summary: Introspective, likes deep conversations
interests:
  professional:
    - software engineering
  intellectual:
    - philosophy of mind
  creative: []
  social: []
  lifestyle: []
  niche_obsessions:
    - interpretability research
help_exchange:
  i_can_help_others_with:
    - rapid prototyping
social_and_matching_intelligence:
  people_i_may_want_to_meet:
    - founders
    - researchers
privacy_model:
  internal_only:
    - struggles with imposter syndrome
  sensitive_do_not_share:
    - medical history
"""

SYNTHESIS_YAML = """\
twinder_profile:
  twin_system_instruction_seed:
    identity: Tester's digital twin
    mission: Find great connections at WeaveHacks
    voice: Warm, curious, and specific
    priorities:
      - Represent user's genuine interests
    privacy_rules:
      - Never reveal medical or sensitive info
    matching_rules:
      - Look for complementary skills
    conversation_rules:
      - Keep responses to 2-4 sentences
    refusal_or_boundary_rules:
      - No romantic commitments
  conversation_hooks:
    openers_about_user:
      - Deep into interpretability research
    topics_likely_to_create_spark:
      - AI safety and alignment
twinder_matching_vector:
  vector_metadata:
    overall_vector_confidence: medium
  intent_orientation:
    networking:
      score: 0.8
      confidence: high
      notes: Strong professional focus
"""

# Patch targets: each module imports `chat` by name, so patch at the use site.
_PROFILE_CHAT = "app.agents.profile.chat"
_SYNTHESIS_CHAT = "app.agents.synthesis.chat"


def _mock_intake():
    """Context manager: stub both LLM calls used by POST /users/me/intake."""
    return (
        patch(_PROFILE_CHAT, new=AsyncMock(return_value=INTAKE_YAML)),
        patch(_SYNTHESIS_CHAT, new=AsyncMock(return_value=SYNTHESIS_YAML)),
    )


# ---------------------------------------------------------------------------
# Phase 1 + 2: POST /users/me/intake
# ---------------------------------------------------------------------------

def test_intake_returns_twin_preview(client, session, test_user):
    """POST /users/me/intake returns 200 with a TwinPreview body (chat stubbed)."""
    p1, p2 = _mock_intake()
    with p1, p2:
        resp = client.post("/users/me/intake", json={"raw_context": "I build AI tools."})

    assert resp.status_code == 200
    preview = resp.json()
    assert "public_safe_summary" in preview
    assert "interests" in preview
    assert "looking_for" in preview
    assert preview["public_safe_summary"] == "Test user — curious builder"
    assert "software engineering" in preview["interests"]
    assert "founders" in preview["looking_for"]


def test_intake_no_private_content_in_preview(client, session, test_user):
    """TwinPreview must not expose internal_only or sensitive_do_not_share content."""
    p1, p2 = _mock_intake()
    with p1, p2:
        resp = client.post("/users/me/intake", json={"raw_context": "I build AI tools."})

    assert resp.status_code == 200
    body_str = resp.text
    assert "imposter" not in body_str
    assert "medical history" not in body_str


def test_intake_creates_profile_version_with_all_fields(client, session, test_user):
    """Intake writes profile_yaml, matching_vector, system_instruction onto active ProfileVersion."""
    from app.models import ProfileVersion

    p1, p2 = _mock_intake()
    with p1, p2:
        resp = client.post("/users/me/intake", json={"raw_context": "I build AI tools."})

    assert resp.status_code == 200

    pv = session.exec(
        select(ProfileVersion).where(ProfileVersion.user_id == test_user.id)
    ).first()
    assert pv is not None
    assert pv.is_active is True
    assert pv.version == 1
    assert pv.profile_yaml is not None and "identity_snapshot" in pv.profile_yaml
    assert pv.matching_vector is not None
    stored = json.loads(pv.matching_vector)
    assert "profile" in stored
    assert stored["profile"]["twin_system_instruction_seed"]["identity"] == "Tester's digital twin"
    assert pv.system_instruction is not None and "Tester" in pv.system_instruction


def test_intake_second_run_bumps_version_and_deactivates_prior(client, session, test_user):
    """Second intake run deactivates prior ProfileVersion and sets version=2."""
    from app.models import ProfileVersion

    # Each call to generate_profile / synthesize_profile gets its own mock that
    # always returns the same canned YAML, so multiple calls all succeed.
    p1, p2 = _mock_intake()
    with p1, p2:
        r1 = client.post("/users/me/intake", json={"raw_context": "First run."})
        r2 = client.post("/users/me/intake", json={"raw_context": "Second run."})

    assert r1.status_code == 200
    assert r2.status_code == 200

    versions = session.exec(
        select(ProfileVersion).where(ProfileVersion.user_id == test_user.id)
    ).all()
    assert len(versions) == 2

    active = [v for v in versions if v.is_active]
    inactive = [v for v in versions if not v.is_active]
    assert len(active) == 1
    assert len(inactive) == 1
    assert active[0].version == 2
    assert inactive[0].version == 1


# ---------------------------------------------------------------------------
# Phase 3: GET /rooms/{id} includes match_card
# ---------------------------------------------------------------------------

def test_get_room_includes_parsed_match_card(client, session, test_user):
    """GET /rooms/{id} returns match_card as parsed dict when the room has one."""
    from app.models import Room, RoomParticipant

    card = {
        "score": 80,
        "headline": "Fellow builders united by AI",
        "match_type": "kindred_spirit",
        "summary": "Strong overlap in AI tooling.",
    }
    room = Room(status="completed", match_card=json.dumps(card))
    session.add(room)
    session.commit()
    session.refresh(room)

    session.add(RoomParticipant(room_id=room.id, user_id=test_user.id))
    session.commit()

    resp = client.get(f"/rooms/{room.id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["match_card"] == card
    assert data["match_card"]["headline"] == "Fellow builders united by AI"


def test_get_room_match_card_null_when_absent(client, session, test_user):
    """GET /rooms/{id} returns null match_card when room has none."""
    from app.models import Room, RoomParticipant

    room = Room(status="active")
    session.add(room)
    session.commit()
    session.refresh(room)

    session.add(RoomParticipant(room_id=room.id, user_id=test_user.id))
    session.commit()

    resp = client.get(f"/rooms/{room.id}")
    assert resp.status_code == 200
    assert resp.json()["match_card"] is None


# ---------------------------------------------------------------------------
# Phase 4: POST /rooms/{id}/feedback
# ---------------------------------------------------------------------------

def test_submit_feedback_persists_and_returns_ok(client, session, test_user):
    """POST /rooms/{id}/feedback persists MatchFeedback and returns 200."""
    from app.models import MatchFeedback, Room, RoomParticipant

    room = Room(status="completed")
    session.add(room)
    session.commit()
    session.refresh(room)
    session.add(RoomParticipant(room_id=room.id, user_id=test_user.id))
    session.commit()

    resp = client.post(
        f"/rooms/{room.id}/feedback",
        json={"verdict": "save", "rating": 5, "note": "Amazing connection!"},
    )
    assert resp.status_code == 200
    assert resp.json() == {"ok": True}

    feedback = session.exec(
        select(MatchFeedback).where(MatchFeedback.room_id == room.id)
    ).first()
    assert feedback is not None
    assert feedback.verdict == "save"
    assert feedback.rating == 5
    assert feedback.note == "Amazing connection!"
    assert feedback.user_id == test_user.id


def test_submit_feedback_pass_verdict(client, session, test_user):
    """POST /rooms/{id}/feedback works with verdict=pass and no rating/note."""
    from app.models import MatchFeedback, Room, RoomParticipant

    room = Room(status="completed")
    session.add(room)
    session.commit()
    session.refresh(room)
    session.add(RoomParticipant(room_id=room.id, user_id=test_user.id))
    session.commit()

    resp = client.post(f"/rooms/{room.id}/feedback", json={"verdict": "pass"})
    assert resp.status_code == 200

    feedback = session.exec(
        select(MatchFeedback).where(MatchFeedback.room_id == room.id)
    ).first()
    assert feedback.verdict == "pass"
    assert feedback.rating is None
    assert feedback.note is None


def test_submit_feedback_nonparticipant_gets_403(client, session, test_user):
    """POST /rooms/{id}/feedback returns 403 when the user is not a participant."""
    from app.models import Room

    room = Room(status="completed")
    session.add(room)
    session.commit()
    session.refresh(room)
    # test_user is deliberately NOT added as a participant

    resp = client.post(f"/rooms/{room.id}/feedback", json={"verdict": "save"})
    assert resp.status_code == 403
