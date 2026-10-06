from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class SoundCategory(Base):
    __tablename__ = "sound_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    sounds = relationship("Sound", back_populates="category", order_by="Sound.display_order", cascade="all, delete-orphan")


class Sound(Base):
    __tablename__ = "sounds"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("sound_categories.id"), nullable=False)
    symbol = Column(String, nullable=False)
    example_word = Column(String, nullable=False)
    example_translation = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    audio_text = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    category = relationship("SoundCategory", back_populates="sounds")
    user_progress = relationship("UserSoundProgress", back_populates="sound", cascade="all, delete-orphan")


class UserSoundProgress(Base):
    __tablename__ = "user_sound_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "sound_id", name="uq_user_sound"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sound_id = Column(Integer, ForeignKey("sounds.id"), nullable=False)
    practice_count = Column(Integer, default=0, nullable=False)
    correct_count = Column(Integer, default=0, nullable=False)
    incorrect_count = Column(Integer, default=0, nullable=False)
    progress_percent = Column(Integer, default=0, nullable=False)
    last_practiced_at = Column(DateTime, nullable=True)
    mastered = Column(Boolean, default=False, nullable=False)

    # Relationships
    user = relationship("User", back_populates="sound_progress")
    sound = relationship("Sound", back_populates="user_progress")
