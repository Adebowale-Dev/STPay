from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.schemas.user import UserResponse


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    phone_number: str = Field(min_length=7, max_length=20)
    password: str = Field(min_length=8, max_length=128)
    transaction_pin: str = Field(min_length=4, max_length=4)

    @field_validator("transaction_pin")
    @classmethod
    def validate_pin(cls, value: str) -> str:
        if not value.isdigit():
            raise ValueError("Transaction PIN must be exactly 4 digits.")
        return value


class LoginRequest(BaseModel):
    identifier: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=1, max_length=128)

    @field_validator("identifier")
    @classmethod
    def normalize_identifier(cls, value: str) -> str:
        return value.strip()


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=4, max_length=10)


class ResendVerificationCodeRequest(BaseModel):
    email: EmailStr


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=4, max_length=10)
    new_password: str = Field(min_length=8, max_length=128)
    confirm_password: str = Field(min_length=8, max_length=128)


class TokenData(BaseModel):
    sub: str


class AuthPayload(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

    model_config = ConfigDict(from_attributes=True)
