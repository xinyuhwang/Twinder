import json
import re

from copilotkit import Action

from app.llm import chat

STRICT_PRIVACY = [
    "Contact info hidden until mutual meet approval",
    "No employer, location, or social handles shared",
    "Agent shares only high-level themes, not specifics",
    "Matches see a short summary, not your full profile",
]


def _parse_json(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass
    return {}


async def edit_agent_voice(
    summary: str,
    current_voice: str,
    instruction: str = "Make this sound more like me",
) -> dict:
    system = (
        "You rewrite twin preview copy for Twinder, a social agent-matching app. "
        "Return only valid JSON with keys summary and agent_voice."
    )
    user = (
        f"Instruction: {instruction}\n\n"
        f"Current summary:\n{summary}\n\n"
        f"Current agent voice:\n{current_voice}\n\n"
        'Return JSON: {"summary": "...", "agent_voice": "..."}'
    )
    raw = await chat([{"role": "user", "content": user}], system=system, max_tokens=400)
    parsed = _parse_json(raw)
    return {
        "summary": parsed.get("summary") or summary,
        "agent_voice": parsed.get("agent_voice") or current_voice,
        "message": "Updated the twin voice to sound more like you.",
    }


async def make_privacy_stricter() -> dict:
    return {
        "privacy_settings": STRICT_PRIVACY,
        "message": (
            "Done. Your agent will share less by default and wait for your approval "
            "before revealing specifics."
        ),
    }


async def improve_profile(preview_json: str) -> dict:
    system = (
        "You are a twin profile coach for Twinder. Give 2-3 concrete, specific suggestions "
        "to make the user's agent preview more memorable in agent conversations. "
        "Be direct and encouraging. Plain text only, no JSON."
    )
    user = f"Twin preview data:\n{preview_json}"
    suggestions = await chat([{"role": "user", "content": user}], system=system, max_tokens=300)
    return {"message": suggestions.strip()}


async def explain_match(card_json: str, question: str) -> dict:
    system = (
        "You are Twinder's match copilot. Answer using only the match card data provided. "
        "Be concise, warm, and actionable. Plain text only."
    )
    user = f"Match card:\n{card_json}\n\nUser question:\n{question}"
    answer = await chat([{"role": "user", "content": user}], system=system, max_tokens=350)
    return {"message": answer.strip()}


def build_actions() -> list[Action]:
    return [
        Action(
            name="edit_agent_voice",
            description="Rewrite the twin preview summary and agent voice to match user instructions.",
            parameters=[
                {
                    "name": "summary",
                    "type": "string",
                    "description": "Current public-safe twin summary",
                    "required": True,
                },
                {
                    "name": "current_voice",
                    "type": "string",
                    "description": "Current agent voice description",
                    "required": True,
                },
                {
                    "name": "instruction",
                    "type": "string",
                    "description": "How the user wants the voice changed",
                    "required": False,
                },
            ],
            handler=edit_agent_voice,
        ),
        Action(
            name="make_privacy_stricter",
            description="Tighten the twin's default privacy settings.",
            parameters=[],
            handler=make_privacy_stricter,
        ),
        Action(
            name="improve_profile",
            description="Suggest concrete improvements for the twin preview.",
            parameters=[
                {
                    "name": "preview_json",
                    "type": "string",
                    "description": "JSON string of the current twin preview display",
                    "required": True,
                },
            ],
            handler=improve_profile,
        ),
        Action(
            name="explain_match",
            description="Explain a match or answer match-related questions using match card data.",
            parameters=[
                {
                    "name": "card_json",
                    "type": "string",
                    "description": "JSON string of the MatchCard",
                    "required": True,
                },
                {
                    "name": "question",
                    "type": "string",
                    "description": "The user's question about this match",
                    "required": True,
                },
            ],
            handler=explain_match,
        ),
    ]
