from datetime import datetime
from typing import Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.course import Lesson, Exercise, Skill
from app.models.progress import UserSkillProgress, UserLessonProgress, LessonAttempt
from app.schemas.lesson import (
    LessonStartResponse,
    AnswerResponse,
    LessonCompleteResponse,
    LessonDetail,
    ExerciseRead,
)
from app.services.course_service import get_lesson_detail
from app.services.user_service import get_default_user
from app.services.achievement_service import check_user_achievements
from app.services.economy_service import (
    record_xp,
    record_answers,
    record_lesson_completed,
)
from app.services.quest_service import sync_quest_progress
from app.utils.date_utils import update_user_streak


def start_lesson(db: Session, lesson_id: int, user_id: int) -> LessonStartResponse:
    """
    Starts a lesson for the user. Validates user has > 0 hearts.
    Creates an active LessonAttempt record.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = get_default_user(db)

    if user.hearts <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No hearts remaining. Refill your hearts to continue learning."
        )

    lesson_detail = get_lesson_detail(db, lesson_id, user_id)

    # Create new attempt session
    attempt = LessonAttempt(
        user_id=user.id,
        lesson_id=lesson_id,
        status="IN_PROGRESS",
        score=0,
        xp_earned=0,
        hearts_spent=0,
        started_at=datetime.utcnow(),
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return LessonStartResponse(
        attempt_id=attempt.id,
        lesson=lesson_detail,
        user_hearts=user.hearts,
    )


from app.utils.answer_utils import normalize_answer


def _validate_exercise_answer(exercise: Exercise, answer: Any) -> tuple[bool, Any]:
    """
    Helper function to validate answers across all exercise types:
    MULTIPLE_CHOICE, TRANSLATE, MATCH_PAIRS, FILL_BLANK, TYPE_ANSWER.
    Returns (is_correct, formatted_correct_answer).
    """
    correct_ans = exercise.correct_answer

    if exercise.type == "MULTIPLE_CHOICE":
        options = []
        if isinstance(exercise.content, dict):
            options = exercise.content.get("options", [])

        user_str = str(answer)
        if (isinstance(answer, int) or (isinstance(answer, str) and str(answer).isdigit())) and options:
            idx = int(answer)
            if 0 <= idx < len(options):
                user_str = options[idx]

        expected_str = str(correct_ans)
        if (isinstance(correct_ans, int) or (isinstance(correct_ans, str) and str(correct_ans).isdigit())) and options:
            idx = int(correct_ans)
            if 0 <= idx < len(options):
                expected_str = options[idx]

        is_correct = (
            normalize_answer(user_str) == normalize_answer(expected_str) or
            str(answer).strip() == str(correct_ans).strip()
        )
        return is_correct, expected_str

    elif exercise.type == "TRANSLATE":
        user_str = normalize_answer(answer)
        expected_str = normalize_answer(correct_ans)
        expected_display = correct_ans

        is_correct = user_str == expected_str
        return is_correct, expected_display

    elif exercise.type == "FILL_BLANK":
        options = []
        if isinstance(exercise.content, dict):
            options = exercise.content.get("options", [])

        user_str = str(answer)
        if (isinstance(answer, int) or (isinstance(answer, str) and str(answer).isdigit())) and options:
            idx = int(answer)
            if 0 <= idx < len(options):
                user_str = options[idx]

        expected_str = str(correct_ans)
        is_correct = normalize_answer(user_str) == normalize_answer(expected_str)
        return is_correct, expected_str

    elif exercise.type == "TYPE_ANSWER":
        user_str = normalize_answer(answer)
        if isinstance(correct_ans, list):
            is_correct = any(normalize_answer(ca) == user_str for ca in correct_ans)
            expected_display = correct_ans[0] if correct_ans else ""
        else:
            is_correct = user_str == normalize_answer(correct_ans)
            expected_display = str(correct_ans)
        return is_correct, expected_display

    elif exercise.type == "MATCH_PAIRS":
        if answer is True or str(answer).lower() == 'true':
            return True, correct_ans

        def normalize_pairs(pairs_data):
            if isinstance(pairs_data, dict):
                return sorted([(normalize_answer(k), normalize_answer(v)) for k, v in pairs_data.items()])
            elif isinstance(pairs_data, list):
                result = []
                for item in pairs_data:
                    if isinstance(item, dict):
                        left = normalize_answer(item.get("left", ""))
                        right = normalize_answer(item.get("right", ""))
                        result.append((left, right))
                    elif isinstance(item, (list, tuple)) and len(item) == 2:
                        result.append((normalize_answer(item[0]), normalize_answer(item[1])))
                return sorted(result)
            return []

        user_pairs = normalize_pairs(answer)
        expected_pairs = normalize_pairs(correct_ans)

        is_correct = (user_pairs == expected_pairs and len(user_pairs) > 0)
        return is_correct, correct_ans

    # Fallback comparison
    return normalize_answer(answer) == normalize_answer(correct_ans), str(correct_ans)


def validate_and_submit_answer(
    db: Session, lesson_id: int, exercise_id: int, answer: Any, user_id: int
) -> AnswerResponse:
    """
    Validates submitted exercise answer.
    Deducts heart if incorrect. Awards +1 XP if correct.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = get_default_user(db)

    if user.hearts <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="0 hearts remaining. Cannot answer exercise without hearts."
        )

    exercise = db.query(Exercise).filter(Exercise.id == exercise_id, Exercise.lesson_id == lesson_id).first()
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exercise with id {exercise_id} in lesson {lesson_id} not found."
        )

    is_correct, correct_answer_display = _validate_exercise_answer(exercise, answer)

    xp_gained = 0
    if is_correct:
        xp_gained = 1
        record_xp(db, user, 1)
    else:
        user.hearts = max(0, user.hearts - 1)

    # Update active attempt if exists
    attempt = (
        db.query(LessonAttempt)
        .filter(
            LessonAttempt.user_id == user.id,
            LessonAttempt.lesson_id == lesson_id,
            LessonAttempt.status == "IN_PROGRESS"
        )
        .order_by(LessonAttempt.started_at.desc())
        .first()
    )
    if attempt:
        if is_correct:
            attempt.score += 1
            attempt.xp_earned += 1
        else:
            attempt.hearts_spent += 1

    record_answers(db, user, correct=1 if is_correct else 0, total=1)
    sync_quest_progress(db, user)
    check_user_achievements(db, user)

    db.commit()
    db.refresh(user)

    return AnswerResponse(
        correct=is_correct,
        correct_answer=correct_answer_display,
        explanation=exercise.explanation,
        hearts=user.hearts,
        xp_earned=xp_gained,
    )


def complete_lesson(db: Session, lesson_id: int, user_id: int) -> LessonCompleteResponse:
    """
    Completes a lesson attempt for the user.
    Awards lesson completion bonus XP (+10 XP) if completed for the first time.
    Updates user lesson progress & skill progress %.
    Unlocks next skill if skill reaches 100% completion.
    Updates daily streak and checks achievements.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = get_default_user(db)

    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lesson with id {lesson_id} not found."
        )

    # Fetch or create UserLessonProgress
    lesson_prog = (
        db.query(UserLessonProgress)
        .filter(UserLessonProgress.user_id == user.id, UserLessonProgress.lesson_id == lesson_id)
        .first()
    )

    if not lesson_prog:
        lesson_prog = UserLessonProgress(
            user_id=user.id,
            lesson_id=lesson_id,
            is_completed=False,
            attempts_count=1,
        )
        db.add(lesson_prog)
    else:
        lesson_prog.attempts_count += 1

    already_completed = lesson_prog.is_completed
    xp_awarded = 0

    if not already_completed:
        lesson_prog.is_completed = True
        lesson_prog.completed_at = datetime.utcnow()

        # Award lesson completion XP bonus (+10 XP) exactly once
        xp_awarded = lesson.xp_reward or 10
        record_xp(db, user, xp_awarded)
        record_lesson_completed(db, user)
        sync_quest_progress(db, user)
        db.flush()

    # Update active attempt session if exists
    session_accuracy = 100.0
    session_xp = xp_awarded
    total_ex = len(lesson.exercises) if lesson.exercises else 1

    attempt = (
        db.query(LessonAttempt)
        .filter(
            LessonAttempt.user_id == user.id,
            LessonAttempt.lesson_id == lesson_id,
            LessonAttempt.status == "IN_PROGRESS"
        )
        .order_by(LessonAttempt.started_at.desc())
        .first()
    )
    if attempt:
        attempt.status = "COMPLETED"
        attempt.completed_at = datetime.utcnow()
        attempt.xp_earned += xp_awarded
        session_xp = attempt.xp_earned
        session_accuracy = round((attempt.score / max(1, total_ex)) * 100.0, 1)

    # Update Skill Progress
    skill = lesson.skill
    all_lessons_in_skill = db.query(Lesson).filter(Lesson.skill_id == skill.id).all()
    completed_lessons_count = (
        db.query(UserLessonProgress)
        .filter(
            UserLessonProgress.user_id == user.id,
            UserLessonProgress.lesson_id.in_([l.id for l in all_lessons_in_skill]),
            UserLessonProgress.is_completed == True
        )
        .count()
    )

    total_lessons = len(all_lessons_in_skill)
    progress_percentage = (completed_lessons_count / total_lessons * 100.0) if total_lessons > 0 else 100.0

    # Calculate crowns (0%, 25%, 50%, 75%, 100%)
    if progress_percentage >= 100.0:
        crown_level = 4
    elif progress_percentage >= 75.0:
        crown_level = 3
    elif progress_percentage >= 50.0:
        crown_level = 2
    elif progress_percentage >= 25.0:
        crown_level = 1
    else:
        crown_level = 0

    skill_prog = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user.id, UserSkillProgress.skill_id == skill.id)
        .first()
    )

    if not skill_prog:
        skill_prog = UserSkillProgress(
            user_id=user.id,
            skill_id=skill.id,
            status="IN_PROGRESS",
            crown_level=crown_level,
            progress_percentage=progress_percentage,
        )
        db.add(skill_prog)
    else:
        skill_prog.progress_percentage = progress_percentage
        skill_prog.crown_level = crown_level
        if skill_prog.status == "AVAILABLE" or skill_prog.status == "LOCKED":
            skill_prog.status = "IN_PROGRESS"

    skill_just_completed = False
    next_skill_unlocked_info = None

    if progress_percentage >= 100.0 and skill_prog.status != "COMPLETED":
        skill_prog.status = "COMPLETED"
        skill_prog.completed_at = datetime.utcnow()
        skill_just_completed = True

        # Automatically unlock next skill in sequence
        next_skill = (
            db.query(Skill)
            .filter(Skill.unit_id == skill.unit_id, Skill.order > skill.order)
            .order_by(Skill.order.asc())
            .first()
        )
        if not next_skill:
            # Check next unit's first skill
            next_unit_skills = (
                db.query(Skill)
                .join(Skill.unit)
                .filter(Skill.unit_id > skill.unit_id)
                .order_by(Skill.unit_id.asc(), Skill.order.asc())
                .first()
            )
            next_skill = next_unit_skills

        if next_skill:
            next_sp = (
                db.query(UserSkillProgress)
                .filter(UserSkillProgress.user_id == user.id, UserSkillProgress.skill_id == next_skill.id)
                .first()
            )
            if not next_sp:
                next_sp = UserSkillProgress(
                    user_id=user.id,
                    skill_id=next_skill.id,
                    status="AVAILABLE",
                    unlocked_at=datetime.utcnow(),
                )
                db.add(next_sp)
            elif next_sp.status == "LOCKED":
                next_sp.status = "AVAILABLE"
                next_sp.unlocked_at = datetime.utcnow()

            next_skill_unlocked_info = {
                "id": next_skill.id,
                "title": next_skill.title,
                "status": "AVAILABLE"
            }

    # Update Streak
    update_user_streak(user)

    # Check Achievements
    check_user_achievements(db, user)

    db.commit()
    db.refresh(user)

    return LessonCompleteResponse(
        completed=True,
        xp_awarded=xp_awarded,
        total_xp=user.xp,
        skill_completed=skill_just_completed,
        next_skill_unlocked=next_skill_unlocked_info,
        current_streak=user.streak,
        accuracy=session_accuracy,
        session_xp=session_xp,
    )
