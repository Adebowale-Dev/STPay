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
from app.utils.mongo import serialize_document, serialize_documents, utc_now


router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users")
def list_users(
    db: Database = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> dict:
    users = serialize_documents(db.users.find().sort("created_at", DESCENDING))
    return {
        "success": True,
        "message": "Users fetched successfully.",
        "data": [UserResponse.model_validate(user).model_dump() for user in users],
    }


@router.get("/users/{user_id}")
def get_user(
    user_id: str,
    db: Database = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> dict:
    user = serialize_document(db.users.find_one({"id": user_id}))
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    return {
        "success": True,
        "message": "User fetched successfully.",
        "data": UserResponse.model_validate(user).model_dump(),
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
