"""Tests for twin system prompt resolution."""

from app.agents.twin_prompt import build_twin_system_prompt, persona_with_openness, resolve_persona
from app.models import ProfileVersion, User


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
        system_instruction="You are Alexis's digital twin.\n\nMission: Represent the user authentically.",
        is_active=True,
    )
    session.add(pv)
    session.commit()

    prompt = build_twin_system_prompt(user, "custom", session)
    assert "Outdoorsy AI engineer and climber" in prompt
    assert "== About Alexis ==" in prompt


def test_build_twin_system_prompt_uses_system_instruction(session):
    user = User(name="Alexis", email="c@test", google_id="test-c", persona=None, dat_score=69.0)
    session.add(user)
    session.commit()
    session.refresh(user)

    pv = ProfileVersion(
        user_id=user.id,
        version=1,
        profile_yaml="identity_snapshot:\n  public_safe_summary: null",
        system_instruction="You are Alexis's custom twin with a full profile.",
        is_active=True,
    )
    session.add(pv)
    session.commit()

    prompt = build_twin_system_prompt(user, "custom", session)
    assert "custom twin with a full profile" in prompt
    assert "Divergent-thinking / openness score: 69/100" in prompt
    assert "no detailed profile provided yet" not in prompt


def test_persona_with_openness_includes_dat_line(session):
    user = User(name="Alexis", email="d@test", google_id="test-d", persona="Builder.", dat_score=69.3)
    session.add(user)
    session.commit()
    session.refresh(user)

    persona = persona_with_openness(user, session)
    assert "Builder." in persona
    assert "69/100" in persona
