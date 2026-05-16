from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from uuid import uuid4

from bson.decimal128 import Decimal128


TWOPLACES = Decimal("0.01")


def generate_id() -> str:
    return uuid4().hex


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def normalize_money(value: Decimal | str | int | float) -> Decimal:
    return Decimal(str(value)).quantize(TWOPLACES, rounding=ROUND_HALF_UP)


def to_decimal128(value: Decimal | str | int | float) -> Decimal128:
    return Decimal128(str(normalize_money(value)))


def from_decimal128(value) -> Decimal:
    if isinstance(value, Decimal128):
        return value.to_decimal()
    if isinstance(value, Decimal):
        return value
    if value is None:
        return Decimal("0.00")
    return Decimal(str(value))


def serialize_document(document: dict | None) -> dict | None:
    if document is None:
        return None
    item = {}
    for key, value in document.items():
        if key == "_id":
            continue
        if isinstance(value, Decimal128):
            item[key] = value.to_decimal()
        else:
            item[key] = value
    return item


def serialize_documents(documents) -> list[dict]:
    return [serialize_document(document) for document in documents]
