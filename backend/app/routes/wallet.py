from fastapi import APIRouter, Depends
from pymongo.database import Database

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.wallet import FundWalletRequest, TransferRequest, WalletBalanceResponse
from app.services.wallet_service import WalletService


router = APIRouter(prefix="/wallet", tags=["Wallet"])


@router.get("/balance")
def get_balance(
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    wallet = WalletService(db).get_wallet_balance(current_user)
    return {
        "success": True,
        "message": "Wallet balance fetched successfully.",
        "data": WalletBalanceResponse(
            account_number=wallet["account_number"],
            balance=wallet["balance"],
            currency=wallet["currency"],
        ).model_dump(),
    }


@router.get("/resolve-account/{account_number}")
def resolve_account(
    account_number: str,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    account = WalletService(db).resolve_account(current_user, account_number)
    return {
        "success": True,
        "message": "Account resolved successfully.",
        "data": account,
    }


@router.post("/fund")
def fund_wallet(
    payload: FundWalletRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    wallet, transaction = WalletService(db).fund_wallet(current_user, payload)
    return {
        "success": True,
        "message": "Wallet funded successfully.",
        "data": {
            "reference": transaction["reference"],
            "amount": transaction["amount"],
            "balance": wallet["balance"],
            "status": transaction["status"],
            "description": transaction["description"],
            "created_at": transaction["created_at"],
        },
    }


@router.post("/transfer")
def transfer(
    payload: TransferRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    service = WalletService(db)
    account = service.resolve_account(current_user, payload.receiver_account_number)
    wallet, transaction = service.transfer(current_user, payload)
    return {
        "success": True,
        "message": "Transfer successful",
        "data": {
            "reference": transaction["reference"],
            "amount": transaction["amount"],
            "balance": wallet["balance"],
            "status": transaction["status"],
            "description": transaction["description"],
            "created_at": transaction["created_at"],
            "sender_name": current_user["full_name"],
            "receiver_name": account["account_name"],
            "receiver_account_number": account["account_number"],
            "bank_name": account["bank_name"],
        },
    }
