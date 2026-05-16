from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class BillPaymentRequest(BaseModel):
    category: str = Field(min_length=2, max_length=100)
    provider: str = Field(min_length=2, max_length=100)
    customer_number: str = Field(min_length=2, max_length=100)
    amount: Decimal = Field(gt=0, decimal_places=2)
    transaction_pin: str = Field(min_length=4, max_length=4)


class BillPaymentResponse(BaseModel):
    id: str
    user_id: str
    category: str
    provider: str
    customer_number: str
    amount: Decimal
    transaction_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
