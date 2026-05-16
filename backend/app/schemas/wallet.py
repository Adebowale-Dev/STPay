from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class WalletBalanceResponse(BaseModel):
    account_number: str
    balance: Decimal
    currency: str


class WalletResponse(WalletBalanceResponse):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FundWalletRequest(BaseModel):
    amount: Decimal = Field(gt=0, decimal_places=2)
    payment_method: str = Field(min_length=2, max_length=100)


class TransferRequest(BaseModel):
    receiver_account_number: str = Field(min_length=10, max_length=20)
    amount: Decimal = Field(gt=0, decimal_places=2)
    description: str | None = Field(default=None, max_length=500)
    transaction_pin: str = Field(min_length=4, max_length=4)
