from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class UserUnitProgress(Base):
    __tablename__ = "user_unit_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "unit_id", name="uq_user_unit_progress"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    status = Column(String, default="LOCKED", nullable=False)  # LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED
    progress_percentage = Column(Float, default=0.0, nullable=False)
    unlocked_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="unit_progress")
    unit = relationship("Unit", back_populates="user_progress")


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "skill_id", name="uq_user_skill_progress"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    status = Column(String, default="LOCKED", nullable=False)  # LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED
    crown_level = Column(Integer, default=0, nullable=False)
    progress_percentage = Column(Float, default=0.0, nullable=False)
    unlocked_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="skill_progress")
    skill = relationship("Skill", back_populates="user_progress")


class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "lesson_id", name="uq_user_lesson_progress"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    status = Column(String, default="LOCKED", nullable=False)  # LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED
    is_completed = Column(Boolean, default=False, nullable=False)
    score = Column(Integer, default=0, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    attempts_count = Column(Integer, default=0, nullable=False)

    # Relationships
    user = relationship("User", back_populates="lesson_progress")
    lesson = relationship("Lesson", back_populates="user_progress")

    @property
    def completed(self) -> bool:
        return self.is_completed

    @completed.setter
    def completed(self, value: bool):
        self.is_completed = value


class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    status = Column(String, default="IN_PROGRESS", nullable=False)  # IN_PROGRESS, COMPLETED, FAILED
    score = Column(Integer, default=0, nullable=False)
    xp_earned = Column(Integer, default=0, nullable=False)
    hearts_spent = Column(Integer, default=0, nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="lesson_attempts")
    lesson = relationship("Lesson", back_populates="attempts")


class UserTestAttempt(Base):
    __tablename__ = "user_test_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("unit_tests.id"), nullable=False)
    score = Column(Integer, default=0, nullable=False)
    total_questions = Column(Integer, default=10, nullable=False)
    percentage = Column(Float, default=0.0, nullable=False)
    passed = Column(Boolean, default=False, nullable=False)
    xp_earned = Column(Integer, default=0, nullable=False)
    attempted_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="test_attempts")
    test = relationship("UnitTest", back_populates="user_attempts")

