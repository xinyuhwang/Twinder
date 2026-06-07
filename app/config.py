from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = "http://localhost:8000/auth/callback"
    jwt_secret: str = "change-me"
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    llm_model: str = "anthropic/claude-sonnet-4-20250514"  # litellm format — arena/chat default
    # Onboarding uses smaller/faster models to avoid burning Sonnet rate limits.
    llm_intake_model: str = "anthropic/claude-haiku-4-5-20251001"
    llm_synthesis_model: str = "anthropic/claude-haiku-4-5-20251001"
    redis_url: str = "redis://localhost:6379"
    database_url: str = "sqlite:///./twinder.db"
    frontend_url: str = "http://localhost:3000"
    weave_enabled: bool = False
    wandb_project: str = "twinder"
    wandb_entity: str = ""

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
