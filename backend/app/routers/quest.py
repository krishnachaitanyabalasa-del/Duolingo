from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.auth import get_current_user
from app.schemas.quest import DailyQuestRead, QuestClaimResponse
from app.services.quest_service import get_user_quests_read, claim_quest_reward

router = APIRouter(prefix="/daily-quests", tags=["Daily Quests"])


@router.get("", response_model=List[DailyQuestRead], summary="Get today's daily quests")
def get_daily_quests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves or lazily provisions the authenticated learner's daily quests for today."""
    return get_user_quests_read(db, current_user)


@router.post("/{quest_id}/claim", response_model=QuestClaimResponse, summary="Claim a completed daily quest reward")
def claim_quest(
    quest_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Claims the gem/XP reward for a completed daily quest."""
    return claim_quest_reward(db, current_user, quest_id)
