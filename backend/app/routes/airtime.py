from fastapi import APIRouter, Depends
from pymongo.database import Database

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.airtime import AirtimePurchaseRequest
from app.services.wallet_service import WalletService


router = APIRouter(prefix="/airtime", tags=["Airtime"])


@router.post("/buy")
def buy_airtime(
    payload: AirtimePurchaseRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    wallet, transaction = WalletService(db).purchase_airtime(current_user, payload)
    return {
        "success": True,
        "message": "Airtime purchase successful.",
        "data": {
            "reference": transaction["reference"],
            "amount": transaction["amount"],
            "balance": wallet["balance"],
        },
    }
