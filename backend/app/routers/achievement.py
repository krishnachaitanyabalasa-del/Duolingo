from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas.achievement import UserAchievementRead
from app.services.achievement_service import get_user_achievements

router = APIRouter(tags=["Achievements"])


@router.get("/achievements", response_model=list[UserAchievementRead], summary="Get user achievements")
def read_achievements(db: Session = Depends(get_db)):
    """Retrieves list of achievements and the learner's unlock progress."""
    return get_user_achievements(db, settings.DEFAULT_USER_ID)
