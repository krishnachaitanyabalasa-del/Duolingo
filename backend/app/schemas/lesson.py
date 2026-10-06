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
    lesson_id: int
    status: str = "COMPLETED"
    completed: bool = True
    xp_earned: int = 10
    xp_awarded: int = 10
    total_xp: int
    next_lesson_id: Optional[int] = None
    next_lesson_unlocked: bool = False
    skill_completed: bool = False
    next_skill_unlocked: Optional[dict] = None
    current_streak: int = 1
    accuracy: Optional[float] = None
    session_xp: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

