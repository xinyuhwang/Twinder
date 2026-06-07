import os

os.environ["WEAVE_ENABLED"] = "false"  # must be set before any app imports

from unittest.mock import AsyncMock, patch

import app.models  # ensure all SQLModel tables are registered before create_all

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool


@pytest.fixture
def session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as s:
        yield s
    engine.dispose()


@pytest.fixture
def test_user(session):
    from app.models import User

    user = User(google_id="test-g-id", email="test@example.com", name="Tester")
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture
def client(session, test_user):
    from app.database import get_session
    from app.deps import get_current_user
    from app.main import app

    mock_redis = AsyncMock()
    mock_redis.ping = AsyncMock(return_value=True)

    def _get_session():
        yield session

    app.dependency_overrides[get_session] = _get_session
    app.dependency_overrides[get_current_user] = lambda: test_user

    with (
        patch("app.main.create_db"),
        patch("app.seed.seed_demo_users"),
        patch("app.main.init_redis", AsyncMock(return_value=mock_redis)),
        patch("app.main.close_redis", AsyncMock()),
        patch("app.main.get_redis", return_value=mock_redis),
    ):
        with TestClient(app) as c:
            yield c

    app.dependency_overrides.clear()
