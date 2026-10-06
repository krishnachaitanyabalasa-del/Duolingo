from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    username: str
    email: Optional[str] = None


class UserRead(UserBase):
    id: int
    xp: int
    streak: int
    longest_streak: int
    hearts: int
    gems: int
    last_activity_date: Optional[date] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserStats(BaseModel):
    user_id: int
    username: str
    xp: int
    streak: int
    longest_streak: int
    hearts: int
    gems: int
    skills_completed: int
    crowns_earned: int
    lessons_completed: int

    model_config = ConfigDict(from_attributes=True)
