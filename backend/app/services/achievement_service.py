from datetime import datetime
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.achievement import Achievement, UserAchievement
from app.models.progress import UserLessonProgress
from app.schemas.achievement import UserAchievementRead, AchievementRead


def check_user_achievements(db: Session, user: User) -> list[UserAchievement]:
    """
    Evaluates all achievements against current user stats and updates user achievement progress/unlock status.
    """
    achievements = db.query(Achievement).all()
    updated_records = []

    # Calculate metrics
    lessons_completed_count = (
        db.query(UserLessonProgress)
        .filter(UserLessonProgress.user_id == user.id, UserLessonProgress.is_completed == True)
        .count()
    )

    for ach in achievements:
        user_ach = (
            db.query(UserAchievement)
            .filter(UserAchievement.user_id == user.id, UserAchievement.achievement_id == ach.id)
            .first()
        )

        if not user_ach:
            user_ach = UserAchievement(
                user_id=user.id,
                achievement_id=ach.id,
                progress=0,
                is_unlocked=False,
            )
            db.add(user_ach)

        # Compute progress based on achievement code
        current_val = 0
        if ach.code == "wildfire":
            current_val = user.streak
        elif ach.code == "overachiever" or ach.code == "champion":
            current_val = user.xp
        elif ach.code == "scholar":
            current_val = lessons_completed_count
        elif ach.code == "sharp_mind":
            current_val = 1 if user.hearts == 5 else user_ach.progress

        user_ach.progress = min(current_val, ach.target_value)

        if not user_ach.is_unlocked and user_ach.progress >= ach.target_value:
            user_ach.is_unlocked = True
            user_ach.unlocked_at = datetime.utcnow()

        updated_records.append(user_ach)

    db.commit()
    return updated_records


def get_user_achievements(db: Session, user_id: int) -> list[UserAchievementRead]:
    """Retrieves list of achievements for the user formatted with schemas."""
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        check_user_achievements(db, user)

    user_achievements = (
        db.query(UserAchievement)
        .filter(UserAchievement.user_id == user_id)
        .all()
    )

    result = []
    for ua in user_achievements:
        ach_read = AchievementRead(
            id=ua.achievement.id,
            code=ua.achievement.code,
            title=ua.achievement.title,
            description=ua.achievement.description,
            icon=ua.achievement.icon,
            target_value=ua.achievement.target_value,
        )
        result.append(
            UserAchievementRead(
                id=ua.id,
                achievement=ach_read,
                progress=ua.progress,
                target_value=ua.achievement.target_value,
                is_unlocked=ua.is_unlocked,
                unlocked_at=ua.unlocked_at,
            )
        )
    return result
