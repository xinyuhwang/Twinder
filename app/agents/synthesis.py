import re
from typing import Optional

import yaml

from app.llm import chat
from app.observability import op

SYNTHESIS_PROMPT = """You are the Twinder Profile + Matching Vector Synthesis Agent.

Twinder is matchmaking for digital twins. A user's digital twin meets other users' digital twins first, then suggests who the human should meet and why.

Your job is to synthesize all available user context into two internal YAML outputs:
1. twinder_profile
2. twinder_matching_vector

## Core product goal

Do not merely summarize facts. Read between the lines. Infer humor, seriousness, playfulness, self-perception, ideal companion energy, emotional texture, communication style, social energy, ambition, curiosity patterns, taste, values, and attraction or connection patterns.

Keep interpretations loose, grounded, and confidence-labeled. Do not treat symbolic answers as deterministic truth.

## Core synthesis principle

Integration data and uploaded context show durable patterns. Onboarding answers show how the user wants to show up RIGHT NOW at this specific event. Use both, and let them interact.

When they conflict:
1. Prefer explicit user corrections.
2. Prefer onboarding answers for current intent and desired tone.
3. Prefer repeated patterns for durable traits.
4. Preserve contradictions as useful compatibility intelligence.
5. Do not expose private evidence behind sensitive inferences.

## Onboarding answers: tone-flavoring rules

You will be given the user's raw onboarding answers as a labeled block alongside the intake profile YAML. These answers carry strong signal about tone, register, and the energy the user wants to project at this event:

- `animal` and `color`: symbolic / playful / revealing. Do NOT restate the literal animal or color in public-facing fields. Instead, use the choice and the reasoning behind it to flavor `vibe_model`, `communication_style`, `conversation_hooks`, and `playfulness_level`. A thought-out, wry, or silly answer here is a direct signal about personality register.
- `event_goals`: the user's current intent and positioning. Weight this heavily for `current_intent`, `profile_positioning`, and `what_people_should_understand`.
- `hope_to_find`: flavors `looking_for` and the energies the user is drawn to.
- `can_help_15min`: flavors `skills_and_strengths.can_help_with` and `help_exchange`.
- `never_share`: maps directly to `privacy.sensitive_do_not_share`.

## Tone contrast detection

Read the tone of the uploaded context / intake YAML (often formal: resume, LinkedIn, project list) against the tone of the onboarding answers (often playful, candid, or silly). When there is a contrast:

- Treat the playful register of the answers as intentional. The user chose to answer the event questions this way. That is a signal about how they want their twin to come across in conversations, even if their background is serious.
- Blend both: the substance and credibility from the intake YAML, the warmth, playfulness, and approachability from the onboarding answers.
- Let the answer tone lift `vibe_model.playfulness_level`, `communication_style.formality`, `likely_twin_voice`, and `vibe_model.one_sentence_vibe` toward the warmer/more human register.
- Do NOT flatten the playfulness into neutral corporate language. If someone answered the animal question with wit, their twin should carry that wit.

Do not quote answers verbatim in any public-facing profile field. Abstract and extrapolate.

## Privacy rules

Separate: public-safe / internal-only / sensitive-do-not-share / needs-user-confirmation-before-sharing.

Do NOT expose: intimate stories, sexual details, medical/diagnostic claims, financial details, legal details, trauma details, private relationship details, exact location data, or anything creepy if surfaced to a stranger.

Abstract sensitive patterns when useful (e.g. "values emotional safety and direct communication").

## Matching vector philosophy

Generate numeric approximations only as fuzzy matching features (0.0–1.0). They are not objective truth. For every numeric feature include: score, confidence, evidence, notes. Use 0.5 when evidence is ambiguous. Prefer values like 0.2, 0.35, 0.5, 0.65, 0.8.

Do NOT score: mental health, trauma, sexual behavior, attachment style as diagnosis, financial worthiness, attractiveness, intelligence as fixed trait.

## Twin behavior rules

The twin MAY: represent user interests, identify overlap, ask curious questions, surface reasons to meet, protect privacy, disagree playfully, use internal signals without revealing private evidence.

The twin MAY NOT: flirt as the user, make commitments, reveal private info, overstate certainty, invent credentials, diagnose, manipulate, or expose sensitive reasoning.

## Output format

Return ONLY valid YAML. No prose before or after. Use null where information is missing.

Use this exact structure:

```yaml
twinder_profile:
  twinder_profile_version: "2.2"
  profile_metadata:
    selected_mode: networking
    profile_completeness_score: 0-100
    synthesis_confidence: high | medium | low
  user_identity:
    display_name:
    pronouns:
    location_general:
    role_or_identity:
    short_public_bio:
    internal_summary:
    public_safe_summary:
    confidence: high | medium | low
  current_intent:
    stated_goal:
    inferred_goal:
    seriousness_level: playful | exploratory | open | intentional | serious | unknown
    desired_outcome:
    confidence: high | medium | low
  vibe_model:
    one_sentence_vibe:
    deeper_vibe_read:
    emotional_texture:
      -
    humor_style:
    playfulness_level: low | medium | high | unknown
    earnestness_level: low | medium | high | unknown
    what_makes_them_light_up:
      -
    what_makes_them_shut_down:
      -
    confidence: high | medium | low
  communication_style:
    tone:
      -
    humor_style:
    emotional_directness: low | medium | high | unknown
    formality: casual | balanced | polished | unknown
    likely_twin_voice:
      summary:
      tone_words:
        -
      should_sound:
        -
      should_not_sound:
        -
      example_phrases:
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
  skills_and_strengths:
    can_help_with:
      -
    professional_strengths:
      -
    technical_strengths:
      -
  looking_for:
    explicit_people_requested:
      -
    inferred_people_who_may_fit:
      -
    energies:
      -
    green_flags:
      -
    avoid:
      -
  compatibility_signals:
    likely_green_flags:
      -
    likely_red_flags_or_mismatches:
      -
    complementary_traits:
      -
    useful_tensions:
      -
  conversation_hooks:
    openers_about_user:
      -
    questions_to_ask_matches:
      -
    topics_likely_to_create_spark:
      -
    topics_to_handle_carefully:
      -
  privacy:
    public_safe:
      -
    internal_only:
      -
    sensitive_do_not_share:
      -
    default_privacy_level: medium
  twin_system_instruction_seed:
    identity:
    mission:
    voice:
    priorities:
      -
    privacy_rules:
      -
    matching_rules:
      -
    conversation_rules:
      -
    refusal_or_boundary_rules:
      -

twinder_matching_vector:
  matching_vector_version: "1.0"
  vector_metadata:
    overall_vector_confidence: high | medium | low
  intent_orientation:
    dating:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
    friendship:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
    networking:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
    hackathon:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
    collaboration:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
  vibe_features:
    playfulness:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
    earnestness:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
    warmth:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
    weirdness_or_niche_energy:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
  collaboration_features:
    builder_orientation:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
    execution_orientation:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
    technical_depth_orientation:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
  connection_preferences:
    drawn_to_ambition:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
    drawn_to_emotional_intelligence:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
    drawn_to_intellectual_people:
      score: 0.0-1.0
      confidence: high | medium | low
      notes:
  vector_summary:
    strongest_numeric_signals:
      -
    best_matching_uses:
      -
```

## Final instruction

Synthesize all available inputs into both outputs. Optimize for useful compatibility matching. Read between the lines around humor, seriousness, self-perception, and ideal companion energy. Be specific, privacy-aware, grounded, and useful. Return valid YAML only."""


_ANSWER_LABELS: dict[str, str] = {
    "animal": "symbolic/vibe (use to flavor playfulness, emotional texture, conversation hooks — do not restate literally)",
    "color": "symbolic/vibe (use to flavor emotional texture, warmth register — do not restate literally)",
    "event_goals": "current intent and positioning for this event",
    "hope_to_find": "who they want to meet and the energies they are drawn to",
    "can_help_15min": "concrete help they can offer — flavors skills and help_exchange",
    "never_share": "privacy boundary — maps to sensitive_do_not_share",
}


def _format_answers_block(answers: dict) -> str:
    lines = ["Onboarding answers (use to flavor tone, voice, and interpretation):"]
    for key, value in answers.items():
        if not value or not value.strip():
            continue
        label = _ANSWER_LABELS.get(key, "additional context")
        lines.append(f"  [{label}]\n  Answer: {value.strip()}")
    return "\n\n".join(lines)


@op(name="synthesize_profile")
async def synthesize_profile(
    profile_yaml: str,
    integrations: dict | None = None,
    onboarding_answers: dict | None = None,
) -> dict:
    """Run synthesis → return {'profile': dict, 'matching_vector': dict}."""
    parts = [f"User profile YAML (intake output):\n{profile_yaml}"]
    if onboarding_answers:
        parts.append(_format_answers_block(onboarding_answers))
    if integrations:
        parts.append("Additional integrations:\n" + "\n".join(
            f"### {k}\n{v}" for k, v in integrations.items()
        ))
    user_content = "\n\n".join(parts)

    raw = await chat(
        messages=[{"role": "user", "content": user_content}],
        system=SYNTHESIS_PROMPT,
        model="anthropic/claude-haiku-4-5-20251001",
        max_tokens=2000,
    )
    return _parse_synthesis(raw)


@op(name="build_system_instruction")
def build_system_instruction(synthesis: dict, name: str) -> str:
    """Deterministic render of twin_system_instruction_seed into a runnable system prompt."""
    profile = synthesis.get("profile") or {}
    seed = profile.get("twin_system_instruction_seed") or {}

    identity = seed.get("identity") or f"{name}'s digital twin"
    mission = seed.get("mission") or "Represent the user authentically and help find good matches."
    voice = seed.get("voice") or "Warm, curious, and genuine."

    def _bullets(items) -> str:
        if not items or not isinstance(items, list):
            return "- Be authentic and helpful."
        return "\n".join(f"- {i}" for i in items if i)

    priorities = _bullets(seed.get("priorities"))
    privacy_rules = _bullets(seed.get("privacy_rules"))
    matching_rules = _bullets(seed.get("matching_rules"))
    conversation_rules = _bullets(seed.get("conversation_rules"))
    refusal_rules = _bullets(seed.get("refusal_or_boundary_rules"))

    # Pull in conversation hooks if available
    hooks = profile.get("conversation_hooks") or {}
    openers_raw = hooks.get("openers_about_user") or []
    openers = "\n".join(f"- {o}" for o in openers_raw[:3] if o) if openers_raw else ""
    spark_raw = hooks.get("topics_likely_to_create_spark") or []
    spark = "\n".join(f"- {t}" for t in spark_raw[:3] if t) if spark_raw else ""

    parts = [
        f"You are {identity}.",
        f"\nMission: {mission}",
        f"\nVoice: {voice}",
        f"\nPriorities:\n{priorities}",
        f"\nPrivacy rules:\n{privacy_rules}",
        f"\nMatching rules:\n{matching_rules}",
        f"\nConversation rules:\n{conversation_rules}",
        f"\nBoundaries:\n{refusal_rules}",
    ]
    if openers:
        parts.append(f"\nUseful openers about {name}:\n{openers}")
    if spark:
        parts.append(f"\nTopics likely to create spark:\n{spark}")

    parts.append("\nKeep responses short and conversational — 3 sentences or fewer, like texting. Never claim credentials the user doesn't have. Never reveal sensitive or internal-only profile information.")

    return "\n".join(parts)


def _parse_synthesis(text: str) -> dict:
    """Parse the dual-document YAML output from synthesize_profile."""
    text = text.strip()

    # Strip markdown code block if present
    match = re.search(r"```(?:yaml)?\s*\n?(.*?)\n?\s*```", text, re.DOTALL)
    if match:
        text = match.group(1).strip()

    try:
        data = yaml.safe_load(text)
        if isinstance(data, dict):
            return {
                "profile": data.get("twinder_profile") or {},
                "matching_vector": data.get("twinder_matching_vector") or {},
            }
    except yaml.YAMLError:
        pass

    return {"profile": {}, "matching_vector": {}}
