from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas.gamification import (
    LeaderboardEntry,
    HeartsRefillResponse,
    StreakCheckResponse,
    UserStatsSummary,
)
from app.services.gamification_service import get_leaderboard, refill_hearts, check_streak
from app.services.user_service import get_default_user

router = APIRouter(tags=["Gamification"])


@router.get("/stats", response_model=UserStatsSummary, summary="Get summary gamification stats")
def read_gamification_stats(db: Session = Depends(get_db)):
    """Retrieves quick summary stats (XP, streak, hearts, gems)."""
    user = get_default_user(db)
    return UserStatsSummary(
        xp=user.xp,
        streak=user.streak,
        longest_streak=user.longest_streak,
        hearts=user.hearts,
        gems=user.gems,
    )


@router.get("/leaderboard", response_model=list[LeaderboardEntry], summary="Get XP leaderboard")
def read_leaderboard(db: Session = Depends(get_db)):
    """Retrieves current XP leaderboard sorted by rank, highlighting the current learner."""
    return get_leaderboard(db, settings.DEFAULT_USER_ID)


@router.post("/hearts/refill", response_model=HeartsRefillResponse, summary="Refill hearts")
def api_refill_hearts(db: Session = Depends(get_db)):
    """Restores learner hearts to maximum (5)."""
    return refill_hearts(db, settings.DEFAULT_USER_ID)


@router.post("/streak/check", response_model=StreakCheckResponse, summary="Check and update daily streak")
def api_check_streak(db: Session = Depends(get_db)):
    """Triggers calculation of learner daily activity streak."""
    return check_streak(db, settings.DEFAULT_USER_ID)
