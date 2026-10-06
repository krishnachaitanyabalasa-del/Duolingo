from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String, nullable=True)
    target_value = Column(Integer, nullable=False)
    reward_xp = Column(Integer, default=0, nullable=False, server_default="0")
    reward_gems = Column(Integer, default=0, nullable=False, server_default="0")

    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    __table_args__ = (UniqueConstraint("user_id", "achievement_id", name="uq_user_achievement"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    progress = Column(Integer, default=0, nullable=False)
    is_unlocked = Column(Boolean, default=False, nullable=False)
    unlocked_at = Column(DateTime, nullable=True)
    # Reward is granted exactly once; flipped atomically together with the grant.
    reward_awarded = Column(Boolean, default=False, nullable=False, server_default="0")
    reward_awarded_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
