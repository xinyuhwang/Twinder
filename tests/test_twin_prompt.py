"""Tests for twin system prompt resolution."""

import json

from app.agents.synthesis import build_system_instruction, is_stub_instruction
from app.agents.twin_prompt import build_twin_system_prompt, persona_with_openness, resolve_persona
from app.models import ProfileVersion, User


def test_is_stub_instruction_detects_generic_fallback():
    assert is_stub_instruction(None) is True
    stub = (
        "You are Alexis's digital twin.\n\n"
        "Mission: Represent the user authentically and help find good matches.\n\n"
        "Priorities:\n- Be authentic and helpful."
    )
    assert is_stub_instruction(stub) is True
    assert is_stub_instruction("You are Alexis's custom twin with a full profile.") is False


def test_resolve_persona_prefers_user_persona(session):
    user = User(name="Alexis", email="a@test", google_id="test-a", persona="Rich seed persona")
    session.add(user)
    session.commit()
    session.refresh(user)

    assert resolve_persona(user, session) == "Rich seed persona"


def test_resolve_persona_falls_back_to_profile_yaml(session):
    user = User(name="Alexis", email="b@test", google_id="test-b", persona=None)
    session.add(user)
    session.commit()
    session.refresh(user)

    yaml_str = """
identity_snapshot:
  public_safe_summary: Outdoorsy AI engineer from Oakland.
interests:
  professional:
    - digital twins
social_and_matching_intelligence:
  people_i_may_want_to_meet:
    - AI builders
"""
    pv = ProfileVersion(
        user_id=user.id,
        version=1,
        profile_yaml=yaml_str,
        is_active=True,
    )
    session.add(pv)
    session.commit()

    persona = resolve_persona(user, session)
    assert "Outdoorsy AI engineer" in persona
    assert "digital twins" in persona


def test_build_twin_system_prompt_uses_synthesized_instruction(session):
    user = User(name="Alexis", email="c@test", google_id="test-c", persona=None, dat_score=69.0)
    session.add(user)
    session.commit()
    session.refresh(user)

    synthesis = {
        "profile": {
            "twin_system_instruction_seed": {
                "identity": "You are Alexis's custom twin with a full profile.",
                "mission": "Find high-signal builders.",
                "voice": "Warm and direct.",
                "priorities": ["Ask what people are building"],
                "privacy_rules": ["No private details"],
                "matching_rules": ["Prefer builders"],
                "conversation_rules": ["Keep it short"],
                "refusal_or_boundary_rules": ["No flirting"],
            }
        },
        "matching_vector": {},
    }
    instruction = build_system_instruction(synthesis, user.name)

    pv = ProfileVersion(
        user_id=user.id,
        version=1,
        profile_yaml="identity_snapshot:\n  public_safe_summary: null",
        matching_vector=json.dumps(synthesis),
        system_instruction=instruction,
        is_active=True,
    )
    session.add(pv)
    session.commit()

    prompt = build_twin_system_prompt(user, "custom", session)
    assert "custom twin with a full profile" in prompt
    assert "Find high-signal builders" in prompt
    assert "Divergent-thinking / openness score: 69/100" in prompt
    assert "Mode: Open / Custom" in prompt
    assert "no detailed profile provided yet" not in prompt


def test_build_twin_system_prompt_prefers_rich_persona_over_stub_instruction(session):
    user = User(
        name="Alexis",
        email="e@test",
        google_id="test-e",
        persona="Outdoorsy AI engineer and climber.",
        dat_score=82.0,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    pv = ProfileVersion(
        user_id=user.id,
        version=1,
        profile_yaml="identity_snapshot:\n  public_safe_summary: yaml summary",
        system_instruction="You are Alexis's digital twin.\n\nPriorities:\n- Be authentic and helpful.",
        is_active=True,
    )
    session.add(pv)
    session.commit()

    prompt = build_twin_system_prompt(user, "custom", session)
    assert "Outdoorsy AI engineer and climber" in prompt
    assert "== About Alexis ==" in prompt


def test_persona_with_openness_includes_dat_line(session):
    user = User(name="Alexis", email="d@test", google_id="test-d", persona="Builder.", dat_score=69.3)
    session.add(user)
    session.commit()
    session.refresh(user)

    persona = persona_with_openness(user, session)
    assert "Builder." in persona
    assert "69/100" in persona
