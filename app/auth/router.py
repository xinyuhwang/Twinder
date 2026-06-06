from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Request, Response
from jose import jwt
from sqlmodel import Session, select
from starlette.responses import RedirectResponse

from app.auth.oauth import oauth
from app.config import settings
from app.database import get_session
from app.deps import get_current_user
from app.models import User
from app.schemas import UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


def create_token(user: User) -> str:
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


@router.get("/google")
async def google_login(request: Request):
    redirect_uri = settings.google_redirect_uri
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback")
async def google_callback(request: Request, session: Session = Depends(get_session)):
    token = await oauth.google.authorize_access_token(request)
    userinfo = token.get("userinfo")

    # Find or create user
    user = session.exec(select(User).where(User.google_id == userinfo["sub"])).first()
    if not user:
        user = User(
            google_id=userinfo["sub"],
            email=userinfo["email"],
            name=userinfo.get("name", userinfo["email"]),
            avatar_url=userinfo.get("picture"),
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    access_token = create_token(user)

    # Redirect to frontend with token
    response = RedirectResponse(url=f"{settings.frontend_url}/auth/callback?token={access_token}")
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=7 * 24 * 3600,
        samesite="lax",
    )
    return response


@router.post("/dev-login")
async def dev_login(
    name: str,
    response: Response,
    persona: str = "",
    session: Session = Depends(get_session),
):
    """Dev-only: create a test user and return a JWT. Skip Google OAuth."""
    email = f"{name.lower().replace(' ', '.')}@dev.local"
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        user = User(
            google_id=f"dev-{name.lower().replace(' ', '-')}",
            email=email,
            name=name,
            persona=persona,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
    elif persona:
        user.persona = persona
        session.add(user)
        session.commit()
        session.refresh(user)

    token = create_token(user)
    response.set_cookie(key="access_token", value=token, httponly=True, max_age=7 * 24 * 3600)
    return {"token": token, "user": UserRead.model_validate(user, from_attributes=True)}


@router.get("/me", response_model=UserRead)
async def get_me(user: User = Depends(get_current_user)):
    return user


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"ok": True}
