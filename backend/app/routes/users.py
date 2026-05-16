from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.user import (
    ChangePasswordRequest,
    ChangeTransactionPinRequest,
    UserResponse,
    UserUpdateRequest,
)
from app.services.email_service import BrevoEmailService
from app.services.notification_service import NotificationService
from app.utils.mongo import utc_now
from app.utils.security import hash_value, verify_value


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)) -> dict:
    return {
        "success": True,
        "message": "User profile fetched successfully.",
        "data": UserResponse.model_validate(current_user).model_dump(),
    }


@router.patch("/me")
def update_me(
    payload: UserUpdateRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    updates = {}
    if payload.phone_number and payload.phone_number != current_user["phone_number"]:
        existing_user = db.users.find_one(
            {"phone_number": payload.phone_number, "id": {"$ne": current_user["id"]}}
        )
        if existing_user:
            raise HTTPException(status_code=400, detail="Phone number is already in use.")
        updates["phone_number"] = payload.phone_number
    if payload.full_name:
        updates["full_name"] = payload.full_name
    updates["updated_at"] = utc_now()

    db.users.update_one({"id": current_user["id"]}, {"$set": updates})
    current_user.update(updates)
    return {
        "success": True,
        "message": "Profile updated successfully.",
        "data": UserResponse.model_validate(current_user).model_dump(),
    }


@router.patch("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    if not verify_value(payload.current_password, current_user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")
    if payload.new_password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    password_hash = hash_value(payload.new_password)
    db.users.update_one(
        {"id": current_user["id"]},
        {"$set": {"password_hash": password_hash, "updated_at": utc_now()}},
    )
    NotificationService.create_notification(
        db,
        user_id=current_user["id"],
        title="Password updated",
        message="Your account password was changed successfully.",
        notification_type="security",
    )
    BrevoEmailService().send_security_alert(
        current_user,
        "Your STPay account password was changed successfully.",
    )
    return {"success": True, "message": "Password changed successfully.", "data": None}


@router.patch("/change-transaction-pin")
def change_transaction_pin(
    payload: ChangeTransactionPinRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    if not verify_value(payload.current_pin, current_user["transaction_pin_hash"]):
        raise HTTPException(status_code=400, detail="Current PIN is incorrect.")
    if payload.new_pin != payload.confirm_pin:
        raise HTTPException(status_code=400, detail="PIN values do not match.")

    transaction_pin_hash = hash_value(payload.new_pin)
    db.users.update_one(
        {"id": current_user["id"]},
        {"$set": {"transaction_pin_hash": transaction_pin_hash, "updated_at": utc_now()}},
    )
    NotificationService.create_notification(
        db,
        user_id=current_user["id"],
        title="Transaction PIN updated",
        message="Your transaction PIN was changed successfully.",
        notification_type="security",
    )
    BrevoEmailService().send_security_alert(
        current_user,
        "Your STPay transaction PIN was changed successfully.",
    )
    return {"success": True, "message": "Transaction PIN changed successfully.", "data": None}
