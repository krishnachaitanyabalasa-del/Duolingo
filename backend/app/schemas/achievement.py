from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class AchievementRead(BaseModel):
    id: int
    code: str
    title: str
    description: str
    icon: Optional[str] = None
    target_value: int

    model_config = ConfigDict(from_attributes=True)


class UserAchievementRead(BaseModel):
    id: int
    achievement: AchievementRead
    progress: int
    target_value: int
    is_unlocked: bool
    unlocked_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
