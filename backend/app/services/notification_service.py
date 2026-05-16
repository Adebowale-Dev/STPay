from pymongo.database import Database

from app.utils.mongo import generate_id, utc_now


class NotificationService:
    @staticmethod
    def create_notification(
        db: Database,
        *,
        user_id: str,
        title: str,
        message: str,
        notification_type: str,
    ) -> dict:
        notification = {
            "id": generate_id(),
            "user_id": user_id,
            "title": title,
            "message": message,
            "notification_type": notification_type,
            "is_read": False,
            "created_at": utc_now(),
        }
        db.notifications.insert_one(notification)
        return notification
