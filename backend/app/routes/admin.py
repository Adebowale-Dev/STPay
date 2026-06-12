from fastapi import APIRouter, Depends, HTTPException
from pymongo import DESCENDING
from pymongo.database import Database

from app.database import get_db
from app.dependencies import get_current_admin_user
from app.schemas.transaction import TransactionResponse
from app.schemas.user import UserResponse
from app.services.email_service import BrevoEmailService
from app.services.notification_service import NotificationService
from app.services.transaction_service import TransactionService
from app.utils.mongo import from_decimal128, serialize_document, serialize_documents, utc_now


router = APIRouter(prefix="/admin", tags=["Admin"])


def serialize_admin_user(db: Database, user: dict) -> dict:
    safe_user = UserResponse.model_validate(serialize_document(user)).model_dump()
    wallet = db.wallets.find_one({"user_id": user["id"]})
    latest_transaction = db.transactions.find_one(
        {"$or": [{"sender_id": user["id"]}, {"receiver_id": user["id"]}]},
        sort=[("created_at", DESCENDING)],
    )
    safe_user.update(
        {
            "wallet_account_number": wallet.get("account_number") if wallet else None,
            "wallet_balance": from_decimal128(wallet.get("balance")) if wallet else 0,
            "wallet_currency": wallet.get("currency", "NGN") if wallet else "NGN",
            "transaction_count": db.transactions.count_documents(
                {"$or": [{"sender_id": user["id"]}, {"receiver_id": user["id"]}]}
            ),
            "last_transaction_at": latest_transaction.get("created_at") if latest_transaction else None,
        }
    )
    return safe_user


@router.get("/users")
def list_users(
    db: Database = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> dict:
    users = list(db.users.find().sort("created_at", DESCENDING))
    return {
        "success": True,
        "message": "Users fetched successfully.",
        "data": [serialize_admin_user(db, user) for user in users],
    }


@router.get("/users/{user_id}")
def get_user(
    user_id: str,
    db: Database = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> dict:
    user = db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    transactions = serialize_documents(
        db.transactions.find(
            {"$or": [{"sender_id": user_id}, {"receiver_id": user_id}]}
        ).sort("created_at", DESCENDING).limit(20)
    )
    return {
        "success": True,
        "message": "User fetched successfully.",
        "data": {
            "user": serialize_admin_user(db, user),
            "recent_transactions": [
                TransactionResponse.model_validate(item).model_dump() for item in transactions
            ],
        },
    }


@router.get("/transactions")
def list_transactions(
    db: Database = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> dict:
    transactions = TransactionService(db).list_all_transactions()
    return {
        "success": True,
        "message": "Transactions fetched successfully.",
        "data": [TransactionResponse.model_validate(item).model_dump() for item in transactions],
    }


@router.get("/transactions/{reference}")
def get_transaction(
    reference: str,
    db: Database = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> dict:
    transaction = serialize_document(db.transactions.find_one({"reference": reference}))
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found.")

    sender = db.users.find_one({"id": transaction.get("sender_id")}) if transaction.get("sender_id") else None
    receiver = db.users.find_one({"id": transaction.get("receiver_id")}) if transaction.get("receiver_id") else None
    return {
        "success": True,
        "message": "Transaction fetched successfully.",
        "data": {
            "transaction": TransactionResponse.model_validate(transaction).model_dump(),
            "sender": serialize_admin_user(db, sender) if sender else None,
            "receiver": serialize_admin_user(db, receiver) if receiver else None,
        },
    }


@router.get("/stats")
def get_stats(
    db: Database = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> dict:
    stats = TransactionService(db).get_platform_stats()
    return {
        "success": True,
        "message": "Platform statistics fetched successfully.",
        "data": stats,
    }


@router.patch("/users/{user_id}/freeze")
def freeze_user(
    user_id: str,
    db: Database = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> dict:
    user = db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    db.users.update_one({"id": user_id}, {"$set": {"is_frozen": True, "updated_at": utc_now()}})
    user["is_frozen"] = True
    NotificationService.create_notification(
        db,
        user_id=user["id"],
        title="Account frozen",
        message="Your STPay account has been frozen by an administrator.",
        notification_type="admin",
    )
    BrevoEmailService().send_account_status_email(user, "frozen")
    return {"success": True, "message": "User account frozen successfully.", "data": None}


@router.patch("/users/{user_id}/unfreeze")
def unfreeze_user(
    user_id: str,
    db: Database = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> dict:
    user = db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    db.users.update_one({"id": user_id}, {"$set": {"is_frozen": False, "updated_at": utc_now()}})
    user["is_frozen"] = False
    NotificationService.create_notification(
        db,
        user_id=user["id"],
        title="Account unfrozen",
        message="Your STPay account has been reactivated by an administrator.",
        notification_type="admin",
    )
    BrevoEmailService().send_account_status_email(user, "unfrozen")
    return {"success": True, "message": "User account unfrozen successfully.", "data": None}
