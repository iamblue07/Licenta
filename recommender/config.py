from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str
    PORT: int
    SECRET_KEY: str
    OPENAI_API_KEY: str
    class Config:
        env_file = ".env"

settings = Settings()