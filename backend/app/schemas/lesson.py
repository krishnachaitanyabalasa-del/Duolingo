from typing import Optional, Any
from pydantic import BaseModel, ConfigDict
from app.schemas.course import ExerciseRead


class LessonDetail(BaseModel):
    id: int
    skill_id: int
    title: str
    order: int
    xp_reward: int
    exercises: list[ExerciseRead] = []

    model_config = ConfigDict(from_attributes=True)


class LessonStartResponse(BaseModel):
    attempt_id: int
    lesson: LessonDetail
    user_hearts: int


class AnswerSubmission(BaseModel):
    exercise_id: int
    answer: Any  # String answer, or list/dict of pairs for match pairs


class AnswerResponse(BaseModel):
    correct: bool
    correct_answer: Any
    explanation: Optional[str] = None
    hearts: int
    xp_earned: int


class LessonCompleteResponse(BaseModel):
    completed: bool
    xp_awarded: int
    total_xp: int
    skill_completed: bool
    next_skill_unlocked: Optional[dict] = None
    current_streak: int
