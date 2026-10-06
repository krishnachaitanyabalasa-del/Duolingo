import re
from typing import Any


def normalize_answer(val: Any) -> str:
    """
    Reusable answer normalization function.
    Trims whitespace, converts to lowercase, strips punctuation
    (including punctuation attached to individual words in lists),
    and normalizes multiple spaces.
    """
    if isinstance(val, (list, tuple, set)):
        val = " ".join(str(v) for v in val)
    s = str(val or "").strip().lower()
    s = re.sub(r'[!?,.:;\-_"\'“”]', ' ', s)
    return " ".join(s.split())

