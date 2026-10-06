from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class DailyQuestRead(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    description: str
    icon: Optional[str] = None
    target: int
    current_progress: int
    reward_xp: int = 0
    reward_gems: int = 0
    completed: bool
    claimed: bool
    state: str  # "IN_PROGRESS", "COMPLETED", "CLAIMED"
    quest_date: date
    completed_at: Optional[datetime] = None
    claimed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class QuestClaimResponse(BaseModel):
    success: bool
    claimed: bool
    quest_id: int
    reward_gems: int
    reward_xp: int
    total_gems: int
    total_xp: int
    message: str = "Reward claimed successfully."
