"""Divergent Association Task (DAT).

A fast (30-90s) proxy for openness to experience / divergent thinking.
The user names several words that are as different from each other as
possible. We embed the words and measure the average semantic distance
between them. Higher distance -> more divergent thinking.

Reference: Olson et al. (2021), "Naming unrelated words predicts creativity".
We follow the same shape (collect up to 10 words, score the first 7 valid
ones, report mean pairwise distance * 100), but use modern embeddings
instead of GloVe vectors.
"""
import math
import re

from app.llm import embed
from app.observability import op

MIN_WORDS_TO_SCORE = 2     # need at least one pair to measure distance
WORDS_REQUESTED = 10       # how many we ask the user for
WORDS_SCORED = 7           # how many valid words we actually score

_WORD_RE = re.compile(r"^[a-z][a-z'-]*[a-z]$")


def validate_words(raw_words: list[str]) -> tuple[list[str], list[str]]:
    """Split words into (valid, invalid) per DAT rules.

    Valid words are single English-looking tokens, length >= 2, alphabetic
    (apostrophes/hyphens allowed internally), and unique (case-insensitive).
    """
    valid: list[str] = []
    invalid: list[str] = []
    seen: set[str] = set()

    for raw in raw_words:
        word = (raw or "").strip().lower()
        if not word:
            continue
        if " " in word or not _WORD_RE.match(word):
            invalid.append(raw.strip())
            continue
        if word in seen:
            invalid.append(raw.strip())
            continue
        seen.add(word)
        valid.append(word)

    return valid, invalid


def _cosine_distance(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return 1.0 - (dot / (norm_a * norm_b))


@op(name="score_dat")
async def score_dat(raw_words: list[str]) -> dict:
    """Compute a divergent association score (0-100) for a list of words.

    Returns a dict with the score, the words actually used, and validation
    feedback so the frontend can guide the user.
    """
    valid, invalid = validate_words(raw_words)
    scored_words = valid[:WORDS_SCORED]

    result = {
        "score": None,
        "scored_words": scored_words,
        "valid_words": valid,
        "invalid_words": invalid,
        "enough_words": len(scored_words) >= MIN_WORDS_TO_SCORE,
    }

    if len(scored_words) < MIN_WORDS_TO_SCORE:
        return result

    vectors = await embed(scored_words)

    distances: list[float] = []
    for i in range(len(vectors)):
        for j in range(i + 1, len(vectors)):
            distances.append(_cosine_distance(vectors[i], vectors[j]))

    mean_distance = sum(distances) / len(distances)
    # Scale mean cosine distance to a 0-100 score, clamped to range.
    score = max(0.0, min(100.0, mean_distance * 100.0))
    result["score"] = round(score, 1)
    return result


def openness_line(score: float | None) -> str:
    """A short persona/profile line describing the user's DAT result."""
    if score is None:
        return ""
    return (
        f"Divergent-thinking / openness score: {round(score)}/100 "
        f"(measured via the Divergent Association Task; higher = more "
        f"divergent, creative, open to experience)."
    )


def openness_compatibility(score_a: float | None, score_b: float | None) -> float | None:
    """Similarity-based compatibility (0-100): people with closer divergent-
    thinking scores are treated as more compatible on openness to experience.
    """
    if score_a is None or score_b is None:
        return None
    return round(max(0.0, 100.0 - abs(score_a - score_b)), 1)
