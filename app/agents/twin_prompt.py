"""Shared twin system-prompt resolution for arena and chatroom engines."""

from sqlmodel import Session

from app.agents.dat import openness_line
from app.agents.profile import _derive_persona, get_active_profile
from app.agents.prompts import MODE_GUIDELINES, TWIN_SYSTEM_PROMPT
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


def build_twin_system_prompt(user: User, mode: str, session: Session | None = None) -> str:
    """Build the runnable system prompt for a user's twin."""
    persona = persona_with_openness(user, session)

    if session is not None and not _has_real_persona(persona):
        pv = get_active_profile(session, user.id)
        if pv and pv.system_instruction:
            system = pv.system_instruction
            line = openness_line(user.dat_score)
            if line:
                return f"{system}\n\n{line}"
            return system

    mode_guidelines = MODE_GUIDELINES.get(mode, MODE_GUIDELINES["networking"])
    return TWIN_SYSTEM_PROMPT.format(
        name=user.name,
        persona=persona,
        mode_guidelines=mode_guidelines,
    )
