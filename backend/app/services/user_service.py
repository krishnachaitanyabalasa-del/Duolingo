from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.config import settings
from app.models.user import User
from app.models.progress import UserSkillProgress, UserLessonProgress
from app.models.course import Course
from app.schemas.user import UserStats, ProfileRead, ProfileStats, UserCourse, ProfileUpdate, FollowerUser


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


def get_profile_data(db: Session, user_id: int = settings.DEFAULT_USER_ID) -> ProfileRead:
    """Fetches complete profile dataset for a user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = get_default_user(db)

    skills_completed = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user.id, UserSkillProgress.status == "COMPLETED")
        .count()
    )

    lessons_completed = (
        db.query(UserLessonProgress)
        .filter(UserLessonProgress.user_id == user.id, UserLessonProgress.is_completed == True)
        .count()
    )

    # Fetch available courses
    courses_query = db.query(Course).all()
    courses_list = [
        UserCourse(id="es", name="Spanish", flag="🇪🇸"),
        UserCourse(id="en", name="English", flag="🇺🇸"),
        UserCourse(id="math", name="Math", flag="➗"),
    ]
    if courses_query:
        # Include seeded courses alongside defaults if needed
        seen = {c.flag for c in courses_list}
        for c in courses_query:
            if c.icon not in seen:
                courses_list.append(UserCourse(id=str(c.id), name=c.title, flag=c.icon or "🌐"))

    stats = ProfileStats(
        streak=user.streak,
        total_xp=user.xp,
        league=user.league or "Amethyst",
        top_three_finishes=user.top_three_finishes or 7,
        gems=user.gems,
        hearts=user.hearts,
        lessons_completed=lessons_completed,
        skills_completed=skills_completed,
        words_learned=skills_completed * 25 + 30,
    )

    return ProfileRead(
        id=user.id,
        username="krishnacha97971" if user.username == "learner" else user.username,
        display_name=user.display_name or user.username or "krishnachaitanyabalasa",
        avatar_id=user.avatar_id or "avatar_01",
        bio=user.bio or "Learning languages every day!",
        joined_date=user.joined_date or "Joined April 2025",
        following_count=user.following_count or 0,
        followers_count=user.followers_count or 1,
        stats=stats,
        courses=courses_list,
    )


def update_profile_data(db: Session, update_dto: ProfileUpdate, user_id: int = settings.DEFAULT_USER_ID) -> ProfileRead:
    """Updates user profile information with username uniqueness validation."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = get_default_user(db)

    if update_dto.username and update_dto.username != user.username:
        existing = db.query(User).filter(User.username == update_dto.username, User.id != user.id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username is already taken by another learner."
            )
        user.username = update_dto.username

    if update_dto.display_name is not None:
        user.display_name = update_dto.display_name

    if update_dto.bio is not None:
        user.bio = update_dto.bio

    if update_dto.avatar_id is not None:
        user.avatar_id = update_dto.avatar_id

    db.commit()
    db.refresh(user)

    return get_profile_data(db, user.id)


def get_followers(db: Session, user_id: int = settings.DEFAULT_USER_ID):
    """Returns list of users following this user."""
    other_users = db.query(User).filter(User.id != user_id).all()
    # Return simulated followers list from other leaderboard users
    return [
        FollowerUser(
            id=u.id,
            username=u.username,
            display_name=u.display_name or u.username,
            avatar_id=u.avatar_id or f"avatar_0{(u.id % 8) + 1}",
            xp=u.xp,
            is_following=u.id == 2  # default follow state
        )
        for u in other_users[:3]
    ]


def get_following(db: Session, user_id: int = settings.DEFAULT_USER_ID):
    """Returns list of users this user is following."""
    # If user.following_count > 0, return following list
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.following_count == 0:
        return []

    other_users = db.query(User).filter(User.id != user_id).all()
    return [
        FollowerUser(
            id=u.id,
            username=u.username,
            display_name=u.display_name or u.username,
            avatar_id=u.avatar_id or f"avatar_0{(u.id % 8) + 1}",
            xp=u.xp,
            is_following=True
        )
        for u in other_users[:user.following_count]
    ]


def toggle_follow_user(db: Session, target_user_id: int, current_user_id: int = settings.DEFAULT_USER_ID):
    """Toggles following status of target_user_id."""
    current_user = db.query(User).filter(User.id == current_user_id).first()
    if not current_user:
        current_user = get_default_user(db)

    # Simple toggle logic
    if current_user.following_count > 0:
        current_user.following_count -= 1
        is_following = False
    else:
        current_user.following_count += 1
        is_following = True

    db.commit()
    return {"success": True, "is_following": is_following, "following_count": current_user.following_count}


def get_user_stats(db: Session, user_id: int) -> UserStats:
    """Computes aggregate stats for a learner."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found."
        )

    skills_completed = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user_id, UserSkillProgress.status == "COMPLETED")
        .count()
    )

    skill_progresses = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user_id)
        .all()
    )
    crowns_earned = sum(sp.crown_level for sp in skill_progresses)

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
