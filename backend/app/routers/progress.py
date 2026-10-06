from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas.progress import UserProgressSummary, SkillProgressRead
from app.services.progress_service import get_user_progress_summary, get_user_skills_progress

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("", response_model=UserProgressSummary, summary="Get overall learner progress")
def read_progress_summary(db: Session = Depends(get_db)):
    """Retrieves overall learner progress summary across all skills and metrics."""
    return get_user_progress_summary(db, settings.DEFAULT_USER_ID)


@router.get("/skills", response_model=list[SkillProgressRead], summary="Get skills progress breakdown")
def read_skills_progress(db: Session = Depends(get_db)):
    """Retrieves progress breakdown for every skill (LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED)."""
    return get_user_skills_progress(db, settings.DEFAULT_USER_ID)
