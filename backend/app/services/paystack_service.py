import hashlib
import hmac

import requests
from fastapi import HTTPException

from app.config import get_settings


class PaystackService:
    def __init__(self) -> None:
        self.settings = get_settings()

    def _ensure_configured(self) -> None:
        if not self.settings.paystack_secret_key:
            raise HTTPException(
                status_code=503,
                detail="External bank transfers are not configured. Add PAYSTACK_SECRET_KEY.",
            )

    @property
    def is_test_mode(self) -> bool:
        return self.settings.paystack_secret_key.startswith("sk_test_")

    def _request(self, method: str, path: str, **kwargs) -> dict:
        self._ensure_configured()
        headers = {
            "Authorization": f"Bearer {self.settings.paystack_secret_key}",
            "Content-Type": "application/json",
        }
        try:
            response = requests.request(
                method,
                f"{self.settings.paystack_api_url.rstrip('/')}{path}",
                headers=headers,
                timeout=30,
                **kwargs,
            )
            payload = response.json()
        except requests.RequestException as exc:
            raise HTTPException(status_code=502, detail="Unable to reach the bank transfer provider.") from exc
        except ValueError as exc:
            raise HTTPException(status_code=502, detail="Invalid response from the bank transfer provider.") from exc

        if not response.ok or not payload.get("status"):
            message = payload.get("message", "The bank transfer provider rejected the request.")
            if "Test mode daily limit" in message:
                message = (
                    "Paystack test mode has reached its daily live-bank lookup limit. "
                    "Select Paystack Test Bank to continue testing, or use a Paystack live key."
                )
            raise HTTPException(
                status_code=400 if response.status_code < 500 else 502,
                detail=message,
            )
        return payload["data"]

    def list_banks(self) -> list[dict]:
        banks = self._request(
            "GET",
            "/bank",
            params={"country": "nigeria", "currency": "NGN", "perPage": 100},
        )
        unique_banks: dict[str, dict] = {}
        for bank in banks:
            code = bank.get("code")
            if not code or not bank.get("active", True):
                continue

            item = {"name": bank["name"], "code": code, "slug": bank.get("slug")}
            existing = unique_banks.get(code)
            if existing is None or bank.get("is_deleted") is False:
                unique_banks[code] = item

        result = sorted(unique_banks.values(), key=lambda bank: bank["name"].lower())
        if self.is_test_mode:
            result.insert(
                0,
                {
                    "name": "Paystack Test Bank",
                    "code": "001",
                    "slug": "paystack-test-bank",
                    "test_mode": True,
                },
            )
        return result

    def resolve_account(self, account_number: str, bank_code: str) -> dict:
        account = self._request(
            "GET",
            "/bank/resolve",
            params={"account_number": account_number, "bank_code": bank_code},
        )
        return {
            "account_name": account["account_name"],
            "account_number": account["account_number"],
        }

    def create_transfer_recipient(
        self,
        *,
        account_name: str,
        account_number: str,
        bank_code: str,
    ) -> str:
        recipient = self._request(
            "POST",
            "/transferrecipient",
            json={
                "type": "nuban",
                "name": account_name,
                "account_number": account_number,
                "bank_code": bank_code,
                "currency": "NGN",
            },
        )
        return recipient["recipient_code"]

    def initiate_transfer(
        self,
        *,
        amount_kobo: int,
        recipient_code: str,
        reference: str,
        reason: str,
    ) -> dict:
        return self._request(
            "POST",
            "/transfer",
            json={
                "source": "balance",
                "amount": amount_kobo,
                "recipient": recipient_code,
                "reference": reference,
                "reason": reason,
            },
        )

    def verify_transfer(self, reference: str) -> dict:
        return self._request("GET", f"/transfer/verify/{reference}")

    def verify_webhook_signature(self, body: bytes, signature: str | None) -> bool:
        if not self.settings.paystack_secret_key or not signature:
            return False
        expected = hmac.new(
            self.settings.paystack_secret_key.encode(),
            body,
            hashlib.sha512,
        ).hexdigest()
        return hmac.compare_digest(expected, signature)
