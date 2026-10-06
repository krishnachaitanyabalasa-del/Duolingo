from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.auth import get_current_user
from app.schemas.user import UserRead, UserStats
from app.services.user_service import get_user_stats

router = APIRouter(prefix="/user", tags=["User"])


@router.get("", response_model=UserRead, summary="Get current authenticated learner profile")
def read_current_user(current_user: User = Depends(get_current_user)):
    """Retrieves profile information for the authenticated learner."""
    return current_user


@router.get("/stats", response_model=UserStats, summary="Get detailed user stats")
def read_current_user_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieves aggregate learning statistics for the current user."""
    return get_user_stats(db, current_user.id)
