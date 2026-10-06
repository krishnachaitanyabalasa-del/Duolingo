from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict


class ExerciseRead(BaseModel):
    id: int
    lesson_id: int
    type: str  # MULTIPLE_CHOICE, TRANSLATE, MATCH_PAIRS, FILL_BLANK, TYPE_ANSWER
    prompt: str
    content: Any  # JSON content: options, pairs, hint, etc.
    correct_answer: Any
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


class UnitTestInfo(BaseModel):
    id: int
    name: str
    status: str = "LOCKED"  # LOCKED, AVAILABLE, PASSED, FAILED
    locked: bool = True

    model_config = ConfigDict(from_attributes=True)


class UnitRead(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str] = None
    order: int
    status: str = "LOCKED"  # LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED
    progress_percentage: float = 0.0
    skills: list[SkillRead] = []
    test: Optional[UnitTestInfo] = None

    model_config = ConfigDict(from_attributes=True)


class CourseRead(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    language_code: str
    icon: Optional[str] = None
    units: list[UnitRead] = []

    model_config = ConfigDict(from_attributes=True)


class TestQuestionRead(BaseModel):
    id: int
    type: str  # MULTIPLE_CHOICE, TRANSLATE, MATCH_PAIRS, FILL_BLANK, TYPE_ANSWER
    question: str
    options: Optional[list[str]] = None
    word_bank: Optional[list[str]] = None
    pairs: Optional[list[dict]] = None
    sentence_prefix: Optional[str] = None
    sentence_suffix: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UnitTestDetail(BaseModel):
    id: int
    unit_id: int
    name: str
    questions: list[TestQuestionRead] = []

    model_config = ConfigDict(from_attributes=True)


class TestAnswerSubmission(BaseModel):
    question_id: int
    answer: Any


class TestSubmitRequest(BaseModel):
    answers: list[TestAnswerSubmission]


class TestSubmitResponse(BaseModel):
    test_id: int
    score: int
    total: int
    percentage: float
    passed: bool
    xp_earned: int = 0
    next_unit_unlocked: Optional[int] = None


class CoursePathCourse(BaseModel):
    id: int
    name: str


class CoursePathSkill(BaseModel):
    id: int
    name: str
    status: str = "LOCKED"
    progress_percent: float = 0.0
    lessons: list[LessonSummary] = []


class CoursePathUnit(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    status: str = "LOCKED"  # LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED
    progress_percent: float = 0.0
    skills: list[CoursePathSkill] = []
    test: Optional[UnitTestInfo] = None


class CoursePathResponse(BaseModel):
    course: CoursePathCourse
    units: list[CoursePathUnit]

