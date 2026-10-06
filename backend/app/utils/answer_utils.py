from typing import Any


def normalize_answer(val: Any) -> str:
    """
    Reusable answer normalization function.
    Trims leading/trailing whitespace, converts to lowercase,
    normalizes spaces, and strips sentence-ending punctuation.
    """
    if isinstance(val, (list, tuple)):
        val = " ".join(str(v) for v in val)
    s = str(val or "").strip().lower()
    s = s.rstrip(".!?")
    return " ".join(s.split())
