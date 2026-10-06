from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.gamification import LeaderboardEntry, HeartsRefillResponse, StreakCheckResponse
from app.services.user_service import get_default_user
from app.utils.date_utils import update_user_streak, get_today_date


def get_leaderboard(db: Session, current_user_id: int) -> list[LeaderboardEntry]:
    """Returns top users ranked by XP descending, including rank and username."""
    users = db.query(User).order_by(User.xp.desc()).all()
    leaderboard = []

    for rank, u in enumerate(users, start=1):
        leaderboard.append(
            LeaderboardEntry(
                rank=rank,
                user_id=u.id,
                username=u.username,
                xp=u.xp,
                is_current_user=(u.id == current_user_id),
            )
        )
    return leaderboard


def refill_hearts(db: Session, user_id: int) -> HeartsRefillResponse:
    """Restores user hearts back to 5 maximum."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = get_default_user(db)

    user.hearts = 5
    db.commit()
    db.refresh(user)

    return HeartsRefillResponse(
        success=True,
        hearts=user.hearts,
        message="Hearts refilled to 5 successfully."
    )


def check_streak(db: Session, user_id: int) -> StreakCheckResponse:
    """Checks and updates user streak based on activity dates."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = get_default_user(db)

    updated = update_user_streak(user)
    if updated:
        db.commit()
        db.refresh(user)

    last_act_str = user.last_activity_date.isoformat() if user.last_activity_date else None

    return StreakCheckResponse(
        current_streak=user.streak,
        longest_streak=user.longest_streak,
        last_activity_date=last_act_str,
        updated=updated,
    )
