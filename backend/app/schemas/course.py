from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict


class ExerciseRead(BaseModel):
    id: int
    lesson_id: int
    type: str  # MULTIPLE_CHOICE, TRANSLATE, MATCH_PAIRS, FILL_BLANK, TYPE_ANSWER
    prompt: str
    content: Any  # JSON content: options, pairs, hint, etc.
    explanation: Optional[str] = None
    order: int

    model_config = ConfigDict(from_attributes=True)


class LessonSummary(BaseModel):
    id: int
    skill_id: int
    title: str
    order: int
    xp_reward: int
    is_completed: bool = False

    model_config = ConfigDict(from_attributes=True)


class SkillRead(BaseModel):
    id: int
    unit_id: int
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    order: int
    status: str = "LOCKED"  # LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED
    crown_level: int = 0
    progress_percentage: float = 0.0
    lessons: list[LessonSummary] = []

    model_config = ConfigDict(from_attributes=True)


class UnitRead(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str] = None
    order: int
    skills: list[SkillRead] = []

    model_config = ConfigDict(from_attributes=True)


class CourseRead(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    language_code: str
    icon: Optional[str] = None
    units: list[UnitRead] = []

    model_config = ConfigDict(from_attributes=True)
