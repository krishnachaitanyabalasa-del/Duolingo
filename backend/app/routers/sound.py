from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas.sound import (
    SoundsOverviewResponse,
    SoundDetailResponse,
    PracticeSoundRequest,
    PracticeSoundResponse,
)
from app.services.sound_service import (
    get_sounds_overview,
    get_sound_detail,
    practice_sound,
)

router = APIRouter(prefix="/sounds", tags=["Sounds & Pronunciation"])


@router.get("", response_model=SoundsOverviewResponse, summary="Get all pronunciation sounds")
def read_sounds_overview(db: Session = Depends(get_db)):
    """Retrieves all active pronunciation sounds grouped into Vowels and Consonants with the learner's progress."""
    return get_sounds_overview(db, settings.DEFAULT_USER_ID)


@router.get("/{sound_id}", response_model=SoundDetailResponse, summary="Get single sound detail and progress")
def read_sound_detail(sound_id: int, db: Session = Depends(get_db)):
    """Retrieves details and practice statistics for a specific pronunciation sound."""
    return get_sound_detail(db, sound_id, settings.DEFAULT_USER_ID)


@router.post("/{sound_id}/practice", response_model=PracticeSoundResponse, summary="Record sound practice result")
def api_practice_sound(
    sound_id: int,
    request: PracticeSoundRequest = PracticeSoundRequest(),
    db: Session = Depends(get_db),
):
    """
    Records a practice attempt for a sound.
    Increments practice count, calculates progress percentage (5 correct = 100%), and updates mastered state.
    """
    return practice_sound(
        db,
        sound_id=sound_id,
        user_id=settings.DEFAULT_USER_ID,
        correct=request.correct,
    )
