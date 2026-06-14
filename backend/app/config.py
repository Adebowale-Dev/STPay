from functools import lru_cache

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "STPay"
    app_version: str = "1.0.0"
    mongodb_url: str = Field(default="mongodb://localhost:27017/stpay", alias="MONGODB_URL")
    mongodb_db_name: str = Field(default="stpay", alias="MONGODB_DB_NAME")
    secret_key: str = Field(..., alias="SECRET_KEY")
    algorithm: str = Field(default="HS256", alias="ALGORITHM")
    access_token_expire_minutes: int = Field(
        default=60,
        alias="ACCESS_TOKEN_EXPIRE_MINUTES",
    )
    brevo_api_key: str = Field(default="", alias="BREVO_API_KEY")
    brevo_sender_email: str = Field(default="", alias="BREVO_SENDER_EMAIL")
    brevo_sender_name: str = Field(default="STPay", alias="BREVO_SENDER_NAME")
    paystack_secret_key: str = Field(default="", alias="PAYSTACK_SECRET_KEY")
    paystack_api_url: str = Field(default="https://api.paystack.co", alias="PAYSTACK_API_URL")
    frontend_url: str = Field(default="http://localhost:3000", alias="FRONTEND_URL")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_url.split(",") if origin.strip()]

    @model_validator(mode="before")
    @classmethod
    def support_legacy_database_url(cls, values: dict) -> dict:
        if not isinstance(values, dict):
            return values

        mongodb_url = values.get("MONGODB_URL") or values.get("mongodb_url")
        legacy_database_url = values.get("DATABASE_URL") or values.get("database_url")

        if not mongodb_url and legacy_database_url and str(legacy_database_url).startswith("mongodb"):
            values["MONGODB_URL"] = legacy_database_url

        return values


@lru_cache
def get_settings() -> Settings:
    return Settings()
