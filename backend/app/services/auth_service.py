from datetime import timedelta
import secrets
import string

from fastapi import HTTPException, status
from pymongo import DESCENDING
from pymongo.database import Database

from app.models.enums import OTPPurpose
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    ResendVerificationCodeRequest,
    VerifyEmailRequest,
)
from app.schemas.admin import AdminCreateCustomerRequest
from app.services.email_service import BrevoEmailService
from app.services.notification_service import NotificationService
from app.utils.generate_account import account_number_from_phone
from app.utils.generate_otp import generate_otp
from app.utils.mongo import generate_id, is_expired, to_decimal128, utc_now
from app.utils.security import create_access_token, hash_value, verify_value


class AuthService:
    def __init__(self, db: Database) -> None:
        self.db = db
        self.email_service = BrevoEmailService()

    def _account_number_for_phone(self, phone_number: str) -> str:
        account_number = account_number_from_phone(phone_number)
        if self.db.wallets.find_one({"account_number": account_number}) is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account already exists for this phone number.",
            )
        return account_number

    def _invalidate_existing_otps(self, email: str, purpose: OTPPurpose) -> None:
        self.db.email_otps.update_many(
            {
                "email": email,
                "purpose": purpose.value,
                "is_used": False,
            },
            {"$set": {"is_used": True}},
        )

    def _create_otp_record(self, user: dict, purpose: OTPPurpose) -> tuple[str, dict]:
        otp = generate_otp()
        self._invalidate_existing_otps(user["email"], purpose)
        otp_record = {
            "id": generate_id(),
            "user_id": user["id"],
            "email": user["email"],
            "otp_hash": hash_value(otp),
            "purpose": purpose.value,
            "expires_at": utc_now() + timedelta(minutes=10),
            "is_used": False,
            "created_at": utc_now(),
        }
        self.db.email_otps.insert_one(otp_record)
        return otp, otp_record

    def register_user(self, payload: RegisterRequest) -> dict:
        existing_user = self.db.users.find_one(
            {
                "$or": [
                    {"email": payload.email.lower()},
                    {"phone_number": payload.phone_number},
                ]
            }
        )
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email or phone number is already in use.",
            )

        user = {
            "id": generate_id(),
            "full_name": payload.full_name,
            "email": payload.email.lower(),
            "phone_number": payload.phone_number,
            "password_hash": hash_value(payload.password),
            "transaction_pin_hash": hash_value(payload.transaction_pin),
            "role": "user",
            "is_active": True,
            "is_frozen": False,
            "is_email_verified": False,
            "account_tier": 1,
            "nin_verified": False,
            "bvn_verified": False,
            "created_at": utc_now(),
            "updated_at": utc_now(),
        }
        wallet = {
            "id": generate_id(),
            "user_id": user["id"],
            "account_number": self._account_number_for_phone(payload.phone_number),
            "balance": to_decimal128("0.00"),
            "currency": "NGN",
            "created_at": utc_now(),
            "updated_at": utc_now(),
        }

        self.db.users.insert_one(user)
        self.db.wallets.insert_one(wallet)
        otp, otp_record = self._create_otp_record(user, OTPPurpose.EMAIL_VERIFICATION)
        NotificationService.create_notification(
            self.db,
            user_id=user["id"],
            title="Welcome to STPay",
            message="Your account has been created successfully. Verify your email to continue.",
            notification_type="welcome",
        )
        user["wallet"] = wallet
        user["verification_email_sent"] = self.email_service.send_verification_otp(
            user,
            otp,
            otp_record["created_at"],
        )
        return user

    def create_admin_assisted_customer(
        self, payload: AdminCreateCustomerRequest
    ) -> tuple[dict, str, str, bool]:
        existing_user = self.db.users.find_one(
            {
                "$or": [
                    {"email": payload.email.lower()},
                    {"phone_number": payload.phone_number},
                ]
            }
        )
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email or phone number is already in use.",
            )

        alphabet = string.ascii_letters + string.digits + "!@#$"
        temporary_password = "".join(secrets.choice(alphabet) for _ in range(14))
        transaction_pin = f"{secrets.randbelow(10000):04d}"
        now = utc_now()
        user = {
            "id": generate_id(),
            "full_name": payload.full_name.strip(),
            "email": payload.email.lower(),
            "phone_number": payload.phone_number.strip(),
            "password_hash": hash_value(temporary_password),
            "transaction_pin_hash": hash_value(transaction_pin),
            "role": "user",
            "is_active": True,
            "is_frozen": False,
            "is_email_verified": True,
            "account_tier": 1,
            "nin_verified": False,
            "bvn_verified": False,
            "created_at": now,
            "updated_at": now,
        }
        wallet = {
            "id": generate_id(),
            "user_id": user["id"],
            "account_number": self._account_number_for_phone(payload.phone_number),
            "balance": to_decimal128("0.00"),
            "currency": "NGN",
            "created_at": now,
            "updated_at": now,
        }

        self.db.users.insert_one(user)
        self.db.wallets.insert_one(wallet)
        NotificationService.create_notification(
            self.db,
            user_id=user["id"],
            title="Welcome to STPay",
            message="Your STPay account was created by an administrator. Change your temporary credentials after signing in.",
            notification_type="welcome",
        )
        user["wallet"] = wallet
        email_sent = self.email_service.send_admin_created_account_email(
            user,
            wallet["account_number"],
            temporary_password,
            transaction_pin,
        )
        return user, temporary_password, transaction_pin, email_sent

    def login_user(self, payload: LoginRequest) -> tuple[str, dict]:
        identifier = payload.identifier.strip()
        user = self.db.users.find_one(
            {
                "$or": [
                    {"email": identifier.lower()},
                    {"phone_number": identifier},
                ]
            }
        )
        if user is None or not verify_value(payload.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid login credentials.",
            )
        if not user["is_active"]:
            raise HTTPException(status_code=403, detail="Account is inactive.")
        if user["is_frozen"]:
            raise HTTPException(status_code=403, detail="Account is frozen.")
        if not user["is_email_verified"]:
            raise HTTPException(status_code=403, detail="Please verify your email first.")

        token = create_access_token(user["id"])
        return token, user

    def verify_email(self, payload: VerifyEmailRequest) -> dict:
        user = self.db.users.find_one({"email": payload.email.lower()})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found.")
        if user["is_email_verified"]:
            return user

        otp_record = self.db.email_otps.find_one(
            {
                "email": payload.email.lower(),
                "purpose": OTPPurpose.EMAIL_VERIFICATION.value,
                "is_used": False,
            },
            sort=[("created_at", DESCENDING)],
        )
        if otp_record is None:
            raise HTTPException(
                status_code=400,
                detail="Verification code is invalid. Request a new code and use only the most recent STPay email.",
            )
        if is_expired(otp_record["expires_at"]):
            raise HTTPException(status_code=400, detail="Verification code has expired.")
        if not verify_value(payload.otp, otp_record["otp_hash"]):
            raise HTTPException(
                status_code=400,
                detail="Verification code is invalid. Request a new code and use only the most recent STPay email.",
            )

        self.db.users.update_one(
            {"id": user["id"]},
            {"$set": {"is_email_verified": True, "updated_at": utc_now()}},
        )
        self.db.email_otps.update_one({"id": otp_record["id"]}, {"$set": {"is_used": True}})
        user["is_email_verified"] = True
        NotificationService.create_notification(
            self.db,
            user_id=user["id"],
            title="Email verified",
            message="Your email address has been verified successfully.",
            notification_type="security",
        )
        self.email_service.send_welcome_email(user)
        return user

    def resend_verification_code(self, payload: ResendVerificationCodeRequest) -> None:
        user = self.db.users.find_one({"email": payload.email.lower()})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found.")
        if user["is_email_verified"]:
            raise HTTPException(status_code=400, detail="Email is already verified.")
        otp, otp_record = self._create_otp_record(user, OTPPurpose.EMAIL_VERIFICATION)
        if not self.email_service.send_verification_otp(user, otp, otp_record["created_at"]):
            raise HTTPException(
                status_code=502,
                detail=(
                    "Verification code could not be delivered through Brevo. "
                    f"{self.email_service.last_error or 'Check the Brevo configuration and try again.'}"
                ),
            )

    def forgot_password(self, payload: ForgotPasswordRequest) -> None:
        user = self.db.users.find_one({"email": payload.email.lower()})
        if user is None:
            return
        otp, _ = self._create_otp_record(user, OTPPurpose.PASSWORD_RESET)
        self.email_service.send_password_reset_email(user, otp)

    def reset_password(self, payload: ResetPasswordRequest) -> None:
        if payload.new_password != payload.confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match.")
        user = self.db.users.find_one({"email": payload.email.lower()})
        if user is None:
            raise HTTPException(status_code=400, detail="Reset code is invalid.")

        otp_record = self.db.email_otps.find_one(
            {
                "email": payload.email.lower(),
                "purpose": OTPPurpose.PASSWORD_RESET.value,
                "is_used": False,
            },
            sort=[("created_at", DESCENDING)],
        )
        if otp_record is None:
            raise HTTPException(status_code=400, detail="Reset code is invalid.")
        if is_expired(otp_record["expires_at"]):
            raise HTTPException(status_code=400, detail="Reset code has expired.")
        if not verify_value(payload.otp, otp_record["otp_hash"]):
            raise HTTPException(status_code=400, detail="Reset code is invalid.")

        self.db.users.update_one(
            {"id": user["id"]},
            {"$set": {"password_hash": hash_value(payload.new_password), "updated_at": utc_now()}},
        )
        self.db.email_otps.update_one({"id": otp_record["id"]}, {"$set": {"is_used": True}})
        NotificationService.create_notification(
            self.db,
            user_id=user["id"],
            title="Password changed",
            message="Your account password was changed successfully.",
            notification_type="security",
        )
        self.email_service.send_security_alert(user, "Your password has been changed successfully.")
