import asyncio
import json

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.agents.profile import (
    _derive_persona,
    _to_twin_preview,
    generate_profile,
    new_profile_version,
)
from app.agents.synthesis import build_system_instruction, synthesize_profile
from app.database import get_session
from app.deps import get_current_user
from app.models import ProfileVersion, User
from app.schemas import IntakeRequest, TwinPreview, UserRead, UserUpdate

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
    if body.persona is not None:
        user.persona = body.persona
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.post("/me/intake", response_model=TwinPreview)
async def run_intake(
    body: IntakeRequest,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    yaml_str = await generate_profile(body.raw_context, body.answers)
    pv = new_profile_version(session, user.id, profile_yaml=yaml_str)
    user.persona = _derive_persona(yaml_str)
    session.add(user)
    session.commit()

    # Fire synthesis in background — engine falls back to persona until it completes
    asyncio.create_task(_run_synthesis(pv.id, yaml_str, user.name))

    return TwinPreview(**_to_twin_preview(yaml_str))


async def _run_synthesis(pv_id: int, yaml_str: str, user_name: str):
    try:
        synthesis = await synthesize_profile(yaml_str)
        system_instruction = build_system_instruction(synthesis, user_name)
        session = next(get_session())
        pv = session.get(ProfileVersion, pv_id)
        if pv:
            pv.matching_vector = json.dumps(synthesis.get("matching_vector") or {})
            pv.system_instruction = system_instruction
            session.add(pv)
            session.commit()
        session.close()
    except Exception:
        pass  # synthesis is best-effort; engine falls back to persona


@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
