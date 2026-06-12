from app.database import db, ensure_indexes
from app.utils.generate_account import generate_account_number
from app.utils.mongo import generate_id, to_decimal128, utc_now
from app.utils.security import hash_value


USER_EMAIL = "adebowale235@gmail.com"
USER_PASSWORD = "123456789"
USER_PHONE = "08100000001"
USER_TRANSACTION_PIN = "1234"


def generate_unique_account_number() -> str:
    while True:
        account_number = generate_account_number()
        if db.wallets.find_one({"account_number": account_number}) is None:
            return account_number


def seed_user() -> None:
    ensure_indexes(db)
    existing_user = db.users.find_one({"email": USER_EMAIL})
    conflicting_phone_user = db.users.find_one(
        {"phone_number": USER_PHONE, "email": {"$ne": USER_EMAIL}},
    )
    if conflicting_phone_user and existing_user is None:
        raise RuntimeError(
            f"Cannot seed demo user because phone number {USER_PHONE} is already in use."
        )
    if existing_user and existing_user.get("role") == "admin":
        raise RuntimeError(
            f"Cannot seed demo user because {USER_EMAIL} belongs to an admin account."
        )

    now = utc_now()
    user_id = existing_user["id"] if existing_user else generate_id()
    user_fields = {
        "full_name": "Adebowale",
        "email": USER_EMAIL,
        "phone_number": existing_user.get("phone_number", USER_PHONE)
        if existing_user
        else USER_PHONE,
        "password_hash": hash_value(USER_PASSWORD),
        "transaction_pin_hash": hash_value(USER_TRANSACTION_PIN),
        "role": "user",
        "is_active": True,
        "is_frozen": False,
        "is_email_verified": True,
        "updated_at": now,
    }

    if existing_user:
        db.users.update_one({"id": user_id}, {"$set": user_fields})
        action = "updated"
    else:
        db.users.insert_one({"id": user_id, **user_fields, "created_at": now})
        action = "created"

    wallet = db.wallets.find_one({"user_id": user_id})
    if wallet is None:
        db.wallets.insert_one(
            {
                "id": generate_id(),
                "user_id": user_id,
                "account_number": generate_unique_account_number(),
                "balance": to_decimal128("0.00"),
                "currency": "NGN",
                "created_at": now,
                "updated_at": now,
            }
        )

    print(f"Demo user {action} successfully.")
    print(f"Email: {USER_EMAIL}")
    print(f"Password: {USER_PASSWORD}")
    print(f"Transaction PIN: {USER_TRANSACTION_PIN}")


if __name__ == "__main__":
    seed_user()
