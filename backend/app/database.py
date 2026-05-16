from collections.abc import Generator

import certifi
from pymongo import ASCENDING, MongoClient
from pymongo.database import Database
from pymongo.errors import ConfigurationError

from app.config import get_settings


settings = get_settings()
mongo_client_options = {
    "serverSelectionTimeoutMS": 30000,
    "connectTimeoutMS": 20000,
    "socketTimeoutMS": 20000,
}
if settings.mongodb_url.startswith("mongodb+srv://") or "tls=true" in settings.mongodb_url.lower():
    mongo_client_options["tlsCAFile"] = certifi.where()

client = MongoClient(settings.mongodb_url, **mongo_client_options)
try:
    default_database = client.get_default_database()
except ConfigurationError:
    default_database = None
database_name = default_database.name if default_database is not None else settings.mongodb_db_name
db = client[database_name]


def get_db() -> Generator[Database, None, None]:
    yield db


def ensure_indexes(database: Database) -> None:
    database.users.create_index([("id", ASCENDING)], unique=True)
    database.users.create_index([("email", ASCENDING)], unique=True)
    database.users.create_index([("phone_number", ASCENDING)], unique=True)
    database.wallets.create_index([("id", ASCENDING)], unique=True)
    database.wallets.create_index([("user_id", ASCENDING)], unique=True)
    database.wallets.create_index([("account_number", ASCENDING)], unique=True)
    database.transactions.create_index([("id", ASCENDING)], unique=True)
    database.transactions.create_index([("reference", ASCENDING)])
    database.beneficiaries.create_index([("id", ASCENDING)], unique=True)
    database.email_otps.create_index([("id", ASCENDING)], unique=True)
    database.email_otps.create_index([("email", ASCENDING)])
    database.notifications.create_index([("id", ASCENDING)], unique=True)
    database.bill_payments.create_index([("id", ASCENDING)], unique=True)
    database.airtime_purchases.create_index([("id", ASCENDING)], unique=True)
