from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt

from app.config import get_settings


settings = get_settings()


def hash_value(value: str) -> str:
    return bcrypt.hashpw(value.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_value(plain_value: str, hashed_value: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_value.encode("utf-8"),
            hashed_value.encode("utf-8"),
        )
    except ValueError:
        return False


def create_access_token(subject: str) -> str:
    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])


def get_token_subject(token: str) -> str:
    try:
        payload = decode_token(token)
        subject = payload.get("sub")
        if subject is None:
            raise JWTError("Token subject missing.")
        return subject
    except JWTError as exc:
        raise exc
