"""
Low-level, backend-owned economy primitives.

Everything that changes XP / gems or records learner activity goes through here so that
there is exactly ONE implementation. Functions never commit: callers own the transaction
so multi-step actions (lesson complete, test pass, quest claim) succeed or fail atomically.
"""
from datetime import date
from typing import Optional
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.quest import UserDailyActivity
from app.utils.date_utils import get_today_date


def apply_user_delta(db: Session, user: User, xp: int = 0, gems: int = 0) -> None:
    """
    Atomically adds XP / gems using SQL arithmetic (xp = xp + n) instead of a Python
    read-modify-write, so concurrent requests can never lose or duplicate an update.
    """
    if not xp and not gems:
        return
    db.flush()
    values = {}
    if xp:
        values[User.xp] = User.xp + xp
    if gems:
        values[User.gems] = User.gems + gems
    db.query(User).filter(User.id == user.id).update(values, synchronize_session=False)
    db.refresh(user)


def get_or_create_activity(db: Session, user_id: int, day: Optional[date] = None) -> UserDailyActivity:
    """
    Returns the activity row for `day` (default today), creating it exactly once.
    Uses INSERT ... ON CONFLICT DO NOTHING on the (user_id, activity_date) unique key, so
    concurrent requests are safe and the caller's open transaction is never rolled back.
    """
    day = day or get_today_date()
    db.execute(
        sqlite_insert(UserDailyActivity)
        .values(user_id=user_id, activity_date=day)
        .on_conflict_do_nothing(index_elements=["user_id", "activity_date"])
    )
    return (
        db.query(UserDailyActivity)
        .filter(UserDailyActivity.user_id == user_id, UserDailyActivity.activity_date == day)
        .one()
    )


def _bump_activity(db: Session, user_id: int, **increments: int) -> None:
    """Atomic SQL increment of daily counters (activity.col = activity.col + n)."""
    activity = get_or_create_activity(db, user_id)
    values = {
        getattr(UserDailyActivity, col): getattr(UserDailyActivity, col) + amount
        for col, amount in increments.items()
        if amount
    }
    if values:
        db.query(UserDailyActivity).filter(UserDailyActivity.id == activity.id).update(
            values, synchronize_session=False
        )
        db.expire(activity)


def record_xp(db: Session, user: User, amount: int) -> None:
    """Awards XP to the user AND counts it toward today's 'XP earned'."""
    if amount <= 0:
        return
    apply_user_delta(db, user, xp=amount)
    _bump_activity(db, user.id, xp_earned=amount)


def record_answers(db: Session, user: User, correct: int, total: int) -> None:
    """Counts answered exercises toward today's accuracy."""
    _bump_activity(db, user.id, correct_answers=correct, total_answers=total)


def record_lesson_completed(db: Session, user: User) -> None:
    _bump_activity(db, user.id, lessons_completed=1)


def record_test_passed(db: Session, user: User) -> None:
    _bump_activity(db, user.id, tests_passed=1)


def record_practice_session(db: Session, user: User) -> None:
    _bump_activity(db, user.id, practice_sessions=1)


def get_today_activity(db: Session, user_id: int) -> UserDailyActivity:
    return get_or_create_activity(db, user_id)
