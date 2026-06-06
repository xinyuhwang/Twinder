from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.agents.profile import (
    _derive_persona,
    _to_twin_preview,
    generate_profile,
    new_profile_version,
)
from app.database import get_session
from app.deps import get_current_user
from app.models import User
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
    new_profile_version(session, user.id, profile_yaml=yaml_str)
    user.persona = _derive_persona(yaml_str)
    session.add(user)
    session.commit()
    return TwinPreview(**_to_twin_preview(yaml_str))


@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
