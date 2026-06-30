from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Removing defaults forces the app to crash if these are missing from the .env
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # We leave a fallback for the local DB, but you can strip this for production too
    DATABASE_URL: str = "sqlite:///./sql_app.db"

    # Tell Pydantic exactly where to look for the environment variables
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()