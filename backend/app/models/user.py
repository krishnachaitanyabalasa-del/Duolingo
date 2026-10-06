from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True, nullable=True)
    username = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=True)
    avatar_id = Column(String, default="avatar_01", nullable=True)
    bio = Column(String, nullable=True)
    joined_date = Column(String, default="Joined April 2025", nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)
    xp = Column(Integer, default=0, nullable=False)
    streak = Column(Integer, default=0, nullable=False)
    longest_streak = Column(Integer, default=0, nullable=False)
    hearts = Column(Integer, default=5, nullable=False)
    gems = Column(Integer, default=100, nullable=False)
    league = Column(String, default="Amethyst", nullable=True)
    top_three_finishes = Column(Integer, default=7, nullable=True)
    following_count = Column(Integer, default=0, nullable=False)
    followers_count = Column(Integer, default=1, nullable=False)
    last_activity_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    unit_progress = relationship("UserUnitProgress", back_populates="user", cascade="all, delete-orphan")
    skill_progress = relationship("UserSkillProgress", back_populates="user", cascade="all, delete-orphan")
    lesson_progress = relationship("UserLessonProgress", back_populates="user", cascade="all, delete-orphan")
    lesson_attempts = relationship("LessonAttempt", back_populates="user", cascade="all, delete-orphan")
    test_attempts = relationship("UserTestAttempt", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    sound_progress = relationship("UserSoundProgress", back_populates="user", cascade="all, delete-orphan")
