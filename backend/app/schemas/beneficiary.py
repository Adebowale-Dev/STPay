from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class BeneficiaryCreateRequest(BaseModel):
    beneficiary_name: str = Field(min_length=2, max_length=255)
    account_number: str = Field(min_length=10, max_length=20)
    phone_number: str | None = Field(default=None, min_length=7, max_length=20)
    bank_name: str | None = Field(default="STPay", min_length=2, max_length=100)


class BeneficiaryResponse(BaseModel):
    id: str
    user_id: str
    beneficiary_name: str
    account_number: str
    phone_number: str | None
    bank_name: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
