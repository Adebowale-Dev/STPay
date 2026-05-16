from decimal import Decimal

from fastapi import HTTPException
from pymongo import DESCENDING
from pymongo.database import Database

from app.models.enums import TransactionDirection, TransactionStatus, TransactionType
from app.schemas.airtime import AirtimePurchaseRequest
from app.schemas.bill import BillPaymentRequest
from app.schemas.wallet import FundWalletRequest, TransferRequest
from app.services.email_service import BrevoEmailService
from app.services.notification_service import NotificationService
from app.utils.generate_reference import generate_reference
from app.utils.mongo import (
    from_decimal128,
    generate_id,
    normalize_money,
    serialize_document,
    serialize_documents,
    to_decimal128,
    utc_now,
)
from app.utils.security import verify_value


class WalletService:
    def __init__(self, db: Database) -> None:
        self.db = db
        self.email_service = BrevoEmailService()

    def _get_wallet_for_user(self, user_id: str) -> dict:
        wallet = self.db.wallets.find_one({"user_id": user_id})
        if wallet is None:
            raise HTTPException(status_code=404, detail="Wallet not found.")
        return wallet

    def _ensure_transaction_ready(self, user: dict, transaction_pin: str | None = None) -> None:
        if not user["is_active"]:
            raise HTTPException(status_code=403, detail="Account is inactive.")
        if user["is_frozen"]:
            raise HTTPException(status_code=403, detail="Account is frozen.")
        if not user["is_email_verified"]:
            raise HTTPException(status_code=403, detail="Please verify your email first.")
        if transaction_pin and not verify_value(transaction_pin, user["transaction_pin_hash"]):
            raise HTTPException(status_code=400, detail="Invalid transaction PIN.")

    def get_wallet_balance(self, user: dict) -> dict:
        return serialize_document(self._get_wallet_for_user(user["id"]))

    def fund_wallet(self, user: dict, payload: FundWalletRequest) -> tuple[dict, dict]:
        self._ensure_transaction_ready(user)
        wallet = self._get_wallet_for_user(user["id"])
        current_balance = from_decimal128(wallet["balance"])
        new_balance = normalize_money(current_balance + payload.amount)
        reference = generate_reference()

        self.db.wallets.update_one(
            {"id": wallet["id"]},
            {"$set": {"balance": to_decimal128(new_balance), "updated_at": utc_now()}},
        )
        transaction = {
            "id": generate_id(),
            "reference": reference,
            "sender_id": None,
            "receiver_id": user["id"],
            "amount": to_decimal128(payload.amount),
            "transaction_type": TransactionType.FUNDING.value,
            "direction": TransactionDirection.CREDIT.value,
            "status": TransactionStatus.SUCCESSFUL.value,
            "description": f"Wallet funding via {payload.payment_method}",
            "created_at": utc_now(),
        }
        self.db.transactions.insert_one(transaction)
        NotificationService.create_notification(
            self.db,
            user_id=user["id"],
            title="Wallet funded",
            message=f"Your wallet was funded with NGN {payload.amount:,.2f}.",
            notification_type="funding",
        )
        wallet["balance"] = to_decimal128(new_balance)
        self.email_service.send_funding_alert(user, transaction)
        return serialize_document(wallet), serialize_document(transaction)

    def transfer(self, sender: dict, payload: TransferRequest) -> tuple[dict, dict]:
        self._ensure_transaction_ready(sender, payload.transaction_pin)
        sender_wallet = self._get_wallet_for_user(sender["id"])
        receiver_wallet = self.db.wallets.find_one({"account_number": payload.receiver_account_number})
        if receiver_wallet is None:
            raise HTTPException(status_code=404, detail="Receiver wallet not found.")
        if receiver_wallet["user_id"] == sender["id"]:
            raise HTTPException(status_code=400, detail="You cannot transfer to yourself.")

        receiver = self.db.users.find_one({"id": receiver_wallet["user_id"]})
        if receiver is None or not receiver["is_active"]:
            raise HTTPException(status_code=400, detail="Receiver account is unavailable.")

        sender_balance = from_decimal128(sender_wallet["balance"])
        receiver_balance = from_decimal128(receiver_wallet["balance"])
        if sender_balance < payload.amount:
            raise HTTPException(status_code=400, detail="Insufficient wallet balance.")

        new_sender_balance = normalize_money(sender_balance - payload.amount)
        new_receiver_balance = normalize_money(receiver_balance + payload.amount)
        reference = generate_reference()

        self.db.wallets.update_one(
            {"id": sender_wallet["id"]},
            {"$set": {"balance": to_decimal128(new_sender_balance), "updated_at": utc_now()}},
        )
        self.db.wallets.update_one(
            {"id": receiver_wallet["id"]},
            {"$set": {"balance": to_decimal128(new_receiver_balance), "updated_at": utc_now()}},
        )

        sender_txn = {
            "id": generate_id(),
            "reference": reference,
            "sender_id": sender["id"],
            "receiver_id": receiver["id"],
            "amount": to_decimal128(payload.amount),
            "transaction_type": TransactionType.TRANSFER.value,
            "direction": TransactionDirection.DEBIT.value,
            "status": TransactionStatus.SUCCESSFUL.value,
            "description": payload.description or "STPay transfer",
            "created_at": utc_now(),
        }
        receiver_txn = {
            "id": generate_id(),
            "reference": reference,
            "sender_id": sender["id"],
            "receiver_id": receiver["id"],
            "amount": to_decimal128(payload.amount),
            "transaction_type": TransactionType.TRANSFER.value,
            "direction": TransactionDirection.CREDIT.value,
            "status": TransactionStatus.SUCCESSFUL.value,
            "description": payload.description or "STPay transfer",
            "created_at": utc_now(),
        }
        self.db.transactions.insert_many([sender_txn, receiver_txn])
        NotificationService.create_notification(
            self.db,
            user_id=sender["id"],
            title="Transfer successful",
            message=f"NGN {payload.amount:,.2f} was sent successfully.",
            notification_type="transfer",
        )
        NotificationService.create_notification(
            self.db,
            user_id=receiver["id"],
            title="Wallet credited",
            message=f"You received NGN {payload.amount:,.2f} from {sender['full_name']}.",
            notification_type="transfer",
        )
        sender_wallet["balance"] = to_decimal128(new_sender_balance)
        self.email_service.send_transfer_debit_alert(sender, sender_txn)
        self.email_service.send_transfer_credit_alert(receiver, receiver_txn)
        return serialize_document(sender_wallet), serialize_document(sender_txn)

    def purchase_airtime(self, user: dict, payload: AirtimePurchaseRequest) -> tuple[dict, dict]:
        self._ensure_transaction_ready(user, payload.transaction_pin)
        wallet = self._get_wallet_for_user(user["id"])
        current_balance = from_decimal128(wallet["balance"])
        if current_balance < payload.amount:
            raise HTTPException(status_code=400, detail="Insufficient wallet balance.")

        new_balance = normalize_money(current_balance - payload.amount)
        reference = generate_reference()
        self.db.wallets.update_one(
            {"id": wallet["id"]},
            {"$set": {"balance": to_decimal128(new_balance), "updated_at": utc_now()}},
        )
        transaction = {
            "id": generate_id(),
            "reference": reference,
            "sender_id": user["id"],
            "receiver_id": None,
            "amount": to_decimal128(payload.amount),
            "transaction_type": TransactionType.AIRTIME.value,
            "direction": TransactionDirection.DEBIT.value,
            "status": TransactionStatus.SUCCESSFUL.value,
            "description": f"Airtime purchase for {payload.phone_number}",
            "created_at": utc_now(),
        }
        self.db.transactions.insert_one(transaction)
        airtime_purchase = {
            "id": generate_id(),
            "user_id": user["id"],
            "network_provider": payload.network_provider,
            "phone_number": payload.phone_number,
            "amount": to_decimal128(payload.amount),
            "transaction_id": transaction["id"],
            "created_at": utc_now(),
        }
        self.db.airtime_purchases.insert_one(airtime_purchase)
        NotificationService.create_notification(
            self.db,
            user_id=user["id"],
            title="Airtime purchase successful",
            message=f"Your airtime purchase of NGN {payload.amount:,.2f} was successful.",
            notification_type="airtime",
        )
        wallet["balance"] = to_decimal128(new_balance)
        self.email_service.send_airtime_receipt(user, transaction)
        return serialize_document(wallet), serialize_document(transaction)

    def pay_bill(self, user: dict, payload: BillPaymentRequest) -> tuple[dict, dict]:
        self._ensure_transaction_ready(user, payload.transaction_pin)
        wallet = self._get_wallet_for_user(user["id"])
        current_balance = from_decimal128(wallet["balance"])
        if current_balance < payload.amount:
            raise HTTPException(status_code=400, detail="Insufficient wallet balance.")

        new_balance = normalize_money(current_balance - payload.amount)
        reference = generate_reference()
        self.db.wallets.update_one(
            {"id": wallet["id"]},
            {"$set": {"balance": to_decimal128(new_balance), "updated_at": utc_now()}},
        )
        transaction = {
            "id": generate_id(),
            "reference": reference,
            "sender_id": user["id"],
            "receiver_id": None,
            "amount": to_decimal128(payload.amount),
            "transaction_type": TransactionType.BILL_PAYMENT.value,
            "direction": TransactionDirection.DEBIT.value,
            "status": TransactionStatus.SUCCESSFUL.value,
            "description": f"{payload.provider} bill payment",
            "created_at": utc_now(),
        }
        self.db.transactions.insert_one(transaction)
        bill_payment = {
            "id": generate_id(),
            "user_id": user["id"],
            "category": payload.category,
            "provider": payload.provider,
            "customer_number": payload.customer_number,
            "amount": to_decimal128(payload.amount),
            "transaction_id": transaction["id"],
            "created_at": utc_now(),
        }
        self.db.bill_payments.insert_one(bill_payment)
        NotificationService.create_notification(
            self.db,
            user_id=user["id"],
            title="Bill payment successful",
            message=f"Your bill payment of NGN {payload.amount:,.2f} was successful.",
            notification_type="bill_payment",
        )
        wallet["balance"] = to_decimal128(new_balance)
        self.email_service.send_bill_payment_receipt(user, transaction)
        return serialize_document(wallet), serialize_document(transaction)

    def get_user_transactions(
        self,
        user: dict,
        *,
        transaction_type: str | None = None,
        status_value: str | None = None,
        direction: str | None = None,
        date_from=None,
        date_to=None,
    ) -> list[dict]:
        query = {"$or": [{"sender_id": user["id"]}, {"receiver_id": user["id"]}]}
        if transaction_type:
            query["transaction_type"] = transaction_type
        if status_value:
            query["status"] = status_value
        if direction:
            query["direction"] = direction
        if date_from or date_to:
            query["created_at"] = {}
            if date_from:
                query["created_at"]["$gte"] = date_from
            if date_to:
                query["created_at"]["$lte"] = date_to
        return serialize_documents(self.db.transactions.find(query).sort("created_at", DESCENDING))

    def get_transaction_by_reference(self, user: dict, reference: str) -> list[dict]:
        query = {
            "reference": reference,
            "$or": [{"sender_id": user["id"]}, {"receiver_id": user["id"]}],
        }
        transactions = serialize_documents(
            self.db.transactions.find(query).sort("created_at", DESCENDING)
        )
        if not transactions:
            raise HTTPException(status_code=404, detail="Transaction not found.")
        return transactions
