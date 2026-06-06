from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt
from sqlmodel import Session, select

from app.config import settings
from app.database import get_session
from app.models import User


def get_current_user(
    request: Request,
    session: Session = Depends(get_session),
) -> User:
    token = None

    # Try cookie first, then Authorization header
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        user_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
