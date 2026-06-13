import hashlib
import hmac
from decimal import Decimal

from app.config import get_settings


TIER_LIMITS = {
    1: {"max_balance": Decimal("50000.00"), "max_transfer": Decimal("100000.00")},
    2: {"max_balance": Decimal("1000000.00"), "max_transfer": Decimal("500000.00")},
    3: {"max_balance": None, "max_transfer": None},
}


def get_account_tier(user: dict) -> int:
    return int(user.get("account_tier", 1))


def get_tier_limits(user: dict) -> dict:
    return TIER_LIMITS[get_account_tier(user)]


def hash_identity_number(value: str) -> str:
    secret = get_settings().secret_key.encode("utf-8")
    return hmac.new(secret, value.encode("utf-8"), hashlib.sha256).hexdigest()
