import json

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.agents.dat import score_dat
from app.agents.profile import (
    _derive_persona,
    _extract_follow_up_questions,
    _rich_scoring_context_from_synthesis,
    _to_twin_preview,
    generate_profile,
    new_profile_version,
)
from app.agents.synthesis import build_system_instruction, synthesize_profile
from app.agents.twin_prompt import build_twin_system_prompt
from app.database import get_session
from app.deps import get_current_user
from app.models import User
from app.schemas import DatRequest, DatResult, IntakeRequest, PreflightRequest, PreflightResponse, TwinPreview, TwinPromptResponse, UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
async def get_me(user: User = Depends(get_current_user)):
    return user


@router.put("/me", response_model=UserRead)
async def update_me(
    body: UserUpdate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if body.name is not None:
        user.name = body.name
    if body.age is not None:
        user.age = body.age
    if body.persona is not None:
        user.persona = body.persona
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.post("/me/preflight", response_model=PreflightResponse)
async def run_preflight(
    body: PreflightRequest,
    user: User = Depends(get_current_user),
):
    yaml_str = await generate_profile(body.raw_context)
    questions = _extract_follow_up_questions(yaml_str)
    return PreflightResponse(questions=questions, profile_yaml=yaml_str)


@router.post("/me/intake", response_model=TwinPreview)
async def run_intake(
    body: IntakeRequest,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    yaml_str = body.profile_yaml or await generate_profile(body.raw_context, body.answers)
    synthesis = await synthesize_profile(yaml_str, onboarding_answers=body.answers)
    system_instruction = build_system_instruction(synthesis, user.name)

    new_profile_version(
        session,
        user.id,
        profile_yaml=yaml_str,
        matching_vector=json.dumps(synthesis),
        system_instruction=system_instruction,
    )
    # Prefer persona derived from synthesis (richer) over the thin intake YAML version
    rich_persona = _rich_scoring_context_from_synthesis(synthesis)
    user.persona = rich_persona if rich_persona else _derive_persona(yaml_str)
    session.add(user)
    session.commit()
    session.refresh(user)

    twin_prompt = build_twin_system_prompt(user, body.mode, session)
    preview = _to_twin_preview(yaml_str)
    return TwinPreview(**preview, twin_prompt=twin_prompt)


@router.get("/me/twin-prompt", response_model=TwinPromptResponse)
async def get_twin_prompt(
    mode: str = "networking",
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Return the system prompt the twin will use in arena/chat for the current user."""
    return TwinPromptResponse(
        mode=mode,
        twin_prompt=build_twin_system_prompt(user, mode, session),
    )


@router.post("/me/dat", response_model=DatResult)
async def submit_dat(
    body: DatRequest,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Score the user's Divergent Association Task and persist it on the profile.

    The resulting score is a proxy for openness to experience / divergent
    thinking and is used by the matching algorithm (see app/agents/arena.py).
    """
    try:
        result = await score_dat(body.words)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Could not score words: {e}")

    if result.get("score") is not None:
        user.dat_score = result["score"]
        user.dat_words = json.dumps(result["scored_words"])
        session.add(user)
        session.commit()

    return DatResult(**result)


@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
