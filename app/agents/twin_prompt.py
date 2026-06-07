"""Shared twin system-prompt resolution for arena and chatroom engines."""

from sqlmodel import Session

from app.agents.dat import openness_line
from app.agents.profile import _derive_persona, get_active_profile
from app.agents.prompts import MODE_GUIDELINES, TWIN_SYSTEM_PROMPT
from app.agents.synthesis import (
    build_system_instruction,
    is_stub_instruction,
    load_synthesis_from_profile_version,
)
from app.models import User


def resolve_persona(user: User, session: Session | None = None) -> str:
    """Best available persona text for prompts and scoring."""
    if user.persona and user.persona.strip():
        return user.persona.strip()

    if session is not None:
        pv = get_active_profile(session, user.id)
        if pv and pv.profile_yaml:
            derived = _derive_persona(pv.profile_yaml)
            if derived:
                return derived

    return f"{user.name} — no detailed profile provided yet."


def persona_with_openness(user: User, session: Session | None = None) -> str:
    """Persona text including the DAT openness line when available."""
    persona = resolve_persona(user, session)
    line = openness_line(user.dat_score)
    if line:
        return f"{persona}\n\n{line}"
    return persona


def _has_real_persona(persona: str) -> bool:
    return bool(persona.strip()) and "no detailed profile provided yet" not in persona


def _append_mode_and_dat(instruction: str, mode: str, user: User) -> str:
    mode_guidelines = MODE_GUIDELINES.get(mode, MODE_GUIDELINES["networking"])
    parts = [instruction.rstrip(), f"\n\n== {mode.replace('_', ' ').title()} mode ==\n{mode_guidelines}"]
    line = openness_line(user.dat_score)
    if line:
        parts.append(f"\n\n{line}")
    return "\n".join(parts)


def _synthesized_instruction(user: User, session: Session) -> str | None:
    pv = get_active_profile(session, user.id)
    if not pv:
        return None

    if pv.system_instruction and not is_stub_instruction(pv.system_instruction):
        return pv.system_instruction

    synthesis = load_synthesis_from_profile_version(pv.matching_vector)
    if synthesis.get("profile"):
        rebuilt = build_system_instruction(synthesis, user.name)
        if not is_stub_instruction(rebuilt):
            return rebuilt

    return None


def build_twin_system_prompt(user: User, mode: str, session: Session | None = None) -> str:
    """Build the runnable system prompt for a user's twin."""
    persona = persona_with_openness(user, session)

    if session is not None:
        synthesized = _synthesized_instruction(user, session)
        if synthesized:
            return _append_mode_and_dat(synthesized, mode, user)

    mode_guidelines = MODE_GUIDELINES.get(mode, MODE_GUIDELINES["networking"])
    return TWIN_SYSTEM_PROMPT.format(
        name=user.name,
        persona=persona,
        mode_guidelines=mode_guidelines,
    )
