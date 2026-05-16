from fastapi import APIRouter, Depends, HTTPException
from pymongo import DESCENDING
from pymongo.database import Database

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.notification import NotificationResponse
from app.utils.mongo import serialize_documents


router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("")
def list_notifications(
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    notifications = serialize_documents(
        db.notifications.find({"user_id": current_user["id"]}).sort("created_at", DESCENDING)
    )
    return {
        "success": True,
        "message": "Notifications fetched successfully.",
        "data": [NotificationResponse.model_validate(item).model_dump() for item in notifications],
    }


@router.patch("/{notification_id}/read")
def mark_notification_as_read(
    notification_id: str,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    notification = db.notifications.find_one({"id": notification_id, "user_id": current_user["id"]})
    if notification is None:
        raise HTTPException(status_code=404, detail="Notification not found.")
    db.notifications.update_one({"id": notification_id}, {"$set": {"is_read": True}})
    notification["is_read"] = True
    return {
        "success": True,
        "message": "Notification marked as read.",
        "data": NotificationResponse.model_validate(notification).model_dump(),
    }
