from typing import Optional
from pydantic import BaseModel, ConfigDict


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    username: str
    xp: int
    is_current_user: bool = False

    model_config = ConfigDict(from_attributes=True)


class HeartsRefillResponse(BaseModel):
    success: bool
    hearts: int
    message: str


class StreakCheckResponse(BaseModel):
    current_streak: int
    longest_streak: int
    last_activity_date: Optional[str] = None
    updated: bool


class UserStatsSummary(BaseModel):
    xp: int
    streak: int
    longest_streak: int
    hearts: int
    gems: int
