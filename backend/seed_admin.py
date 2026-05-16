from app.database import db, ensure_indexes
from app.utils.generate_account import generate_account_number
from app.utils.mongo import generate_id, to_decimal128, utc_now
from app.utils.security import hash_value


def generate_unique_account_number() -> str:
    while True:
        account_number = generate_account_number()
        if db.wallets.find_one({"account_number": account_number}) is None:
            return account_number


def seed_admin() -> None:
    ensure_indexes(db)
    admin = db.users.find_one({"email": "admin@stpay.com"})
    if admin:
        print("Admin user already exists.")
        return

    admin_id = generate_id()
    admin = {
        "id": admin_id,
        "full_name": "STPay Admin",
        "email": "admin@stpay.com",
        "phone_number": "09000000000",
        "password_hash": hash_value("Admin12345"),
        "transaction_pin_hash": hash_value("1234"),
        "role": "admin",
        "is_active": True,
        "is_frozen": False,
        "is_email_verified": True,
        "created_at": utc_now(),
        "updated_at": utc_now(),
    }
    wallet = {
        "id": generate_id(),
        "user_id": admin_id,
        "account_number": generate_unique_account_number(),
        "balance": to_decimal128("0.00"),
        "currency": "NGN",
        "created_at": utc_now(),
        "updated_at": utc_now(),
    }
    db.users.insert_one(admin)
    db.wallets.insert_one(wallet)
    print("Admin user created successfully.")


if __name__ == "__main__":
    seed_admin()
