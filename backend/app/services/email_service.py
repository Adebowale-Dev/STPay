import logging
from decimal import Decimal

import requests

from app.config import get_settings
from app.utils.mongo import from_decimal128


logger = logging.getLogger(__name__)


class BrevoEmailService:
    api_url = "https://api.brevo.com/v3/smtp/email"

    def __init__(self) -> None:
        self.settings = get_settings()

    def send_email(
        self,
        to_email: str,
        to_name: str,
        subject: str,
        html_content: str,
    ) -> bool:
        if not self.settings.brevo_api_key or not self.settings.brevo_sender_email:
            logger.warning("Brevo configuration is missing. Email skipped for %s.", to_email)
            return False

        payload = {
            "sender": {
                "name": self.settings.brevo_sender_name,
                "email": self.settings.brevo_sender_email,
            },
            "to": [{"email": to_email, "name": to_name}],
            "subject": subject,
            "htmlContent": html_content,
        }
        headers = {
            "accept": "application/json",
            "api-key": self.settings.brevo_api_key,
            "content-type": "application/json",
        }

        try:
            response = requests.post(
                self.api_url,
                json=payload,
                headers=headers,
                timeout=15,
            )
            response.raise_for_status()
            return True
        except requests.RequestException as exc:
            logger.error("Brevo email send failed: %s", exc)
            return False

    @staticmethod
    def _format_amount(amount: Decimal) -> str:
        return f"{amount:,.2f}"

    def send_verification_otp(self, user: dict, otp: str) -> bool:
        return self.send_email(
            user["email"],
            user["full_name"],
            "Verify your STPay email",
            (
                f"<p>Hello {user['full_name']},</p>"
                f"<p>Your STPay verification code is <strong>{otp}</strong>.</p>"
                "<p>This code expires in 10 minutes.</p>"
            ),
        )

    def send_welcome_email(self, user: dict) -> bool:
        return self.send_email(
            user["email"],
            user["full_name"],
            "Welcome to STPay",
            (
                f"<p>Hello {user['full_name']},</p>"
                "<p>Your email has been verified successfully.</p>"
                "<p>Welcome to STPay.</p>"
            ),
        )

    def send_password_reset_email(self, user: dict, otp_or_link: str) -> bool:
        return self.send_email(
            user["email"],
            user["full_name"],
            "Reset your STPay password",
            (
                f"<p>Hello {user['full_name']},</p>"
                f"<p>Your password reset code is <strong>{otp_or_link}</strong>.</p>"
                "<p>This code expires in 10 minutes.</p>"
            ),
        )

    def send_transaction_alert(self, user: dict, transaction: dict) -> bool:
        return self.send_email(
            user["email"],
            user["full_name"],
            "STPay transaction alert",
            (
                f"<p>Hello {user['full_name']},</p>"
                f"<p>Transaction reference: <strong>{transaction['reference']}</strong></p>"
                f"<p>Amount: NGN {self._format_amount(from_decimal128(transaction['amount']))}</p>"
            ),
        )

    def send_funding_alert(self, user: dict, transaction: dict) -> bool:
        return self.send_email(
            user["email"],
            user["full_name"],
            "Wallet funding successful",
            (
                f"<p>Hello {user['full_name']},</p>"
                f"<p>Your wallet has been funded with NGN {self._format_amount(from_decimal128(transaction['amount']))}.</p>"
                f"<p>Reference: <strong>{transaction['reference']}</strong></p>"
            ),
        )

    def send_transfer_debit_alert(self, sender: dict, transaction: dict) -> bool:
        return self.send_email(
            sender["email"],
            sender["full_name"],
            "Transfer debit alert",
            (
                f"<p>Hello {sender['full_name']},</p>"
                f"<p>NGN {self._format_amount(from_decimal128(transaction['amount']))} has been debited from your wallet.</p>"
                f"<p>Reference: <strong>{transaction['reference']}</strong></p>"
            ),
        )

    def send_transfer_credit_alert(self, receiver: dict, transaction: dict) -> bool:
        return self.send_email(
            receiver["email"],
            receiver["full_name"],
            "Transfer credit alert",
            (
                f"<p>Hello {receiver['full_name']},</p>"
                f"<p>NGN {self._format_amount(from_decimal128(transaction['amount']))} has been credited to your wallet.</p>"
                f"<p>Reference: <strong>{transaction['reference']}</strong></p>"
            ),
        )

    def send_airtime_receipt(self, user: dict, transaction: dict) -> bool:
        return self.send_email(
            user["email"],
            user["full_name"],
            "Airtime purchase receipt",
            (
                f"<p>Hello {user['full_name']},</p>"
                f"<p>Your airtime purchase of NGN {self._format_amount(from_decimal128(transaction['amount']))} was successful.</p>"
                f"<p>Reference: <strong>{transaction['reference']}</strong></p>"
            ),
        )

    def send_bill_payment_receipt(self, user: dict, transaction: dict) -> bool:
        return self.send_email(
            user["email"],
            user["full_name"],
            "Bill payment receipt",
            (
                f"<p>Hello {user['full_name']},</p>"
                f"<p>Your bill payment of NGN {self._format_amount(from_decimal128(transaction['amount']))} was successful.</p>"
                f"<p>Reference: <strong>{transaction['reference']}</strong></p>"
            ),
        )

    def send_account_status_email(self, user: dict, status: str) -> bool:
        return self.send_email(
            user["email"],
            user["full_name"],
            f"Account {status} notification",
            (
                f"<p>Hello {user['full_name']},</p>"
                f"<p>Your STPay account has been {status}.</p>"
            ),
        )

    def send_security_alert(self, user: dict, message: str) -> bool:
        return self.send_email(
            user["email"],
            user["full_name"],
            "STPay security alert",
            f"<p>Hello {user['full_name']},</p><p>{message}</p>",
        )
