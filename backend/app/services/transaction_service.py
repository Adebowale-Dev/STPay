from decimal import Decimal

from pymongo import DESCENDING
from pymongo.database import Database

from app.utils.mongo import from_decimal128, serialize_documents


class TransactionService:
    def __init__(self, db: Database) -> None:
        self.db = db

    def list_all_transactions(self) -> list[dict]:
        return serialize_documents(self.db.transactions.find().sort("created_at", DESCENDING))

    def get_platform_stats(self) -> dict:
        total_users = self.db.users.count_documents({})
        total_successful_transactions = self.db.transactions.count_documents({"status": "successful"})
        total_failed_transactions = self.db.transactions.count_documents({"status": "failed"})

        total_wallet_balance = Decimal("0.00")
        for wallet in self.db.wallets.find({}, {"balance": 1}):
            total_wallet_balance += from_decimal128(wallet.get("balance"))

        return {
            "total_users": total_users,
            "total_wallet_balance": total_wallet_balance,
            "total_successful_transactions": total_successful_transactions,
            "total_failed_transactions": total_failed_transactions,
        }
