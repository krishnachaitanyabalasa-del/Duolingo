from typing import Optional
from pydantic import BaseModel, ConfigDict


class SoundRead(BaseModel):
    id: int
    symbol: str
    example_word: str
    example_translation: Optional[str] = None
    audio_text: str
    progress_percent: int = 0
    mastered: bool = False

    model_config = ConfigDict(from_attributes=True)


class SoundCategoryWithSounds(BaseModel):
    id: int
    name: str
    slug: str
    sounds: list[SoundRead] = []

    model_config = ConfigDict(from_attributes=True)


class SoundsOverviewResponse(BaseModel):
    categories: list[SoundCategoryWithSounds] = []


class SoundDetailResponse(BaseModel):
    id: int
    symbol: str
    example_word: str
    example_translation: Optional[str] = None
    category: str
    audio_text: str
    progress_percent: int = 0
    practice_count: int = 0
    correct_count: int = 0
    incorrect_count: int = 0
    mastered: bool = False

    model_config = ConfigDict(from_attributes=True)


class PracticeSoundRequest(BaseModel):
    correct: bool = True


class PracticeSoundResponse(BaseModel):
    sound_id: int
    practice_count: int
    correct_count: int
    incorrect_count: int
    progress_percent: int
    mastered: bool

    model_config = ConfigDict(from_attributes=True)
