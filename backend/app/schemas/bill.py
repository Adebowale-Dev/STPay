from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.utils.bill_providers import BILL_PROVIDERS


class BillPaymentRequest(BaseModel):
    category: str = Field(min_length=2, max_length=100)
    provider: str = Field(min_length=2, max_length=100)
    customer_number: str = Field(min_length=2, max_length=100)
    amount: Decimal = Field(gt=0, decimal_places=2)
    transaction_pin: str = Field(min_length=4, max_length=4)

    @model_validator(mode="after")
    def validate_provider_for_category(self):
        providers = BILL_PROVIDERS.get(self.category)
        if providers is None:
            raise ValueError("Unsupported bill category.")
        if self.provider not in providers:
            raise ValueError("The selected provider is not available for this bill category.")
        if not self.transaction_pin.isdigit():
            raise ValueError("Transaction PIN must be exactly 4 digits.")
        return self


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
