import random


def generate_account_number() -> str:
    return "".join(random.choices("0123456789", k=10))

