from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models.enums import UserRole
from app.utils.generate_account import normalize_nigerian_phone_number


class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone_number: str
    role: UserRole
    is_active: bool
    is_frozen: bool
    is_email_verified: bool
    account_tier: int = 1
    nin_verified: bool = False
    bvn_verified: bool = False
    nin_last4: str | None = None
    bvn_last4: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdateRequest(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=255)
    phone_number: str | None = Field(default=None, min_length=7, max_length=20)

    @field_validator("phone_number")
    @classmethod
    def normalize_phone_number(cls, value: str | None) -> str | None:
        return normalize_nigerian_phone_number(value) if value else value


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)
    confirm_password: str = Field(min_length=8, max_length=128)


class ChangeTransactionPinRequest(BaseModel):
    current_pin: str = Field(min_length=4, max_length=4)
    new_pin: str = Field(min_length=4, max_length=4)
    confirm_pin: str = Field(min_length=4, max_length=4)

    @field_validator("current_pin", "new_pin", "confirm_pin")
    @classmethod
    def validate_pin(cls, value: str) -> str:
        if not value.isdigit():
            raise ValueError("Transaction PIN must be exactly 4 digits.")
        return value


class AccountUpgradeRequest(BaseModel):
    nin: str | None = None
    bvn: str | None = None

    @field_validator("nin", "bvn")
    @classmethod
    def validate_identity_number(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = "".join(character for character in value if character.isdigit())
        if len(normalized) != 11:
            raise ValueError("NIN and BVN must be exactly 11 digits.")
        return normalized
