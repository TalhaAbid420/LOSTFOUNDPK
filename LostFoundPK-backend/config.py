import json
from typing import List, Union
from pydantic import field_validator, Field, AliasChoices
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "LostFoundPK API"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    MONGO_URI: str = Field(validation_alias=AliasChoices("MONGO_URI", "MONGODB_URI", "mongodb_uri", "MONGO_URL", "mongodb_url"))
    MONGO_DB_NAME: str = "lostfound"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            try:
                # Attempt to parse JSON string (e.g. '["http://localhost:5173"]')
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return [str(item) for item in parsed]
            except json.JSONDecodeError:
                pass
            
            # Fallback: Comma-separated values
            return [item.strip() for item in v.split(",") if item.strip()]
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
