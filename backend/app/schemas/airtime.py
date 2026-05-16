from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class AirtimePurchaseRequest(BaseModel):
    network_provider: str = Field(min_length=2, max_length=100)
    phone_number: str = Field(min_length=7, max_length=20)
    amount: Decimal = Field(gt=0, decimal_places=2)
    transaction_pin: str = Field(min_length=4, max_length=4)


class AirtimePurchaseResponse(BaseModel):
    id: str
    user_id: str
    network_provider: str
    phone_number: str
    amount: Decimal
    transaction_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
