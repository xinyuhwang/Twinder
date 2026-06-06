import re
from typing import Optional

import yaml
from sqlmodel import Session, select

from app.llm import chat
from app.models import ProfileVersion, User
from app.observability import op

INTAKE_PROMPT = """You are a Twinder Matchmaker building a structured profile for a user's digital twin.

Your job is to extract useful self-knowledge, compatibility signals, social patterns, communication style, recurring interests, and meta-insights about how the user thinks, what they care about, and what kinds of people they may connect with.

You must clearly distinguish:
* facts explicitly provided
* high-confidence observed patterns
* low-confidence inferences
* sensitive/private information that should not be shared outwardly

## Privacy rules

Carefully separate public-safe from private/sensitive content.

Do NOT expose intimate, medical, sexual, financial, legal, trauma-related, relationship-specific, or highly personal details as public-facing content.

Mark sensitive material under `privacy_model.sensitive_do_not_share` or `privacy_model.internal_only`.

## What to extract

* who the user is and what they care about
* what they are working on
* what kind of brain they seem to have
* what kinds of people they may want to meet
* how they communicate
* what they can help others with
* what others might help them with
* what makes them feel interested, connected, or understood
* what their digital twin should sound like
* what should stay private

## Agent behavior

The digital twin may represent the user's interests, identify overlap, ask curious questions, and surface reasons to meet. It must not flirt as the user, make commitments, reveal private info, or overstate certainty.

## Output format

Return ONLY valid YAML. No prose before or after. Use null where information is missing. Mark uncertain inferences as low confidence.

## YAML schema

```yaml
Twinder_external_profile_version: "1.1"

identity_snapshot:
  display_name:
  pronouns:
  location:
  known_roles:
    -
  self_descriptions:
    -
  short_internal_summary:
  public_safe_summary:
  confidence: high | medium | low

matchmaker_summary:
  one_sentence_read:
  deeper_read:
  what_kind_of_person_this_seems_to_be:
    -
  what_their_brain_seems_to_do:
    -
  what_they_may_be_seeking:
    -
  what_might_make_them_light_up:
    -
  what_might_make_them_shut_down:
    -
  confidence: high | medium | low

profile_positioning:
  one_sentence_summary:
  longer_summary:
  best_contexts_for_matching:
    - networking
  what_people_should_understand:
    -
  confidence: high | medium | low

interests:
  professional:
    -
  creative:
    -
  intellectual:
    -
  social:
    -
  lifestyle:
    -
  niche_obsessions:
    -

values_and_motivations:
  likely_values:
    -
  what_seems_to_energize_me:
    -
  what_seems_to_drain_me:
    -
  tensions_or_contradictions:
    -

communication_style:
  tone:
    -
  humor_style:
  emotional_directness: low | medium | high | unknown
  formality: casual | balanced | polished | unknown
  likely_agent_voice:
    summary:
    tone_words:
      -
    should_sound:
      -
    should_not_sound:
      -

skills_and_strengths:
  professional_skills:
    -
  interpersonal_strengths:
    -
  technical_strengths:
    -

help_exchange:
  i_can_help_others_with:
    -
  i_might_want_help_with:
    -

social_and_matching_intelligence:
  people_i_may_want_to_meet:
    -
  energies_i_seem_drawn_to:
    -
  energies_that_may_not_work_for_me:
    -

privacy_model:
  public_safe:
    -
  internal_only:
    -
  sensitive_do_not_share:
    -
  default_privacy_level: medium

agent_instruction_seeds:
  represent_me_as:
    -
  emphasize:
    -
  never_claim:
    -
  matchmaker_notes_for_agent:
    -
```

## Final instruction

The user has provided context below. Generate the YAML profile directly — do NOT ask follow-up questions. If information is missing, use null or low-confidence inferences. Output YAML only."""


@op(name="generate_profile")
async def generate_profile(raw_context: str, answers: dict | None = None) -> str:
    """Run intake → return profile YAML string (stored server-side, never raw to client)."""
    user_content = _format_intake_input(raw_context, answers)
    return await chat(
        messages=[{"role": "user", "content": user_content}],
        system=INTAKE_PROMPT,
        max_tokens=2000,
    )


def _format_intake_input(raw_context: str, answers: dict | None) -> str:
    parts = [f"User context:\n{raw_context}"]
    if answers:
        parts.append("Additional answers:\n" + "\n".join(f"- {k}: {v}" for k, v in answers.items()))
    return "\n\n".join(parts)


def _parse_yaml(text: str) -> dict:
    """Extract YAML from LLM response, handling markdown code blocks."""
    text = text.strip()
    match = re.search(r"```(?:yaml)?\s*\n?(.*?)\n?\s*```", text, re.DOTALL)
    if match:
        text = match.group(1).strip()
    try:
        result = yaml.safe_load(text)
        return result if isinstance(result, dict) else {}
    except yaml.YAMLError:
        return {}


def _derive_persona(yaml_str: str) -> str:
    """Build a short public-safe persona string for the engine fallback."""
    data = _parse_yaml(yaml_str)
    parts = []

    identity = data.get("identity_snapshot", {}) or {}
    summary = identity.get("public_safe_summary") or identity.get("short_internal_summary")
    if summary:
        parts.append(str(summary))

    interests = data.get("interests", {}) or {}
    flat_interests = []
    for category in ("professional", "intellectual", "creative", "niche_obsessions"):
        items = interests.get(category) or []
        if isinstance(items, list):
            flat_interests.extend([str(i) for i in items if i])
    if flat_interests:
        parts.append("Interests: " + ", ".join(flat_interests[:6]))

    help_ex = data.get("help_exchange", {}) or {}
    can_help = help_ex.get("i_can_help_others_with") or []
    if isinstance(can_help, list) and can_help:
        parts.append("Can help with: " + ", ".join(str(i) for i in can_help[:3] if i))

    matching = data.get("social_and_matching_intelligence", {}) or {}
    looking_for = matching.get("people_i_may_want_to_meet") or []
    if isinstance(looking_for, list) and looking_for:
        parts.append("Looking for: " + ", ".join(str(i) for i in looking_for[:3] if i))

    return "\n\n".join(parts) if parts else ""


def _to_twin_preview(yaml_str: str) -> dict:
    """Extract only public-safe fields for the TwinPreview response."""
    data = _parse_yaml(yaml_str)

    # public_safe_summary
    identity = data.get("identity_snapshot", {}) or {}
    summary = identity.get("public_safe_summary")

    # interests — flatten all categories
    interests_data = data.get("interests", {}) or {}
    interests: list[str] = []
    for category in ("professional", "intellectual", "creative", "social", "lifestyle", "niche_obsessions"):
        items = interests_data.get(category) or []
        if isinstance(items, list):
            interests.extend([str(i) for i in items if i])

    # looking_for
    matching = data.get("social_and_matching_intelligence", {}) or {}
    looking_for_raw = matching.get("people_i_may_want_to_meet") or []
    looking_for = [str(i) for i in looking_for_raw if i] if isinstance(looking_for_raw, list) else []

    return {
        "public_safe_summary": str(summary) if summary else None,
        "looking_for": looking_for[:5],
        "interests": interests[:10],
    }


def get_active_profile(session: Session, user_id: int) -> Optional[ProfileVersion]:
    return session.exec(
        select(ProfileVersion).where(
            ProfileVersion.user_id == user_id,
            ProfileVersion.is_active == True,
        )
    ).first()


def new_profile_version(session: Session, user_id: int, **fields) -> ProfileVersion:
    """Deactivate prior active versions, create and return a new active one."""
    # Deactivate all active versions for this user
    existing = session.exec(
        select(ProfileVersion).where(
            ProfileVersion.user_id == user_id,
            ProfileVersion.is_active == True,
        )
    ).all()
    max_version = 0
    for pv in existing:
        pv.is_active = False
        session.add(pv)
        max_version = max(max_version, pv.version)

    pv = ProfileVersion(
        user_id=user_id,
        version=max_version + 1,
        is_active=True,
        **fields,
    )
    session.add(pv)
    session.flush()
    return pv
