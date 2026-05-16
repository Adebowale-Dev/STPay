from fastapi import APIRouter, Depends
from pymongo.database import Database

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.bill import BillPaymentRequest
from app.services.wallet_service import WalletService


router = APIRouter(prefix="/bills", tags=["Bills"])


@router.post("/pay")
def pay_bill(
    payload: BillPaymentRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    wallet, transaction = WalletService(db).pay_bill(current_user, payload)
    return {
        "success": True,
        "message": "Bill payment successful.",
        "data": {
            "reference": transaction["reference"],
            "amount": transaction["amount"],
            "balance": wallet["balance"],
        },
    }
