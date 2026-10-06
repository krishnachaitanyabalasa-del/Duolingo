from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas.user import UserRead, UserStats
from app.services.user_service import get_default_user, get_user_stats

router = APIRouter(prefix="/user", tags=["User"])


@router.get("", response_model=UserRead, summary="Get default learner profile")
def read_current_user(db: Session = Depends(get_db)):
    """Retrieves profile information for the default logged-in learner."""
    return get_default_user(db)


@router.get("/stats", response_model=UserStats, summary="Get detailed user stats")
def read_current_user_stats(db: Session = Depends(get_db)):
    """Retrieves aggregate learning statistics including crowns earned, skills completed, and lessons finished."""
    return get_user_stats(db, settings.DEFAULT_USER_ID)
