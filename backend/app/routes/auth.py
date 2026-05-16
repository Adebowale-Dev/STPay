from fastapi import APIRouter, Depends
from pymongo.database import Database

from app.database import get_db
from app.schemas.auth import (
    AuthPayload,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    ResendVerificationCodeRequest,
    VerifyEmailRequest,
)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(payload: RegisterRequest, db: Database = Depends(get_db)) -> dict:
    user = AuthService(db).register_user(payload)
    return {
        "success": True,
        "message": "Registration successful. Please verify your email.",
        "data": {
            "user": UserResponse.model_validate(user).model_dump(),
            "wallet_account_number": user["wallet"]["account_number"],
        },
    }


@router.post("/login")
def login(payload: LoginRequest, db: Database = Depends(get_db)) -> dict:
    token, user = AuthService(db).login_user(payload)
    auth_payload = AuthPayload(access_token=token, user=user)
    return {
        "success": True,
        "message": "Login successful.",
        "data": auth_payload.model_dump(),
    }


@router.post("/verify-email")
def verify_email(payload: VerifyEmailRequest, db: Database = Depends(get_db)) -> dict:
    AuthService(db).verify_email(payload)
    return {"success": True, "message": "Email verified successfully.", "data": None}


@router.post("/resend-verification-code")
def resend_verification_code(
    payload: ResendVerificationCodeRequest,
    db: Database = Depends(get_db),
) -> dict:
    AuthService(db).resend_verification_code(payload)
    return {"success": True, "message": "Verification code sent successfully.", "data": None}


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Database = Depends(get_db)) -> dict:
    AuthService(db).forgot_password(payload)
    return {
        "success": True,
        "message": "If the email exists, a reset code has been sent.",
        "data": None,
    }


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Database = Depends(get_db)) -> dict:
    AuthService(db).reset_password(payload)
    return {"success": True, "message": "Password reset successful.", "data": None}
