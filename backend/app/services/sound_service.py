from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.sound import SoundCategory, Sound, UserSoundProgress
from app.models.user import User
from app.schemas.sound import (
    SoundRead,
    SoundCategoryWithSounds,
    SoundsOverviewResponse,
    SoundDetailResponse,
    PracticeSoundResponse,
)
from app.services.user_service import get_default_user


def get_sounds_overview(db: Session, user_id: int) -> SoundsOverviewResponse:
    """Retrieves all active sounds grouped by category with the learner's progress."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = get_default_user(db)

    categories = (
        db.query(SoundCategory)
        .order_by(SoundCategory.display_order.asc())
        .all()
    )

    # Fetch user's sound progress records as a lookup map
    user_progresses = (
        db.query(UserSoundProgress)
        .filter(UserSoundProgress.user_id == user.id)
        .all()
    )
    progress_map = {p.sound_id: p for p in user_progresses}

    category_responses = []
    for cat in categories:
        sound_reads = []
        for s in cat.sounds:
            if not s.is_active:
                continue
            prog = progress_map.get(s.id)
            progress_pct = prog.progress_percent if prog else 0
            is_mastered = prog.mastered if prog else False

            sound_reads.append(
                SoundRead(
                    id=s.id,
                    symbol=s.symbol,
                    example_word=s.example_word,
                    example_translation=s.example_translation,
                    audio_text=s.audio_text,
                    progress_percent=progress_pct,
                    mastered=is_mastered,
                )
            )

        category_responses.append(
            SoundCategoryWithSounds(
                id=cat.id,
                name=cat.name,
                slug=cat.slug,
                sounds=sound_reads,
            )
        )

    return SoundsOverviewResponse(categories=category_responses)


def get_sound_detail(db: Session, sound_id: int, user_id: int) -> SoundDetailResponse:
    """Retrieves single sound details and learner progress."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = get_default_user(db)

    sound = db.query(Sound).filter(Sound.id == sound_id, Sound.is_active == True).first()
    if not sound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sound with id {sound_id} not found."
        )

    prog = (
        db.query(UserSoundProgress)
        .filter(UserSoundProgress.user_id == user.id, UserSoundProgress.sound_id == sound.id)
        .first()
    )

    return SoundDetailResponse(
        id=sound.id,
        symbol=sound.symbol,
        example_word=sound.example_word,
        example_translation=sound.example_translation,
        category=sound.category.name if sound.category else "General",
        audio_text=sound.audio_text,
        progress_percent=prog.progress_percent if prog else 0,
        practice_count=prog.practice_count if prog else 0,
        correct_count=prog.correct_count if prog else 0,
        incorrect_count=prog.incorrect_count if prog else 0,
        mastered=prog.mastered if prog else False,
    )


def practice_sound(db: Session, sound_id: int, user_id: int, correct: bool) -> PracticeSoundResponse:
    """
    Updates sound practice attempt statistics for the learner.
    Calculates progress_percent (target: 5 correct = 100%) and sets mastered = true when at 100%.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = get_default_user(db)

    sound = db.query(Sound).filter(Sound.id == sound_id, Sound.is_active == True).first()
    if not sound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sound with id {sound_id} not found."
        )

    prog = (
        db.query(UserSoundProgress)
        .filter(UserSoundProgress.user_id == user.id, UserSoundProgress.sound_id == sound.id)
        .first()
    )

    if not prog:
        prog = UserSoundProgress(
            user_id=user.id,
            sound_id=sound.id,
            practice_count=0,
            correct_count=0,
            incorrect_count=0,
            progress_percent=0,
            mastered=False,
        )
        db.add(prog)

    prog.practice_count += 1
    if correct:
        prog.correct_count += 1
    else:
        prog.incorrect_count += 1

    # Calculate progress percentage (target: 5 correct answers = 100%)
    target_correct = 5
    calculated_pct = min(round((prog.correct_count / float(target_correct)) * 100), 100)
    prog.progress_percent = calculated_pct

    if prog.progress_percent >= 100:
        prog.mastered = True

    prog.last_practiced_at = datetime.utcnow()

    db.commit()
    db.refresh(prog)

    return PracticeSoundResponse(
        sound_id=sound.id,
        practice_count=prog.practice_count,
        correct_count=prog.correct_count,
        incorrect_count=prog.incorrect_count,
        progress_percent=prog.progress_percent,
        mastered=prog.mastered,
    )
