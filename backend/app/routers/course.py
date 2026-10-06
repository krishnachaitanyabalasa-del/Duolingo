from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.auth import get_current_user
from app.schemas.course import (
    CourseRead,
    UnitRead,
    SkillRead,
    CoursePathResponse,
    UnitTestDetail,
    TestSubmitRequest,
    TestSubmitResponse,
)
from app.schemas.lesson import LessonDetail
from app.services.course_service import (
    get_active_course,
    get_all_courses,
    get_units_by_course,
    get_skill_detail,
    get_lesson_detail,
    get_course_path,
    get_unit_test,
    submit_unit_test,
)

router = APIRouter(tags=["Course & Content"])


@router.get("/course", response_model=CourseRead, summary="Get active course with learner progress")
def read_active_course(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieves active language course with full unit hierarchy, skill statuses, and lesson states."""
    return get_active_course(db, current_user.id)


@router.get("/course/path", response_model=CoursePathResponse, summary="Get full learning path for current user")
def read_course_path(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieves real persistent 10-unit learning progression for the authenticated user."""
    return get_course_path(db, current_user)


@router.get("/courses", response_model=list[CourseRead], summary="Get all available courses")
def read_all_courses(db: Session = Depends(get_db)):
    """Retrieves all available courses in the platform."""
    return get_all_courses(db)


@router.get("/units", response_model=list[UnitRead], summary="Get units for current course")
def read_units(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieves units for the active course."""
    return get_units_by_course(db, 1, current_user.id)


@router.get("/skills/{skill_id}", response_model=SkillRead, summary="Get skill details and lessons")
def read_skill(skill_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieves details of a specific skill including learner status, crown level, and lessons."""
    return get_skill_detail(db, skill_id, current_user.id)


@router.get("/lessons/{lesson_id}", response_model=LessonDetail, summary="Get lesson details and exercises")
def read_lesson(lesson_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieves details of a specific lesson along with its exercises."""
    return get_lesson_detail(db, lesson_id, current_user.id)


@router.get("/tests/{test_id}", response_model=UnitTestDetail, summary="Get unit test questions")
def read_unit_test(test_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieves unit test questions without revealing correct answers server-side."""
    return get_unit_test(db, test_id, current_user)


@router.post("/tests/{test_id}/submit", response_model=TestSubmitResponse, summary="Submit unit test answers")
def post_unit_test_submission(
    test_id: int,
    request: TestSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Evaluates unit test submission and unlocks the next unit if passed (>=80%)."""
    return submit_unit_test(db, test_id, request, current_user)
