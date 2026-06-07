import json
import re


def _strip_trailing_commas(text: str) -> str:
    return re.sub(r",(\s*[}\]])", r"\1", text)


def parse_llm_json(text: str) -> dict:
    """Extract and parse JSON from an LLM response, with common repair attempts."""
    text = text.strip()
    candidates: list[str] = [text]

    match = re.search(r"```(?:json)?\s*\n?(.*?)\n?\s*```", text, re.DOTALL)
    if match:
        candidates.append(match.group(1).strip())

    start = text.find("{")
    end = text.rfind("}") + 1
    if start >= 0 and end > start:
        candidates.append(text[start:end])

    last_error: json.JSONDecodeError | None = None
    seen: set[str] = set()
    for candidate in candidates:
        for attempt in (candidate, _strip_trailing_commas(candidate)):
            if attempt in seen:
                continue
            seen.add(attempt)
            try:
                return json.loads(attempt)
            except json.JSONDecodeError as e:
                last_error = e

    if last_error is not None:
        raise last_error
    raise ValueError(f"Could not parse JSON from: {text[:200]}")
