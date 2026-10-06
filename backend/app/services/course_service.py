from typing import Optional, Any
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.course import Course, Unit, Skill, Lesson, Exercise, UnitTest, TestExercise
from app.models.progress import UserUnitProgress, UserSkillProgress, UserLessonProgress, UserTestAttempt
from app.schemas.course import (
    CourseRead,
    UnitRead,
    SkillRead,
    LessonSummary,
    ExerciseRead,
    CoursePathResponse,
    CoursePathCourse,
    CoursePathUnit,
    CoursePathSkill,
    UnitTestInfo,
    UnitTestDetail,
    TestQuestionRead,
    TestSubmitRequest,
    TestSubmitResponse,
)
from app.schemas.lesson import LessonDetail
from app.utils.auth import initialize_user_progress
from app.utils.answer_utils import normalize_answer
from app.services.achievement_service import check_user_achievements


def get_all_courses(db: Session) -> list[Course]:
    """Retrieves all available courses."""
    return db.query(Course).all()


def get_active_course(db: Session, user_id: int) -> CourseRead:
    """
    Retrieves active course with unit hierarchy, skill statuses, crown levels, 
    and progress percentages customized for the specified learner.
    """
    course = db.query(Course).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No course found. Please seed the database."
        )

    # Build skill progress lookup for the user
    user_skill_progresses = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user_id)
        .all()
    )
    skill_progress_map = {sp.skill_id: sp for sp in user_skill_progresses}

    # Build lesson progress lookup for the user
    user_lesson_progresses = (
        db.query(UserLessonProgress)
        .filter(UserLessonProgress.user_id == user_id)
        .all()
    )
    lesson_progress_map = {lp.lesson_id: lp for lp in user_lesson_progresses}

    unit_reads = []
    for unit in course.units:
        skill_reads = []
        for skill in unit.skills:
            sp = skill_progress_map.get(skill.id)
            skill_status = sp.status if sp else "LOCKED"
            crown_level = sp.crown_level if sp else 0
            progress_pct = sp.progress_percentage if sp else 0.0

            lesson_summaries = []
            for lesson in skill.lessons:
                lp = lesson_progress_map.get(lesson.id)
                is_completed = lp.is_completed if lp else False
                lesson_summaries.append(
                    LessonSummary(
                        id=lesson.id,
                        skill_id=lesson.skill_id,
                        title=lesson.title,
                        order=lesson.order,
                        xp_reward=lesson.xp_reward,
                        is_completed=is_completed,
                    )
                )

            skill_reads.append(
                SkillRead(
                    id=skill.id,
                    unit_id=skill.unit_id,
                    title=skill.title,
                    description=skill.description,
                    icon=skill.icon,
                    order=skill.order,
                    status=skill_status,
                    crown_level=crown_level,
                    progress_percentage=progress_pct,
                    lessons=lesson_summaries,
                )
            )

        unit_reads.append(
            UnitRead(
                id=unit.id,
                course_id=unit.course_id,
                title=unit.title,
                description=unit.description,
                order=unit.order,
                skills=skill_reads,
            )
        )

    return CourseRead(
        id=course.id,
        title=course.title,
        description=course.description,
        language_code=course.language_code,
        icon=course.icon,
        units=unit_reads,
    )


def get_course_path(db: Session, user: User) -> CoursePathResponse:
    """
    Returns the full learning path customized for the authenticated user,
    with unit, skill, lesson, and test statuses.
    """
    initialize_user_progress(db, user)

    course = db.query(Course).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No course found. Please seed the database."
        )

    user_units = {up.unit_id: up for up in db.query(UserUnitProgress).filter(UserUnitProgress.user_id == user.id).all()}
    user_skills = {sp.skill_id: sp for sp in db.query(UserSkillProgress).filter(UserSkillProgress.user_id == user.id).all()}
    user_lessons = {lp.lesson_id: lp for lp in db.query(UserLessonProgress).filter(UserLessonProgress.user_id == user.id).all()}
    user_test_attempts = db.query(UserTestAttempt).filter(UserTestAttempt.user_id == user.id).all()

    test_passed_map = {ta.test_id: True for ta in user_test_attempts if ta.passed}

    unit_path_list = []
    prev_unit_completed = True

    for u_idx, unit in enumerate(course.units):
        u_prog = user_units.get(unit.id)

        all_unit_lessons = []
        for s in unit.skills:
            all_unit_lessons.extend(s.lessons)

        completed_unit_lessons = [l for l in all_unit_lessons if user_lessons.get(l.id) and user_lessons[l.id].is_completed]
        total_unit_lessons_count = len(all_unit_lessons)
        unit_progress_pct = (len(completed_unit_lessons) / total_unit_lessons_count * 100.0) if total_unit_lessons_count > 0 else 100.0

        unit_status = "LOCKED"
        if u_prog and u_prog.status == "COMPLETED":
            unit_status = "COMPLETED"
        elif u_idx == 0 or prev_unit_completed or (u_prog and u_prog.status == "AVAILABLE"):
            if unit_progress_pct >= 100.0 and test_passed_map.get(unit.test.id if unit.test else 0):
                unit_status = "COMPLETED"
            elif unit_progress_pct > 0:
                unit_status = "IN_PROGRESS"
            else:
                unit_status = "AVAILABLE"

        test_info = None
        if unit.test:
            test_obj = unit.test
            is_test_passed = test_passed_map.get(test_obj.id, False)
            all_lessons_done = (len(completed_unit_lessons) == total_unit_lessons_count) and (total_unit_lessons_count > 0)

            if is_test_passed:
                test_status = "PASSED"
                test_locked = False
            elif all_lessons_done:
                test_status = "AVAILABLE"
                test_locked = False
            else:
                test_status = "LOCKED"
                test_locked = True

            test_info = UnitTestInfo(
                id=test_obj.id,
                name=test_obj.title,
                status=test_status,
                locked=test_locked
            )

        skill_path_list = []
        prev_skill_completed = (unit_status != "LOCKED")
        for s_idx, skill in enumerate(unit.skills):
            sp = user_skills.get(skill.id)
            all_s_lessons = skill.lessons
            comp_s_lessons = [l for l in all_s_lessons if user_lessons.get(l.id) and user_lessons[l.id].is_completed]
            s_pct = (len(comp_s_lessons) / len(all_s_lessons) * 100.0) if all_s_lessons else 100.0

            if unit_status == "LOCKED":
                s_status = "LOCKED"
            elif sp and sp.status == "COMPLETED":
                s_status = "COMPLETED"
            elif s_idx == 0 or prev_skill_completed or (sp and sp.status == "AVAILABLE"):
                s_status = "COMPLETED" if s_pct >= 100.0 else ("IN_PROGRESS" if s_pct > 0 else "AVAILABLE")
            else:
                s_status = "LOCKED"

            lesson_summaries = []
            for lesson in all_s_lessons:
                is_comp = user_lessons.get(lesson.id).is_completed if user_lessons.get(lesson.id) else False
                lesson_summaries.append(LessonSummary(
                    id=lesson.id,
                    skill_id=lesson.skill_id,
                    title=lesson.title,
                    order=lesson.order,
                    xp_reward=lesson.xp_reward,
                    is_completed=is_comp
                ))

            skill_path_list.append(CoursePathSkill(
                id=skill.id,
                name=skill.title,
                status=s_status,
                progress_percent=s_pct,
                lessons=lesson_summaries
            ))
            prev_skill_completed = (s_status == "COMPLETED")

        unit_path_list.append(CoursePathUnit(
            id=unit.id,
            name=unit.title,
            description=unit.description,
            status=unit_status,
            progress_percent=unit_progress_pct,
            skills=skill_path_list,
            test=test_info
        ))

        prev_unit_completed = (unit_status == "COMPLETED")

    return CoursePathResponse(
        course=CoursePathCourse(id=course.id, name=course.title),
        units=unit_path_list
    )


def get_unit_test(db: Session, test_id: int, user: User) -> UnitTestDetail:
    """Retrieves unit test questions without revealing correct answers."""
    test = db.query(UnitTest).filter(UnitTest.id == test_id).first()
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unit Test with id {test_id} not found."
        )

    unit = test.unit
    all_lessons = []
    for s in unit.skills:
        all_lessons.extend(s.lessons)

    comp_count = db.query(UserLessonProgress).filter(
        UserLessonProgress.user_id == user.id,
        UserLessonProgress.lesson_id.in_([l.id for l in all_lessons]),
        UserLessonProgress.is_completed == True
    ).count()

    if len(all_lessons) > 0 and comp_count < len(all_lessons):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unit Test is locked. Complete all required lessons in this unit before taking the test."
        )

    questions = []
    for ex in test.exercises:
        content_dict = ex.content if isinstance(ex.content, dict) else {}
        questions.append(
            TestQuestionRead(
                id=ex.id,
                type=ex.type,
                question=ex.prompt,
                options=content_dict.get("options"),
                word_bank=content_dict.get("word_bank"),
                pairs=content_dict.get("pairs"),
                sentence_prefix=content_dict.get("sentence_prefix"),
                sentence_suffix=content_dict.get("sentence_suffix"),
            )
        )

    return UnitTestDetail(
        id=test.id,
        unit_id=test.unit_id,
        name=test.title,
        questions=questions
    )


def submit_unit_test(db: Session, test_id: int, request: TestSubmitRequest, user: User) -> TestSubmitResponse:
    """
    Evaluates unit test answers, stores TestAttempt, and unlocks next unit if passed (>= 80%).
    """
    test = db.query(UnitTest).filter(UnitTest.id == test_id).first()
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unit Test with id {test_id} not found."
        )

    answer_map = {ans.question_id: ans.answer for ans in request.answers}
    correct_count = 0
    total_questions = len(test.exercises)

    from app.services.lesson_service import _validate_exercise_answer

    for ex in test.exercises:
        user_ans = answer_map.get(ex.id)
        if user_ans is not None:
            mock_ex = Exercise(
                id=ex.id,
                lesson_id=0,
                type=ex.type,
                prompt=ex.prompt,
                content=ex.content,
                correct_answer=ex.correct_answer,
                order=ex.order
            )
            is_correct, _ = _validate_exercise_answer(mock_ex, user_ans)
            if is_correct:
                correct_count += 1

    percentage = (correct_count / total_questions * 100.0) if total_questions > 0 else 0.0
    passed = percentage >= (test.passing_score_percentage or 80.0)

    xp_gained = 0
    next_unit_unlocked_id = None

    if passed:
        xp_gained = test.xp_reward or 50
        user.xp += xp_gained

        # Update UserUnitProgress for current unit
        u_prog = (
            db.query(UserUnitProgress)
            .filter(UserUnitProgress.user_id == user.id, UserUnitProgress.unit_id == test.unit_id)
            .first()
        )
        if not u_prog:
            u_prog = UserUnitProgress(user_id=user.id, unit_id=test.unit_id, status="COMPLETED", progress_percentage=100.0)
            db.add(u_prog)
        else:
            u_prog.status = "COMPLETED"
            u_prog.progress_percentage = 100.0

        # Unlock next unit
        next_unit = (
            db.query(Unit)
            .filter(Unit.course_id == test.unit.course_id, Unit.order > test.unit.order)
            .order_by(Unit.order.asc())
            .first()
        )
        if next_unit:
            next_u_prog = (
                db.query(UserUnitProgress)
                .filter(UserUnitProgress.user_id == user.id, UserUnitProgress.unit_id == next_unit.id)
                .first()
            )
            if not next_u_prog:
                next_u_prog = UserUnitProgress(user_id=user.id, unit_id=next_unit.id, status="AVAILABLE", progress_percentage=0.0)
                db.add(next_u_prog)
            elif next_u_prog.status == "LOCKED":
                next_u_prog.status = "AVAILABLE"

            next_unit_unlocked_id = next_unit.id

            # Unlock first skill in next unit
            first_skill = db.query(Skill).filter(Skill.unit_id == next_unit.id).order_by(Skill.order.asc()).first()
            if first_skill:
                sp = (
                    db.query(UserSkillProgress)
                    .filter(UserSkillProgress.user_id == user.id, UserSkillProgress.skill_id == first_skill.id)
                    .first()
                )
                if not sp:
                    db.add(UserSkillProgress(user_id=user.id, skill_id=first_skill.id, status="AVAILABLE"))
                elif sp.status == "LOCKED":
                    sp.status = "AVAILABLE"

        check_user_achievements(db, user)

    attempt = UserTestAttempt(
        user_id=user.id,
        test_id=test.id,
        score=correct_count,
        total_questions=total_questions,
        percentage=percentage,
        passed=passed,
        xp_earned=xp_gained,
        attempted_at=datetime.utcnow()
    )
    db.add(attempt)
    db.commit()
    db.refresh(user)

    return TestSubmitResponse(
        test_id=test.id,
        score=correct_count,
        total=total_questions,
        percentage=percentage,
        passed=passed,
        xp_earned=xp_gained,
        next_unit_unlocked=next_unit_unlocked_id
    )


def get_units_by_course(db: Session, course_id: int, user_id: int) -> list[UnitRead]:
    """Retrieves units for a course with skill statuses for user."""
    course_read = get_active_course(db, user_id)
    return course_read.units


def get_skill_detail(db: Session, skill_id: int, user_id: int) -> SkillRead:
    """Retrieves details for a single skill."""
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Skill with id {skill_id} not found."
        )

    sp = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user_id, UserSkillProgress.skill_id == skill_id)
        .first()
    )
    status_str = sp.status if sp else "LOCKED"
    crown_level = sp.crown_level if sp else 0
    progress_pct = sp.progress_percentage if sp else 0.0

    user_lessons = (
        db.query(UserLessonProgress)
        .filter(UserLessonProgress.user_id == user_id)
        .all()
    )
    lesson_map = {lp.lesson_id: lp.is_completed for lp in user_lessons}

    lesson_summaries = [
        LessonSummary(
            id=l.id,
            skill_id=l.skill_id,
            title=l.title,
            order=l.order,
            xp_reward=l.xp_reward,
            is_completed=lesson_map.get(l.id, False),
        )
        for l in skill.lessons
    ]

    return SkillRead(
        id=skill.id,
        unit_id=skill.unit_id,
        title=skill.title,
        description=skill.description,
        icon=skill.icon,
        order=skill.order,
        status=status_str,
        crown_level=crown_level,
        progress_percentage=progress_pct,
        lessons=lesson_summaries,
    )


def get_lesson_detail(db: Session, lesson_id: int, user_id: int) -> LessonDetail:
    """Retrieves lesson details with exercises."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lesson with id {lesson_id} not found."
        )

    exercises_read = [
        ExerciseRead(
            id=ex.id,
            lesson_id=ex.lesson_id,
            type=ex.type,
            prompt=ex.prompt,
            content=ex.content,
            correct_answer=ex.correct_answer,
            explanation=ex.explanation,
            order=ex.order,
        )
        for ex in lesson.exercises
    ]

    return LessonDetail(
        id=lesson.id,
        skill_id=lesson.skill_id,
        title=lesson.title,
        order=lesson.order,
        xp_reward=lesson.xp_reward,
        exercises=exercises_read,
    )
