from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.config import settings
from app.models.user import User
from app.models.progress import UserSkillProgress, UserLessonProgress
from app.schemas.user import UserStats


def get_default_user(db: Session) -> User:
    """Fetches the default learner user."""
    user = db.query(User).filter(User.id == settings.DEFAULT_USER_ID).first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learner user not found. Please seed the database."
        )
    return user


def get_user_stats(db: Session, user_id: int) -> UserStats:
    """Computes aggregate stats for a learner."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found."
        )

    # Count completed skills
    skills_completed = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user_id, UserSkillProgress.status == "COMPLETED")
        .count()
    )

    # Sum total crowns earned
    skill_progresses = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user_id)
        .all()
    )
    crowns_earned = sum(sp.crown_level for sp in skill_progresses)

    # Count completed lessons
    lessons_completed = (
        db.query(UserLessonProgress)
        .filter(UserLessonProgress.user_id == user_id, UserLessonProgress.is_completed == True)
        .count()
    )

    return UserStats(
        user_id=user.id,
        username=user.username,
        xp=user.xp,
        streak=user.streak,
        longest_streak=user.longest_streak,
        hearts=user.hearts,
        gems=user.gems,
        skills_completed=skills_completed,
        crowns_earned=crowns_earned,
        lessons_completed=lessons_completed,
    )
