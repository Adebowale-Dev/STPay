from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from pymongo.database import Database

from app.database import get_db
from app.utils.security import get_token_subject


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    db: Annotated[Database, Depends(get_db)],
    token: Annotated[str, Depends(oauth2_scheme)],
) -> dict:
    try:
        user_id = get_token_subject(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
        )

    user = db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="Authenticated user not found.")
    if not user["is_active"]:
        raise HTTPException(status_code=403, detail="Account is inactive.")
    return user


def get_current_admin_user(
    current_user: Annotated[dict, Depends(get_current_user)],
) -> dict:
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")
    return current_user
