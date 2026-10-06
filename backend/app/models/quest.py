from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from app.database import Base


class UserDailyActivity(Base):
    """
    Per-user, per-day aggregate of real learning activity.

    This is the single backend-owned source used to compute daily quest progress,
    so the client can never submit arbitrary progress values.
    """

    __tablename__ = "user_daily_activity"
    __table_args__ = (UniqueConstraint("user_id", "activity_date", name="uq_user_activity_date"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    activity_date = Column(Date, nullable=False, index=True)
    xp_earned = Column(Integer, default=0, nullable=False)
    lessons_completed = Column(Integer, default=0, nullable=False)
    tests_passed = Column(Integer, default=0, nullable=False)
    correct_answers = Column(Integer, default=0, nullable=False)
    total_answers = Column(Integer, default=0, nullable=False)
    practice_sessions = Column(Integer, default=0, nullable=False)

    user = relationship("User", back_populates="daily_activity")


class DailyQuest(Base):
    """A quest generated once per user per calendar day (lazy, date-based)."""

    __tablename__ = "daily_quests"
    __table_args__ = (UniqueConstraint("user_id", "quest_date", "type", name="uq_user_quest_date_type"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    quest_date = Column(Date, nullable=False, index=True)
    type = Column(String, nullable=False)  # EARN_XP, COMPLETE_LESSONS, ACCURACY, PRACTICE
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    target = Column(Integer, nullable=False)
    current_progress = Column(Integer, default=0, nullable=False)
    reward_xp = Column(Integer, default=0, nullable=False)
    reward_gems = Column(Integer, default=0, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    claimed = Column(Boolean, default=False, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    claimed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="daily_quests")
