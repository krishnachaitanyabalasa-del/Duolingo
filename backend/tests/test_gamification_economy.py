import pytest
from datetime import date
from app.main import app
from app.models.user import User
from app.models.quest import DailyQuest, UserDailyActivity
from app.models.course import Lesson, UnitTest
from app.models.progress import UserLessonProgress, UserTestAttempt
from app.utils.auth import get_current_user


def test_get_me_endpoint(client, db_session):
    """Verifies GET /api/me returns central user stats."""
    test_user = db_session.query(User).filter(User.id == 1).first()
    app.dependency_overrides[get_current_user] = lambda: test_user
    try:
        response = client.get("/api/me")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == test_user.id
        assert data["xp"] == test_user.xp
        assert data["gems"] == test_user.gems
        assert data["hearts"] == test_user.hearts
        assert data["streak"] == test_user.streak
        assert "longest_streak" in data
        assert "league" in data
        assert "top_three_finishes" in data
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_daily_quests_lifecycle_and_idempotent_claim(client, db_session):
    """
    Tests lazy provisioning of quests, progress updates, completing without auto-awarding,
    and single-claim reward idempotency.
    """
    test_user = db_session.query(User).filter(User.id == 1).first()
    app.dependency_overrides[get_current_user] = lambda: test_user
    try:
        # 1. Fetch daily quests - should lazy generate 3 quests
        res = client.get("/api/daily-quests")
        assert res.status_code == 200
        quests = res.json()
        assert len(quests) == 3

        types = {q["type"] for q in quests}
        assert types == {"EARN_XP", "COMPLETE_LESSONS", "ACCURACY"}

        earn_xp_quest = next(q for q in quests if q["type"] == "EARN_XP")
        assert earn_xp_quest["current_progress"] == 0
        assert earn_xp_quest["completed"] is False
        assert earn_xp_quest["claimed"] is False
        assert earn_xp_quest["state"] == "IN_PROGRESS"

        # 2. Cannot claim in-progress quest
        claim_res = client.post(f"/api/daily-quests/{earn_xp_quest['id']}/claim")
        assert claim_res.status_code == 400
        assert "not been reached" in claim_res.json()["detail"].lower()

        # 3. Complete a lesson to gain XP
        first_lesson = db_session.query(Lesson).filter(Lesson.skill_id == 1).first()
        initial_xp = test_user.xp
        initial_gems = test_user.gems

        complete_res = client.post(f"/api/lessons/{first_lesson.id}/complete")
        assert complete_res.status_code == 200
        comp_data = complete_res.json()
        assert comp_data["xp_awarded"] == (first_lesson.xp_reward or 10)

        # Verify daily activity record bumped
        activity = db_session.query(UserDailyActivity).filter(
            UserDailyActivity.user_id == test_user.id,
            UserDailyActivity.activity_date == date.today()
        ).first()
        assert activity is not None
        assert activity.xp_earned >= comp_data["xp_awarded"]
        assert activity.lessons_completed == 1

        # 4. Check idempotency: completing the same lesson again awards 0 XP
        recomplete_res = client.post(f"/api/lessons/{first_lesson.id}/complete")
        assert recomplete_res.status_code == 200
        assert recomplete_res.json()["xp_awarded"] == 0

        # Activity counters should not duplicate
        db_session.refresh(activity)
        assert activity.lessons_completed == 1

        # 5. Simulate completing the EARN_XP quest by manually adding activity XP
        activity.xp_earned = 35
        db_session.commit()

        # Fetch quests again - EARN_XP should now be COMPLETED but NOT claimed
        res2 = client.get("/api/daily-quests")
        quests2 = res2.json()
        earn_xp_quest2 = next(q for q in quests2 if q["type"] == "EARN_XP")
        assert earn_xp_quest2["completed"] is True
        assert earn_xp_quest2["claimed"] is False
        assert earn_xp_quest2["state"] == "COMPLETED"

        # Ensure user gems haven't changed automatically
        db_session.refresh(test_user)
        assert test_user.gems == initial_gems

        # 6. Claim the reward
        claim_res2 = client.post(f"/api/daily-quests/{earn_xp_quest2['id']}/claim")
        assert claim_res2.status_code == 200
        claim_data = claim_res2.json()
        assert claim_data["success"] is True
        assert claim_data["claimed"] is True
        assert claim_data["reward_gems"] == earn_xp_quest2["reward_gems"]
        assert claim_data["total_gems"] == initial_gems + earn_xp_quest2["reward_gems"]

        # Verify user gems updated in DB
        db_session.refresh(test_user)
        assert test_user.gems == initial_gems + earn_xp_quest2["reward_gems"]

        # 7. Try claiming AGAIN - should be rejected with 400
        claim_again = client.post(f"/api/daily-quests/{earn_xp_quest2['id']}/claim")
        assert claim_again.status_code == 400
        assert "already been claimed" in claim_again.json()["detail"].lower()

        # User gems should still be unchanged after second attempt
        db_session.refresh(test_user)
        assert test_user.gems == initial_gems + earn_xp_quest2["reward_gems"]

    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_test_submission_xp_and_pass_idempotency(client, db_session):
    """
    Tests that passing a unit test awards XP once, and retaking a passed test
    does not award completion XP again.
    """
    test_user = db_session.query(User).filter(User.id == 1).first()
    app.dependency_overrides[get_current_user] = lambda: test_user
    try:
        test = db_session.query(UnitTest).filter(UnitTest.unit_id == 1).first()
        assert test is not None

        initial_xp = test_user.xp

        # Submit perfect answers for test
        answers = []
        for ex in test.exercises:
            ans_val = ex.correct_answer
            answers.append({"question_id": ex.id, "answer": ans_val})

        submit_res = client.post(f"/api/tests/{test.id}/submit", json={"answers": answers})
        assert submit_res.status_code == 200
        res_data = submit_res.json()
        assert res_data["passed"] is True
        assert res_data["xp_earned"] == (test.xp_reward or 50)

        db_session.refresh(test_user)
        assert test_user.xp == initial_xp + (test.xp_reward or 50)

        # Submit test again - passing again should give 0 XP
        resubmit = client.post(f"/api/tests/{test.id}/submit", json={"answers": answers})
        assert resubmit.status_code == 200
        resubmit_data = resubmit.json()
        assert resubmit_data["passed"] is True
        assert resubmit_data["xp_earned"] == 0

        # User XP should not increase on second pass
        db_session.refresh(test_user)
        assert test_user.xp == initial_xp + (test.xp_reward or 50)

    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_separate_users_have_isolated_stats(client, db_session):
    """Verifies two different users maintain completely separate progress and quests."""
    user1 = User(
        username="learner_alpha",
        email="alpha@test.com",
        xp=50,
        gems=100,
        hearts=5,
        streak=1,
    )
    user2 = User(
        username="learner_beta",
        email="beta@test.com",
        xp=200,
        gems=500,
        hearts=3,
        streak=10,
    )
    db_session.add_all([user1, user2])
    db_session.commit()
    db_session.refresh(user1)
    db_session.refresh(user2)

    # User 1 queries /api/me
    app.dependency_overrides[get_current_user] = lambda: user1
    res1 = client.get("/api/me")
    assert res1.json()["id"] == user1.id
    assert res1.json()["xp"] == 50
    assert res1.json()["gems"] == 100

    # User 2 queries /api/me
    app.dependency_overrides[get_current_user] = lambda: user2
    res2 = client.get("/api/me")
    assert res2.json()["id"] == user2.id
    assert res2.json()["xp"] == 200
    assert res2.json()["gems"] == 500

    # Ensure quests are completely separate
    res_q2 = client.get("/api/daily-quests")
    assert res_q2.status_code == 200

    app.dependency_overrides[get_current_user] = lambda: user1
    res_q1 = client.get("/api/daily-quests")
    assert res_q1.status_code == 200

    q1_count = db_session.query(DailyQuest).filter(DailyQuest.user_id == user1.id).count()
    q2_count = db_session.query(DailyQuest).filter(DailyQuest.user_id == user2.id).count()
    assert q1_count == 3
    assert q2_count == 3

    app.dependency_overrides.pop(get_current_user, None)
