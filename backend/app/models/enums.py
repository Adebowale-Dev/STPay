import enum


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class TransactionType(str, enum.Enum):
    FUNDING = "funding"
    TRANSFER = "transfer"
    AIRTIME = "airtime"
    BILL_PAYMENT = "bill_payment"


class TransactionDirection(str, enum.Enum):
    CREDIT = "credit"
    DEBIT = "debit"


class TransactionStatus(str, enum.Enum):
    SUCCESSFUL = "successful"
    FAILED = "failed"
    PENDING = "pending"


class OTPPurpose(str, enum.Enum):
    EMAIL_VERIFICATION = "email_verification"
    PASSWORD_RESET = "password_reset"

