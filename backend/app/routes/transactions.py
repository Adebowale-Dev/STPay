from datetime import datetime

from fastapi import APIRouter, Depends, Query
from pymongo.database import Database

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.transaction import TransactionResponse
from app.services.wallet_service import WalletService


router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("")
def list_transactions(
    transaction_type: str | None = Query(default=None),
    status_value: str | None = Query(default=None, alias="status"),
    direction: str | None = Query(default=None),
    date_from: datetime | None = Query(default=None),
    date_to: datetime | None = Query(default=None),
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    transactions = WalletService(db).get_user_transactions(
        current_user,
        transaction_type=transaction_type,
        status_value=status_value,
        direction=direction,
        date_from=date_from,
        date_to=date_to,
    )
    return {
        "success": True,
        "message": "Transactions fetched successfully.",
        "data": [TransactionResponse.model_validate(item).model_dump() for item in transactions],
    }


@router.get("/{reference}")
def get_transaction(
    reference: str,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    transactions = WalletService(db).get_transaction_by_reference(current_user, reference)
    return {
        "success": True,
        "message": "Transaction fetched successfully.",
        "data": [TransactionResponse.model_validate(item).model_dump() for item in transactions],
    }
