import re
from typing import Optional

import yaml
from sqlmodel import Session, select

from app.config import settings
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

follow_up_questions:
  - question:
    targets_gap_in:
  - question:
    targets_gap_in:
  - question:
    targets_gap_in:
```

## Final instruction

The user has provided context below. Generate the YAML profile directly. After the profile, include a `follow_up_questions` list of 1–3 targeted questions for information that is missing or low-confidence in the profile you just generated. Do not ask about anything the provided context already answered clearly. Output YAML only."""


@op(name="generate_profile")
async def generate_profile(raw_context: str, answers: dict | None = None) -> str:
    """Run intake → return profile YAML string (stored server-side, never raw to client)."""
    user_content = _format_intake_input(raw_context, answers)
    return await chat(
        messages=[{"role": "user", "content": user_content}],
        system=INTAKE_PROMPT,
        model=settings.llm_intake_model,
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
    """Build a rich public-safe persona string from the profile YAML.

    Handles both the v1.1 intake schema and the v2.2/2.3 synthesis schema.
    Pulls from vibe model, thinking style, values, and compatibility signals —
    not just bio + interests.
    """
    data = _parse_yaml(yaml_str)

    # Synthesis output nests everything under twinder_profile
    profile = data.get("twinder_profile") or data
    parts = []

    # Identity + vibe (one-liner that captures personality, not just role)
    identity = profile.get("user_identity") or profile.get("identity_snapshot") or {}
    vibe = profile.get("vibe_model") or profile.get("matchmaker_summary") or {}

    vibe_line = (
        vibe.get("one_sentence_vibe")
        or identity.get("public_safe_summary")
        or identity.get("short_internal_summary")
    )
    if vibe_line:
        parts.append(str(vibe_line))

    deeper = vibe.get("deeper_vibe_read")
    if deeper:
        parts.append(str(deeper))

    # Emotional texture / what makes them distinctively themselves
    texture = vibe.get("emotional_texture") or []
    if isinstance(texture, list) and texture:
        items = [str(t) for t in texture[:3] if t]
        if items:
            parts.append("Texture: " + "; ".join(items))

    # What makes them light up and shut down
    light_up = vibe.get("what_makes_them_light_up") or []
    if isinstance(light_up, list) and light_up:
        items = [str(i) for i in light_up[:4] if i]
        if items:
            parts.append("Lights up: " + "; ".join(items))

    shut_down = vibe.get("what_makes_them_shut_down") or []
    if isinstance(shut_down, list) and shut_down:
        items = [str(i) for i in shut_down[:3] if i]
        if items:
            parts.append("Shuts down: " + "; ".join(items))

    # Thinking style — how their brain actually works
    thinking = profile.get("thinking_and_decision_style") or {}
    ts = thinking.get("thinking_style") or []
    if isinstance(ts, list) and ts:
        items = [str(i) for i in ts[:3] if i]
        if items:
            parts.append("Thinks: " + "; ".join(items))

    # Values — the motivational core
    pv = profile.get("personality_and_values") or {}
    values = pv.get("likely_values") or []
    if isinstance(values, list) and values:
        items = [str(v) for v in values[:6] if v]
        if items:
            parts.append("Values: " + ", ".join(items))

    # Interests
    interests_data = profile.get("interests") or {}
    flat_interests: list[str] = []
    for cat in ("professional", "intellectual", "creative", "niche_obsessions"):
        for item in (interests_data.get(cat) or []):
            if item:
                flat_interests.append(str(item))
    if flat_interests:
        parts.append("Interests: " + ", ".join(flat_interests[:8]))

    # Communication / voice
    comm = profile.get("communication_style") or {}
    voice = comm.get("likely_twin_voice") or {}
    voice_summary = voice.get("summary")
    if voice_summary:
        parts.append("Voice: " + str(voice_summary))

    # Compatibility signals — what to look for (and avoid)
    compat = profile.get("compatibility_signals") or {}
    green = compat.get("likely_green_flags") or []
    if isinstance(green, list) and green:
        items = [str(i) for i in green[:4] if i]
        if items:
            parts.append("Green flags: " + ", ".join(items))

    red = compat.get("likely_red_flags_or_mismatches") or []
    if isinstance(red, list) and red:
        items = [str(i) for i in red[:3] if i]
        if items:
            parts.append("Mismatches: " + ", ".join(items))

    # Irreducible combination from compatibility_model
    compat_model = profile.get("compatibility_model") or {}
    irreducible = compat_model.get("irreducible_combination") or []
    if isinstance(irreducible, list) and irreducible:
        items = [str(i) for i in irreducible[:3] if i]
        if items:
            parts.append("What makes them unique: " + "; ".join(items))

    # What they're looking for
    looking = profile.get("looking_for") or {}
    explicit = looking.get("explicit_people_requested") or []
    if isinstance(explicit, list) and explicit:
        items = [str(i) for i in explicit[:3] if i]
        if items:
            parts.append("Looking for: " + "; ".join(items))
    energies = looking.get("energies") or []
    if isinstance(energies, list) and energies:
        items = [str(i) for i in energies[:4] if i]
        if items:
            parts.append("Drawn to: " + ", ".join(items))

    # Help exchange
    skills = profile.get("skills_and_strengths") or {}
    can_help = skills.get("can_help_with") or []
    if not can_help:
        help_ex = profile.get("help_exchange") or {}
        can_help = help_ex.get("i_can_help_others_with") or []
    if isinstance(can_help, list) and can_help:
        items = [str(i) for i in can_help[:3] if i]
        if items:
            parts.append("Can help with: " + ", ".join(items))

    return "\n\n".join(parts) if parts else ""


def _rich_scoring_context_from_synthesis(synthesis: dict) -> str:
    """Build a rich compatibility context string from the synthesis dict for scoring prompts.

    This is used to give the match card scorer deep signal about each user —
    the 4 compatibility dimensions, not just a bio summary.
    """
    profile = synthesis.get("profile") or {}
    mv = synthesis.get("matching_vector") or {}
    parts = []

    # Core identity
    identity = profile.get("user_identity") or {}
    summary = identity.get("internal_summary") or identity.get("public_safe_summary")
    if summary:
        parts.append(f"Profile: {summary}")

    # Vibe model
    vibe = profile.get("vibe_model") or {}
    deeper = vibe.get("deeper_vibe_read")
    if deeper:
        parts.append(f"Vibe: {deeper}")
    texture = vibe.get("emotional_texture") or []
    if isinstance(texture, list) and texture:
        parts.append("Emotional texture: " + "; ".join(str(t) for t in texture[:3] if t))
    light_up = vibe.get("what_makes_them_light_up") or []
    if isinstance(light_up, list) and light_up:
        parts.append("Lights up: " + "; ".join(str(i) for i in light_up[:4] if i))
    shut_down = vibe.get("what_makes_them_shut_down") or []
    if isinstance(shut_down, list) and shut_down:
        parts.append("Shuts down: " + "; ".join(str(i) for i in shut_down[:3] if i))

    # Thinking style
    thinking = profile.get("thinking_and_decision_style") or {}
    ts = thinking.get("thinking_style") or []
    if isinstance(ts, list) and ts:
        parts.append("Thinking style: " + "; ".join(str(i) for i in ts[:3] if i))

    # Compatibility model — the 4 dimensions
    compat_model = profile.get("compatibility_model") or {}

    pa = compat_model.get("personality_alignment") or {}
    oe = pa.get("openness_to_experience") or {}
    if oe.get("proxy_score") is not None:
        evidence = oe.get("evidence") or []
        ev_str = ("; ".join(str(e) for e in evidence[:2] if e)) if evidence else ""
        parts.append(
            f"Openness to experience: {oe['proxy_score']} ({oe.get('confidence', 'medium')} confidence)"
            + (f" — {ev_str}" if ev_str else "")
        )
    ie = pa.get("intellectual_engagement") or {}
    if ie.get("proxy_score") is not None:
        style = ie.get("style", "")
        parts.append(
            f"Intellectual engagement: {ie['proxy_score']}"
            + (f", style: {style}" if style else "")
        )
    for key, label in [("agreeableness", "Agreeableness"), ("emotional_stability", "Emotional stability")]:
        entry = pa.get(key) or {}
        if entry.get("proxy_score") is not None:
            parts.append(f"{label}: {entry['proxy_score']}")

    vr = compat_model.get("values_resonance") or {}
    for key, label in [
        ("self_transcendence", "Self-transcendence"),
        ("communal_strength", "Communal strength"),
        ("intrinsic_motivation", "Intrinsic motivation"),
    ]:
        entry = vr.get(key) or {}
        signals = entry.get("signals") or []
        score = entry.get("proxy_score")
        if score is not None or signals:
            sig_str = ("; ".join(str(s) for s in signals[:2] if s)) if signals else ""
            line = f"{label}: {score}" if score is not None else label
            if sig_str:
                line += f" — {sig_str}"
            parts.append(line)

    rc = compat_model.get("relational_chemistry") or {}
    if rc:
        chem_parts = []
        for key in ("language_register", "humor_density", "emotional_expressiveness"):
            val = rc.get(key)
            if val:
                chem_parts.append(f"{key.replace('_', ' ')}: {val}")
        abst = rc.get("abstraction_preference")
        if abst is not None:
            chem_parts.append(f"abstraction preference: {abst}")
        if chem_parts:
            parts.append("Communication chemistry: " + ", ".join(chem_parts))
        resonance = rc.get("resonance_triggers") or []
        if isinstance(resonance, list) and resonance:
            parts.append("Resonates with: " + "; ".join(str(r) for r in resonance[:3] if r))
        dissonance = rc.get("dissonance_triggers") or []
        if isinstance(dissonance, list) and dissonance:
            parts.append("Friction from: " + "; ".join(str(d) for d in dissonance[:3] if d))

    irreducible = compat_model.get("irreducible_combination") or []
    if isinstance(irreducible, list) and irreducible:
        parts.append("Irreducible combination: " + "; ".join(str(i) for i in irreducible[:4] if i))

    # Compatibility signals (green/red flags)
    compat = profile.get("compatibility_signals") or {}
    green = compat.get("likely_green_flags") or []
    if isinstance(green, list) and green:
        parts.append("Green flags: " + ", ".join(str(i) for i in green[:5] if i))
    red = compat.get("likely_red_flags_or_mismatches") or []
    if isinstance(red, list) and red:
        parts.append("Red flags: " + ", ".join(str(i) for i in red[:3] if i))
    complementary = compat.get("complementary_traits") or []
    if isinstance(complementary, list) and complementary:
        parts.append("Complemented by: " + ", ".join(str(i) for i in complementary[:4] if i))
    useful_tensions = compat.get("useful_tensions") or []
    if isinstance(useful_tensions, list) and useful_tensions:
        parts.append("Useful tensions: " + "; ".join(str(i) for i in useful_tensions[:3] if i))

    # Numeric vector axes (for scoring context)
    pa_mv = mv.get("personality_axis") or {}
    if pa_mv:
        scores = []
        for k in ("openness_to_experience", "intellectual_engagement", "agreeableness", "emotional_stability"):
            v = pa_mv.get(k) or {}
            if v.get("score") is not None:
                scores.append(f"{k.replace('_', ' ')}: {v['score']}")
        if scores:
            parts.append("Personality vector: " + "; ".join(scores))

    va_mv = mv.get("values_axis") or {}
    if va_mv:
        scores = []
        for k in ("self_transcendence", "communal_strength", "intrinsic_motivation"):
            v = va_mv.get(k) or {}
            if v.get("score") is not None:
                scores.append(f"{k.replace('_', ' ')}: {v['score']}")
        if scores:
            parts.append("Values vector: " + "; ".join(scores))

    ca_mv = mv.get("chemistry_axis") or {}
    if ca_mv:
        scores = []
        for k in ("language_formality", "humor_density", "emotional_expressiveness", "abstraction_preference"):
            v = ca_mv.get(k) or {}
            if v.get("score") is not None:
                scores.append(f"{k.replace('_', ' ')}: {v['score']}")
        if scores:
            parts.append("Chemistry vector: " + "; ".join(scores))

    # Symbolic profile — archetypal companion energy and self-image
    symbolic = profile.get("symbolic_profile") or {}
    animal_sec = symbolic.get("animal_companion") or {}
    companion_energy = animal_sec.get("inferred_companion_energy")
    companion_traits = animal_sec.get("inferred_desired_companion_traits") or []
    if companion_energy or companion_traits:
        trait_str = "; ".join(str(t) for t in companion_traits[:3] if t)
        line = f"Desired companion energy: {companion_energy}" if companion_energy else "Desired companion traits:"
        if trait_str:
            line += f" — {trait_str}"
        parts.append(line)

    color_sec = symbolic.get("color_self_image") or {}
    aesthetic_energy = color_sec.get("inferred_aesthetic_energy")
    self_image = color_sec.get("inferred_self_image") or []
    if aesthetic_energy or self_image:
        image_str = "; ".join(str(s) for s in self_image[:3] if s)
        line = f"Self-image / energy: {aesthetic_energy}" if aesthetic_energy else "Self-image:"
        if image_str:
            line += f" — {image_str}"
        parts.append(line)

    # What they're looking for
    looking = profile.get("looking_for") or {}
    explicit = looking.get("explicit_people_requested") or []
    if isinstance(explicit, list) and explicit:
        parts.append("Explicitly wants: " + "; ".join(str(i) for i in explicit[:3] if i))

    return "\n".join(parts) if parts else ""


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


def _extract_follow_up_questions(yaml_str: str) -> list[str]:
    data = _parse_yaml(yaml_str)
    raw = data.get("follow_up_questions") or []
    questions: list[str] = []
    for item in raw:
        if isinstance(item, str):
            questions.append(item)
        elif isinstance(item, dict):
            q = item.get("question") or ""
            if q:
                questions.append(str(q))
    return questions[:3]


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
