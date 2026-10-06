from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.course import Course, Unit, Skill, Lesson, Exercise
from app.models.progress import UserSkillProgress, UserLessonProgress
from app.schemas.course import CourseRead, UnitRead, SkillRead, LessonSummary, ExerciseRead, LessonDetail


def get_all_courses(db: Session) -> list[Course]:
    """Retrieves all available courses."""
    return db.query(Course).all()


def get_active_course(db: Session, user_id: int) -> CourseRead:
    """
    Retrieves active course with unit hierarchy, skill statuses, crown levels, 
    and progress percentages customized for the specified learner.
    """
    course = db.query(Course).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No course found. Please seed the database."
        )

    # Build skill progress lookup for the user
    user_skill_progresses = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user_id)
        .all()
    )
    skill_progress_map = {sp.skill_id: sp for sp in user_skill_progresses}

    # Build lesson progress lookup for the user
    user_lesson_progresses = (
        db.query(UserLessonProgress)
        .filter(UserLessonProgress.user_id == user_id)
        .all()
    )
    lesson_progress_map = {lp.lesson_id: lp for lp in user_lesson_progresses}

    unit_reads = []
    for unit in course.units:
        skill_reads = []
        for skill in unit.skills:
            sp = skill_progress_map.get(skill.id)
            skill_status = sp.status if sp else "LOCKED"
            crown_level = sp.crown_level if sp else 0
            progress_pct = sp.progress_percentage if sp else 0.0

            lesson_summaries = []
            for lesson in skill.lessons:
                lp = lesson_progress_map.get(lesson.id)
                is_completed = lp.is_completed if lp else False
                lesson_summaries.append(
                    LessonSummary(
                        id=lesson.id,
                        skill_id=lesson.skill_id,
                        title=lesson.title,
                        order=lesson.order,
                        xp_reward=lesson.xp_reward,
                        is_completed=is_completed,
                    )
                )

            skill_reads.append(
                SkillRead(
                    id=skill.id,
                    unit_id=skill.unit_id,
                    title=skill.title,
                    description=skill.description,
                    icon=skill.icon,
                    order=skill.order,
                    status=skill_status,
                    crown_level=crown_level,
                    progress_percentage=progress_pct,
                    lessons=lesson_summaries,
                )
            )

        unit_reads.append(
            UnitRead(
                id=unit.id,
                course_id=unit.course_id,
                title=unit.title,
                description=unit.description,
                order=unit.order,
                skills=skill_reads,
            )
        )

    return CourseRead(
        id=course.id,
        title=course.title,
        description=course.description,
        language_code=course.language_code,
        icon=course.icon,
        units=unit_reads,
    )


def get_units_by_course(db: Session, course_id: int, user_id: int) -> list[UnitRead]:
    """Retrieves units for a course with skill statuses for user."""
    course_read = get_active_course(db, user_id)
    return course_read.units


def get_skill_detail(db: Session, skill_id: int, user_id: int) -> SkillRead:
    """Retrieves details for a single skill."""
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Skill with id {skill_id} not found."
        )

    sp = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user_id, UserSkillProgress.skill_id == skill_id)
        .first()
    )
    status_str = sp.status if sp else "LOCKED"
    crown_level = sp.crown_level if sp else 0
    progress_pct = sp.progress_percentage if sp else 0.0

    user_lessons = (
        db.query(UserLessonProgress)
        .filter(UserLessonProgress.user_id == user_id)
        .all()
    )
    lesson_map = {lp.lesson_id: lp.is_completed for lp in user_lessons}

    lesson_summaries = [
        LessonSummary(
            id=l.id,
            skill_id=l.skill_id,
            title=l.title,
            order=l.order,
            xp_reward=l.xp_reward,
            is_completed=lesson_map.get(l.id, False),
        )
        for l in skill.lessons
    ]

    return SkillRead(
        id=skill.id,
        unit_id=skill.unit_id,
        title=skill.title,
        description=skill.description,
        icon=skill.icon,
        order=skill.order,
        status=status_str,
        crown_level=crown_level,
        progress_percentage=progress_pct,
        lessons=lesson_summaries,
    )


def get_lesson_detail(db: Session, lesson_id: int, user_id: int) -> LessonDetail:
    """Retrieves lesson details with exercises."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lesson with id {lesson_id} not found."
        )

    exercises_read = [
        ExerciseRead(
            id=ex.id,
            lesson_id=ex.lesson_id,
            type=ex.type,
            prompt=ex.prompt,
            content=ex.content,
            explanation=ex.explanation,
            order=ex.order,
        )
        for ex in lesson.exercises
    ]

    return LessonDetail(
        id=lesson.id,
        skill_id=lesson.skill_id,
        title=lesson.title,
        order=lesson.order,
        xp_reward=lesson.xp_reward,
        exercises=exercises_read,
    )
