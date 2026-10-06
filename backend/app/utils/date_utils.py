from datetime import date, timedelta
from typing import Optional
from app.models.user import User

# Optional mock date for deterministic testing of streak logic
_MOCK_TODAY: Optional[date] = None


def get_today_date() -> date:
    """Returns today's date, or mock date if set during testing."""
    if _MOCK_TODAY is not None:
        return _MOCK_TODAY
    return date.today()


def set_mock_today(mock_date: date) -> None:
    """Sets a mock date for unit testing."""
    global _MOCK_TODAY
    _MOCK_TODAY = mock_date


def reset_mock_today() -> None:
    """Resets the mock date."""
    global _MOCK_TODAY
    _MOCK_TODAY = None


def update_user_streak(user: User, active_date: Optional[date] = None) -> bool:
    """
    Updates user streak based on activity date rules:
    - Same day: no change to streak.
    - Next consecutive day: increment streak by 1. Update longest_streak if needed.
    - Gap > 1 day or first activity: reset streak to 1.
    
    Returns True if streak was updated/modified, False otherwise.
    """
    if active_date is None:
        active_date = get_today_date()

    last = user.last_activity_date

    # Same day activity: streak unchanged
    if last == active_date:
        return False

    # Consecutive day activity
    if last == active_date - timedelta(days=1):
        user.streak += 1
        if user.streak > user.longest_streak:
            user.longest_streak = user.streak
        user.last_activity_date = active_date
        return True

    # Gap of >1 day or brand new user
    user.streak = 1
    if user.longest_streak == 0:
        user.longest_streak = 1
    user.last_activity_date = active_date
    return True
