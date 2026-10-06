from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, Text, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    language_code = Column(String, default="en", nullable=False)
    icon = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    units = relationship("Unit", back_populates="course", order_by="Unit.order", cascade="all, delete-orphan")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", order_by="Skill.order", cascade="all, delete-orphan")
    test = relationship("UnitTest", back_populates="unit", uselist=False, cascade="all, delete-orphan")
    user_progress = relationship("UserUnitProgress", back_populates="unit", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)
    order = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", order_by="Lesson.order", cascade="all, delete-orphan")
    user_progress = relationship("UserSkillProgress", back_populates="skill", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    xp_reward = Column(Integer, default=10, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", order_by="Exercise.order", cascade="all, delete-orphan")
    attempts = relationship("LessonAttempt", back_populates="lesson", cascade="all, delete-orphan")
    user_progress = relationship("UserLessonProgress", back_populates="lesson", cascade="all, delete-orphan")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    type = Column(String, nullable=False)  # MULTIPLE_CHOICE, TRANSLATE, MATCH_PAIRS, FILL_BLANK, TYPE_ANSWER
    prompt = Column(String, nullable=False)
    content = Column(JSON, nullable=False)  # Options, pairs, hint, context text, etc.
    correct_answer = Column(JSON, nullable=False)  # String or JSON structure for match pairs
    explanation = Column(Text, nullable=True)
    order = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    lesson = relationship("Lesson", back_populates="exercises")


class UnitTest(Base):
    __tablename__ = "unit_tests"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False, unique=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    passing_score_percentage = Column(Float, default=80.0, nullable=False)
    xp_reward = Column(Integer, default=50, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    unit = relationship("Unit", back_populates="test")
    exercises = relationship("TestExercise", back_populates="test", order_by="TestExercise.order", cascade="all, delete-orphan")
    user_attempts = relationship("UserTestAttempt", back_populates="test", cascade="all, delete-orphan")


class TestExercise(Base):
    __tablename__ = "test_exercises"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("unit_tests.id"), nullable=False)
    type = Column(String, nullable=False)  # MULTIPLE_CHOICE, TRANSLATE, MATCH_PAIRS, FILL_BLANK, TYPE_ANSWER
    prompt = Column(String, nullable=False)
    content = Column(JSON, nullable=False)
    correct_answer = Column(JSON, nullable=False)
    explanation = Column(Text, nullable=True)
    order = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    test = relationship("UnitTest", back_populates="exercises")

