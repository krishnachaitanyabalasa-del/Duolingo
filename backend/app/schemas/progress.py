from typing import Optional
from pydantic import BaseModel, ConfigDict


class SkillProgressRead(BaseModel):
    skill_id: int
    skill_title: str
    unit_id: int
    status: str  # LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED
    crown_level: int
    progress_percentage: float
    total_lessons: int
    completed_lessons: int

    model_config = ConfigDict(from_attributes=True)


class UserProgressSummary(BaseModel):
    user_id: int
    course_id: int
    course_title: str
    total_xp: int
    streak: int
    hearts: int
    gems: int
    skills_progress: list[SkillProgressRead] = []
