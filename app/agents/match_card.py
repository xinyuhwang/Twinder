from app.agents.json_parse import parse_llm_json
from app.agents.prompts import MATCH_CARD_SCORING_PROMPT
from app.llm import chat
from app.observability import op


@op(name="format_match_card")
async def format_match_card(
    conversation_text: str,
    vibe: dict,
    profiles: list,
) -> dict:
    """Return PRD-shaped match card JSON. Uses public-safe profile fields only."""
    if len(profiles) < 2:
        return {"score": vibe.get("score", 50), "summary": vibe.get("summary", "")}

    a, b = profiles[0], profiles[1]
    prompt = MATCH_CARD_SCORING_PROMPT.format(
        user_a_name=a["name"],
        user_a_persona=a.get("persona") or f"{a['name']} — no detailed profile available.",
        user_b_name=b["name"],
        user_b_persona=b.get("persona") or f"{b['name']} — no detailed profile available.",
        conversation=conversation_text,
    )

    try:
        raw = await chat(
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1500,
        )
        return parse_llm_json(raw)
    except Exception as e:
        return {
            "score": vibe.get("score", 50),
            "headline": f"Connection between {a['name']} and {b['name']}",
            "match_type": "unexpected_connection",
            "summary": vibe.get("summary", ""),
            "error": str(e),
        }

