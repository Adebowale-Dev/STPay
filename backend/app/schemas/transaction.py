from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import TransactionDirection, TransactionStatus, TransactionType


class TransactionResponse(BaseModel):
    id: str
    reference: str
    sender_id: str | None
    receiver_id: str | None
    amount: Decimal
    transaction_type: TransactionType
    direction: TransactionDirection
    status: TransactionStatus
    description: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
