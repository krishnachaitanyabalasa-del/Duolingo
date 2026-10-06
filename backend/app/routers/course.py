from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas.course import CourseRead, UnitRead, SkillRead, LessonDetail
from app.services.course_service import (
    get_active_course,
    get_all_courses,
    get_units_by_course,
    get_skill_detail,
    get_lesson_detail,
)

router = APIRouter(tags=["Course & Content"])


@router.get("/course", response_model=CourseRead, summary="Get active course with learner progress")
def read_active_course(db: Session = Depends(get_db)):
    """Retrieves the active language course with full unit hierarchy, skill statuses, and lesson states."""
    return get_active_course(db, settings.DEFAULT_USER_ID)


@router.get("/courses", response_model=list[CourseRead], summary="Get all available courses")
def read_all_courses(db: Session = Depends(get_db)):
    """Retrieves all available courses in the platform."""
    return get_all_courses(db)


@router.get("/units", response_model=list[UnitRead], summary="Get units for current course")
def read_units(db: Session = Depends(get_db)):
    """Retrieves units for the active course."""
    return get_units_by_course(db, 1, settings.DEFAULT_USER_ID)


@router.get("/skills/{skill_id}", response_model=SkillRead, summary="Get skill details and lessons")
def read_skill(skill_id: int, db: Session = Depends(get_db)):
    """Retrieves details of a specific skill including learner status, crown level, and lessons."""
    return get_skill_detail(db, skill_id, settings.DEFAULT_USER_ID)


@router.get("/lessons/{lesson_id}", response_model=LessonDetail, summary="Get lesson details and exercises")
def read_lesson(lesson_id: int, db: Session = Depends(get_db)):
    """Retrieves details of a specific lesson along with its exercises."""
    return get_lesson_detail(db, lesson_id, settings.DEFAULT_USER_ID)
