import random
from datetime import datetime


def generate_reference(prefix: str = "STP") -> str:
    date_part = datetime.utcnow().strftime("%Y%m%d")
    random_part = "".join(random.choices("0123456789", k=6))
    return f"{prefix}-{date_part}-{random_part}"

