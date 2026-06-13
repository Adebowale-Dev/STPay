import logging
from datetime import datetime
from decimal import Decimal

import requests

from app.config import get_settings
from app.utils.mongo import from_decimal128


logger = logging.getLogger(__name__)


class BrevoEmailService:
    api_url = "https://api.brevo.com/v3/smtp/email"

    def __init__(self) -> None:
        self.settings = get_settings()
        self.last_error: str | None = None

    def send_email(
        self,
        to_email: str,
        to_name: str,
        subject: str,
        html_content: str,
    ) -> bool:
        self.last_error = None
        if not self.settings.brevo_api_key or not self.settings.brevo_sender_email:
            self.last_error = "Brevo configuration is missing."
            logger.warning("Brevo configuration is missing. Email skipped for %s.", to_email)
            return False

        # Brevo matches transactional senders strictly against verified addresses.
        sender_email = self.settings.brevo_sender_email.strip().lower()
        payload = {
            "sender": {
                "name": self.settings.brevo_sender_name,
                "email": sender_email,
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
            response = getattr(exc, "response", None)
            if response is not None:
                try:
                    response_message = response.json().get("message")
                except ValueError:
                    response_message = response.text[:300]
                self.last_error = response_message or str(exc)
            else:
                self.last_error = str(exc)
            logger.error("Brevo email send failed for %s: %s", to_email, self.last_error)
            return False

    @staticmethod
    def _format_amount(amount: Decimal) -> str:
        return f"{amount:,.2f}"

    def send_verification_otp(
        self,
        user: dict,
        otp: str,
        requested_at: datetime | None = None,
    ) -> bool:
        request_label = (
            requested_at.strftime("%d %b %Y, %H:%M UTC")
            if requested_at is not None
            else "just now"
        )
        return self.send_email(
            user["email"],
            user["full_name"],
            f"Your latest STPay verification code ({request_label})",
            (
                f"<p>Hello {user['full_name']},</p>"
                f"<p>This is the verification code requested at <strong>{request_label}</strong>.</p>"
                f"<p>Your STPay verification code is <strong>{otp}</strong>.</p>"
                "<p>This code expires in 10 minutes.</p>"
                "<p>Only your most recently requested code will work.</p>"
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

    def send_admin_created_account_email(
        self,
        user: dict,
        account_number: str,
        temporary_password: str,
        transaction_pin: str,
    ) -> bool:
        login_url = f"{self.settings.frontend_url.rstrip('/')}/login"
        return self.send_email(
            user["email"],
            user["full_name"],
            "Your STPay account is ready",
            (
                "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#102018'>"
                "<div style='background:#10b981;padding:24px;border-radius:16px 16px 0 0'>"
                "<h1 style='margin:0;color:#06130d;font-size:24px'>Welcome to STPay</h1>"
                "</div>"
                "<div style='padding:24px;border:1px solid #d8e5dd;border-top:0;border-radius:0 0 16px 16px'>"
                f"<p>Hello {user['full_name']},</p>"
                "<p>An STPay administrator has created your secure wallet account.</p>"
                "<div style='background:#f1f8f4;padding:18px;border-radius:12px;margin:20px 0'>"
                f"<p><strong>Account number:</strong> {account_number}</p>"
                f"<p><strong>Temporary password:</strong> {temporary_password}</p>"
                f"<p><strong>Transaction PIN:</strong> {transaction_pin}</p>"
                "</div>"
                "<p>For your security, sign in and change both your temporary password and transaction PIN immediately.</p>"
                f"<p><a href='{login_url}' style='display:inline-block;background:#10b981;color:#06130d;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:bold'>Sign in to STPay</a></p>"
                "<p style='font-size:12px;color:#64746b'>Do not share your password, transaction PIN, or OTP with anyone.</p>"
                "</div></div>"
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
