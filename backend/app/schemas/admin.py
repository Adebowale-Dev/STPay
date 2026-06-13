from pydantic import BaseModel, EmailStr, Field, field_validator

from app.utils.generate_account import normalize_nigerian_phone_number


class AdminCreateCustomerRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    phone_number: str = Field(min_length=7, max_length=20)

    @field_validator("phone_number")
    @classmethod
    def normalize_phone_number(cls, value: str) -> str:
        return normalize_nigerian_phone_number(value)
