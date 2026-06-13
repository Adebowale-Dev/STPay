from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.user import (
    AccountUpgradeRequest,
    ChangePasswordRequest,
    ChangeTransactionPinRequest,
    UserResponse,
    UserUpdateRequest,
)
from app.services.email_service import BrevoEmailService
from app.services.notification_service import NotificationService
from app.utils.generate_account import account_number_from_phone
from app.utils.account_tiers import hash_identity_number
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
        account_number = account_number_from_phone(payload.phone_number)
        existing_wallet = db.wallets.find_one(
            {"account_number": account_number, "user_id": {"$ne": current_user["id"]}}
        )
        if existing_wallet:
            raise HTTPException(status_code=400, detail="An account already exists for this phone number.")
        db.wallets.update_one(
            {"user_id": current_user["id"]},
            {"$set": {"account_number": account_number, "updated_at": utc_now()}},
        )
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


@router.patch("/upgrade-account")
def upgrade_account(
    payload: AccountUpgradeRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    if payload.nin is None and payload.bvn is None:
        raise HTTPException(status_code=400, detail="Provide your NIN or BVN to upgrade your account.")

    updates = {"updated_at": utc_now()}
    if payload.nin is not None:
        nin_hash = hash_identity_number(payload.nin)
        existing = db.users.find_one({"nin_hash": nin_hash, "id": {"$ne": current_user["id"]}})
        if existing:
            raise HTTPException(status_code=409, detail="This NIN is already linked to another account.")
        updates.update(
            {
                "nin_hash": nin_hash,
                "nin_last4": payload.nin[-4:],
                "nin_verified": True,
                "account_tier": max(int(current_user.get("account_tier", 1)), 2),
            }
        )

    has_nin = bool(current_user.get("nin_verified")) or payload.nin is not None
    if payload.bvn is not None:
        if not has_nin:
            raise HTTPException(status_code=400, detail="Add your NIN before upgrading with BVN.")
        bvn_hash = hash_identity_number(payload.bvn)
        existing = db.users.find_one({"bvn_hash": bvn_hash, "id": {"$ne": current_user["id"]}})
        if existing:
            raise HTTPException(status_code=409, detail="This BVN is already linked to another account.")
        updates.update(
            {
                "bvn_hash": bvn_hash,
                "bvn_last4": payload.bvn[-4:],
                "bvn_verified": True,
                "account_tier": 3,
            }
        )

    db.users.update_one({"id": current_user["id"]}, {"$set": updates})
    current_user.update(updates)
    NotificationService.create_notification(
        db,
        user_id=current_user["id"],
        title=f"Account upgraded to Tier {current_user['account_tier']}",
        message="Your identity details were verified and your STPay account limits were upgraded.",
        notification_type="security",
    )
    BrevoEmailService().send_security_alert(
        current_user,
        f"Your STPay account has been upgraded to Tier {current_user['account_tier']}.",
    )
    return {
        "success": True,
        "message": f"Account upgraded to Tier {current_user['account_tier']} successfully.",
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
    if payload.current_password == payload.new_password:
        raise HTTPException(
            status_code=400,
            detail="Your new password must be different from your current password.",
        )

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
    if payload.current_pin == payload.new_pin:
        raise HTTPException(
            status_code=400,
            detail="Your new transaction PIN must be different from your current PIN.",
        )

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
