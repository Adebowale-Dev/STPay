from app.database import db, ensure_indexes
from app.utils.generate_account import generate_account_number
from app.utils.mongo import generate_id, to_decimal128, utc_now
from app.utils.security import hash_value


ADMIN_EMAIL = "admin@gmail.com"
ADMIN_PASSWORD = "123456789"
LEGACY_ADMIN_EMAIL = "admin@stpay.com"


def generate_unique_account_number() -> str:
    while True:
        account_number = generate_account_number()
        if db.wallets.find_one({"account_number": account_number}) is None:
            return account_number


def seed_admin() -> None:
    ensure_indexes(db)
    conflicting_user = db.users.find_one(
        {"email": ADMIN_EMAIL, "role": {"$ne": "admin"}},
    )
    if conflicting_user:
        raise RuntimeError(
            f"Cannot seed admin because {ADMIN_EMAIL} belongs to a non-admin user."
        )

    admin = (
        db.users.find_one({"email": ADMIN_EMAIL})
        or db.users.find_one({"email": LEGACY_ADMIN_EMAIL})
        or db.users.find_one({"role": "admin"})
    )
    admin_id = admin["id"] if admin else generate_id()
    now = utc_now()
    admin_fields = {
        "full_name": "STPay Admin",
        "email": ADMIN_EMAIL,
        "phone_number": "09000000000",
        "password_hash": hash_value(ADMIN_PASSWORD),
        "transaction_pin_hash": hash_value("1234"),
        "role": "admin",
        "is_active": True,
        "is_frozen": False,
        "is_email_verified": True,
        "updated_at": now,
    }

    if admin:
        db.users.update_one({"id": admin_id}, {"$set": admin_fields})
        action = "updated"
    else:
        db.users.insert_one(
            {
                "id": admin_id,
                **admin_fields,
                "created_at": now,
            }
        )
        action = "created"

    if db.wallets.find_one({"user_id": admin_id}) is None:
        db.wallets.insert_one(
            {
                "id": generate_id(),
                "user_id": admin_id,
                "account_number": generate_unique_account_number(),
                "balance": to_decimal128("0.00"),
                "currency": "NGN",
                "created_at": now,
                "updated_at": now,
            }
        )

    print(f"Admin user {action} successfully.")
    print(f"Email: {ADMIN_EMAIL}")
    print(f"Password: {ADMIN_PASSWORD}")


if __name__ == "__main__":
    seed_admin()
