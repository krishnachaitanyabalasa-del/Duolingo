from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.course import Course, Skill, Lesson
from app.models.progress import UserSkillProgress, UserLessonProgress
from app.schemas.progress import UserProgressSummary, SkillProgressRead
from app.services.user_service import get_default_user


def get_user_skills_progress(db: Session, user_id: int) -> list[SkillProgressRead]:
    """Returns progress details for all skills for a user."""
    skills = db.query(Skill).order_by(Skill.order.asc()).all()
    user_skill_progresses = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user_id)
        .all()
    )
    sp_map = {sp.skill_id: sp for sp in user_skill_progresses}

    result = []
    for skill in skills:
        sp = sp_map.get(skill.id)
        status_str = sp.status if sp else "LOCKED"
        crown_level = sp.crown_level if sp else 0
        progress_pct = sp.progress_percentage if sp else 0.0

        all_lessons = db.query(Lesson).filter(Lesson.skill_id == skill.id).all()
        completed_lessons = (
            db.query(UserLessonProgress)
            .filter(
                UserLessonProgress.user_id == user_id,
                UserLessonProgress.lesson_id.in_([l.id for l in all_lessons]),
                UserLessonProgress.is_completed == True
            )
            .count()
        )

        result.append(
            SkillProgressRead(
                skill_id=skill.id,
                skill_title=skill.title,
                unit_id=skill.unit_id,
                status=status_str,
                crown_level=crown_level,
                progress_percentage=progress_pct,
                total_lessons=len(all_lessons),
                completed_lessons=completed_lessons,
            )
        )
    return result


def get_user_progress_summary(db: Session, user_id: int) -> UserProgressSummary:
    """Returns overall user progress summary."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = get_default_user(db)

    course = db.query(Course).first()
    course_id = course.id if course else 1
    course_title = course.title if course else "English"

    skills_prog = get_user_skills_progress(db, user.id)

    return UserProgressSummary(
        user_id=user.id,
        course_id=course_id,
        course_title=course_title,
        total_xp=user.xp,
        streak=user.streak,
        hearts=user.hearts,
        gems=user.gems,
        skills_progress=skills_prog,
    )
