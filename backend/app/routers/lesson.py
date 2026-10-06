from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.auth import get_current_user
from app.schemas.lesson import (
    LessonStartResponse,
    AnswerSubmission,
    AnswerResponse,
    LessonCompleteResponse,
)
from app.services.lesson_service import (
    start_lesson,
    validate_and_submit_answer,
    complete_lesson,
)

router = APIRouter(prefix="/lessons", tags=["Lesson Workflow"])


@router.post("/{lesson_id}/start", response_model=LessonStartResponse, summary="Start a lesson session")
def api_start_lesson(lesson_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Starts a lesson attempt session for the authenticated learner. Validates heart count > 0."""
    return start_lesson(db, lesson_id, current_user.id)


@router.post("/{lesson_id}/answer", response_model=AnswerResponse, summary="Submit exercise answer")
def api_submit_answer(
    lesson_id: int,
    submission: AnswerSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Validates a submitted exercise answer server-side.
    Deducts 1 heart if incorrect. Awards +1 XP if correct.
    """
    return validate_and_submit_answer(
        db,
        lesson_id=lesson_id,
        exercise_id=submission.exercise_id,
        answer=submission.answer,
        user_id=current_user.id,
    )


@router.post("/{lesson_id}/complete", response_model=LessonCompleteResponse, summary="Complete a lesson")
def api_complete_lesson(lesson_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Finalizes a lesson completion. Awards +10 completion XP bonus, 
    updates skill progress %, unlocks next skill if complete, and updates daily streak.
    """
    return complete_lesson(db, lesson_id, current_user.id)
