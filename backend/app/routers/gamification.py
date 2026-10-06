from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.auth import get_current_user
from app.schemas.gamification import (
    LeaderboardEntry,
    HeartsRefillResponse,
    StreakCheckResponse,
    UserStatsSummary,
)
from app.services.gamification_service import get_leaderboard, refill_hearts, check_streak

router = APIRouter(tags=["Gamification"])


@router.get("/stats", response_model=UserStatsSummary, summary="Get summary gamification stats")
def read_gamification_stats(current_user: User = Depends(get_current_user)):
    """Retrieves quick summary stats (XP, streak, hearts, gems)."""
    return UserStatsSummary(
        xp=current_user.xp,
        streak=current_user.streak,
        longest_streak=current_user.longest_streak,
        hearts=current_user.hearts,
        gems=current_user.gems,
    )


@router.get("/leaderboard", response_model=list[LeaderboardEntry], summary="Get XP leaderboard")
def read_leaderboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieves current XP leaderboard sorted by rank, highlighting the current learner."""
    return get_leaderboard(db, current_user.id)


@router.post("/hearts/refill", response_model=HeartsRefillResponse, summary="Refill hearts")
def api_refill_hearts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Restores learner hearts to maximum (5)."""
    return refill_hearts(db, current_user.id)


@router.post("/streak/check", response_model=StreakCheckResponse, summary="Check and update daily streak")
def api_check_streak(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Triggers calculation of learner daily activity streak."""
    return check_streak(db, current_user.id)
