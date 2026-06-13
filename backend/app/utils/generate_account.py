import random


def generate_account_number() -> str:
    return "".join(random.choices("0123456789", k=10))


def normalize_nigerian_phone_number(phone_number: str) -> str:
    digits = "".join(character for character in phone_number if character.isdigit())
    if digits.startswith("234") and len(digits) == 13:
        digits = f"0{digits[3:]}"
    elif len(digits) == 10:
        digits = f"0{digits}"

    if len(digits) != 11 or not digits.startswith("0"):
        raise ValueError("Enter a valid Nigerian phone number.")
    return digits


def account_number_from_phone(phone_number: str) -> str:
    return normalize_nigerian_phone_number(phone_number)[1:]
