from fastapi import APIRouter, Depends
from pymongo.database import Database

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.wallet import (
    ExternalAccountResolveRequest,
    ExternalTransferRequest,
    FundWalletRequest,
    TransferRequest,
    WalletBalanceResponse,
)
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


@router.get("/banks")
def list_banks(
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    banks = WalletService(db).list_external_banks()
    return {
        "success": True,
        "message": "Banks fetched successfully.",
        "data": banks,
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


@router.post("/resolve-external-account")
def resolve_external_account(
    payload: ExternalAccountResolveRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    account = WalletService(db).resolve_external_account(payload.account_number, payload.bank_code)
    return {
        "success": True,
        "message": "External bank account resolved successfully.",
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


@router.post("/external-transfer")
def external_transfer(
    payload: ExternalTransferRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    wallet, transaction = WalletService(db).external_transfer(current_user, payload)
    return {
        "success": True,
        "message": "External transfer is processing.",
        "data": {
            "reference": transaction["reference"],
            "amount": transaction["amount"],
            "balance": wallet["balance"],
            "status": transaction["status"],
            "description": transaction["description"],
            "created_at": transaction["created_at"],
            "sender_name": current_user["full_name"],
            "receiver_name": transaction["receiver_name"],
            "receiver_account_number": transaction["receiver_account_number"],
            "bank_name": transaction["bank_name"],
        },
    }


@router.get("/external-transfer/{reference}/status")
def external_transfer_status(
    reference: str,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    wallet, transaction = WalletService(db).reconcile_external_transfer(current_user, reference)
    return {
        "success": True,
        "message": "External transfer status fetched successfully.",
        "data": {
            "status": transaction["status"],
            "balance": wallet["balance"],
        },
    }
