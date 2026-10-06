from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    username: str
    email: Optional[str] = None


class UserRead(UserBase):
    id: int
    display_name: Optional[str] = None
    avatar_id: Optional[str] = "avatar_01"
    bio: Optional[str] = None
    joined_date: Optional[str] = "Joined April 2025"
    xp: int
    streak: int
    longest_streak: int
    hearts: int
    gems: int
    league: Optional[str] = "Bronze"
    top_three_finishes: Optional[int] = 0
    following_count: int = 0
    followers_count: int = 0
    last_activity_date: Optional[date] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProfileStats(BaseModel):
    streak: int
    total_xp: int
    league: str
    top_three_finishes: int
    gems: int
    hearts: int
    lessons_completed: int = 0
    skills_completed: int = 0
    words_learned: int = 0


class UserCourse(BaseModel):
    id: str
    name: str
    flag: str


class ProfileRead(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_id: str
    bio: str
    joined_date: str
    following_count: int
    followers_count: int
    stats: ProfileStats
    courses: List[UserCourse]

    model_config = ConfigDict(from_attributes=True)


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    username: Optional[str] = None
    bio: Optional[str] = None
    avatar_id: Optional[str] = None


class FollowerUser(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_id: str
    xp: int
    is_following: bool = False


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
