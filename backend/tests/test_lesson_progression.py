import pytest
from app.models.user import User
from app.models.progress import UserLessonProgress
from app.models.course import Lesson

def test_1_new_user_gets_first_lesson_available(client):
    """Scenario 1: A new user starts with the first lesson AVAILABLE and subsequent lessons LOCKED."""
    headers = {"Authorization": "Bearer dev-token-prog_user_1"}
    resp = client.get("/api/course/path", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["units"]) > 0
    
    first_unit = data["units"][0]
    all_lessons = []
    for skill in first_unit["skills"]:
        all_lessons.extend(skill["lessons"])
    
    assert len(all_lessons) >= 2
    assert all_lessons[0]["status"] == "AVAILABLE"
    assert all_lessons[0]["completed"] is False
    assert all_lessons[1]["status"] == "LOCKED"
    assert all_lessons[1]["completed"] is False


def test_2_and_3_complete_lesson_1_sets_completed_and_lesson_2_available(client):
    """
    Scenario 2 & 3:
    Completing lesson 1 marks it as COMPLETED and makes lesson 2 AVAILABLE.
    """
    headers = {"Authorization": "Bearer dev-token-prog_user_2"}
    path_resp = client.get("/api/course/path", headers=headers)
    first_unit = path_resp.json()["units"][0]
    lesson_1_id = first_unit["skills"][0]["lessons"][0]["id"]
    lesson_2_id = first_unit["skills"][0]["lessons"][1]["id"]

    # Start lesson 1
    start_resp = client.post(f"/api/lessons/{lesson_1_id}/start", headers=headers)
    assert start_resp.status_code == 200

    # Complete lesson 1
    comp_resp = client.post(f"/api/lessons/{lesson_1_id}/complete", headers=headers)
    assert comp_resp.status_code == 200
    comp_data = comp_resp.json()
    assert comp_data["status"] == "COMPLETED"
    assert comp_data["completed"] is True
    assert comp_data["xp_earned"] == 10
    assert comp_data["next_lesson_id"] == lesson_2_id
    assert comp_data["next_lesson_unlocked"] is True

    # Check /api/course/path
    path_after = client.get("/api/course/path", headers=headers).json()
    skills = path_after["units"][0]["skills"]
    all_lessons = []
    for s in skills:
        all_lessons.extend(s["lessons"])

    l1 = next(l for l in all_lessons if l["id"] == lesson_1_id)
    l2 = next(l for l in all_lessons if l["id"] == lesson_2_id)

    assert l1["status"] == "COMPLETED"
    assert l1["completed"] is True
    assert l2["status"] == "AVAILABLE"
    assert l2["completed"] is False


def test_4_lesson_3_remains_locked_until_lesson_2_completed(client):
    """
    Scenario 4:
    Lesson 3 remains LOCKED until lesson 2 is completed.
    Attempting to start Lesson 3 returns 403 Forbidden.
    """
    headers = {"Authorization": "Bearer dev-token-prog_user_3"}
    path_resp = client.get("/api/course/path", headers=headers)
    first_unit = path_resp.json()["units"][0]
    all_lessons = []
    for s in first_unit["skills"]:
        all_lessons.extend(s["lessons"])

    assert len(all_lessons) >= 3
    l1_id = all_lessons[0]["id"]
    l2_id = all_lessons[1]["id"]
    l3_id = all_lessons[2]["id"]

    # Complete Lesson 1
    client.post(f"/api/lessons/{l1_id}/start", headers=headers)
    client.post(f"/api/lessons/{l1_id}/complete", headers=headers)

    # Lesson 3 cannot be started
    l3_start_resp = client.post(f"/api/lessons/{l3_id}/start", headers=headers)
    assert l3_start_resp.status_code == 403

    # Now complete Lesson 2
    client.post(f"/api/lessons/{l2_id}/start", headers=headers)
    l2_comp = client.post(f"/api/lessons/{l2_id}/complete", headers=headers)
    assert l2_comp.status_code == 200

    # Now Lesson 3 can be started!
    l3_start_after = client.post(f"/api/lessons/{l3_id}/start", headers=headers)
    assert l3_start_after.status_code == 200


def test_5_and_6_refresh_and_relogin_persists_progress(client):
    """
    Scenario 5 & 6:
    Re-fetching /api/course/path and authenticating again preserves completed/available states.
    """
    token = "dev-token-persistent_user"
    headers = {"Authorization": f"Bearer {token}"}

    # Complete lesson 1
    client.post("/api/lessons/1/start", headers=headers)
    client.post("/api/lessons/1/complete", headers=headers)

    # Simulated page refresh (call /api/course/path again)
    resp1 = client.get("/api/course/path", headers=headers)
    assert resp1.status_code == 200
    l1 = resp1.json()["units"][0]["skills"][0]["lessons"][0]
    assert l1["status"] == "COMPLETED"
    assert l1["completed"] is True

    # Simulated re-login with same credentials
    headers_relogin = {"Authorization": f"Bearer {token}"}
    resp2 = client.get("/api/course/path", headers=headers_relogin)
    assert resp2.status_code == 200
    l1_relogin = resp2.json()["units"][0]["skills"][0]["lessons"][0]
    assert l1_relogin["status"] == "COMPLETED"
    assert l1_relogin["completed"] is True


def test_7_completing_same_lesson_twice_does_not_award_duplicate_xp(client):
    """
    Scenario 7:
    Completing the same lesson twice does not award duplicate XP.
    """
    headers = {"Authorization": "Bearer dev-token-xp_test_user"}
    me_before = client.get("/api/me", headers=headers).json()
    xp_before = me_before["xp"]

    # First completion
    client.post("/api/lessons/1/start", headers=headers)
    resp1 = client.post("/api/lessons/1/complete", headers=headers)
    assert resp1.status_code == 200
    assert resp1.json()["xp_earned"] == 10

    me_mid = client.get("/api/me", headers=headers).json()
    assert me_mid["xp"] > xp_before  # XP increased after first completion

    # Second completion
    client.post("/api/lessons/1/start", headers=headers)
    resp2 = client.post("/api/lessons/1/complete", headers=headers)
    assert resp2.status_code == 200
    assert resp2.json()["xp_earned"] == 0
    assert resp2.json()["xp_awarded"] == 0

    me_after = client.get("/api/me", headers=headers).json()
    assert me_after["xp"] == me_mid["xp"]  # XP does not increase again on second completion!


def test_8_and_9_practice_mode_completed_lesson(client):
    """
    Scenario 8 & 9:
    Completed lesson can still be practiced, and practicing it does NOT reset COMPLETED status.
    """
    headers = {"Authorization": "Bearer dev-token-practice_user"}
    client.post("/api/lessons/1/start", headers=headers)
    client.post("/api/lessons/1/complete", headers=headers)

    # Start practice session on lesson 1
    start_resp = client.post("/api/lessons/1/start", headers=headers)
    assert start_resp.status_code == 200

    # Path check during practice: lesson 1 remains COMPLETED (not reset to IN_PROGRESS or LOCKED)
    path_during = client.get("/api/course/path", headers=headers).json()
    l1 = path_during["units"][0]["skills"][0]["lessons"][0]
    assert l1["status"] == "COMPLETED"
    assert l1["completed"] is True

    # Complete practice session
    comp_practice = client.post("/api/lessons/1/complete", headers=headers)
    assert comp_practice.status_code == 200
    assert comp_practice.json()["status"] == "COMPLETED"

    # Path check after practice
    path_after = client.get("/api/course/path", headers=headers).json()
    l1_after = path_after["units"][0]["skills"][0]["lessons"][0]
    assert l1_after["status"] == "COMPLETED"
    assert l1_after["completed"] is True


def test_10_different_users_have_independent_lesson_progress(client):
    """
    Scenario 10:
    User A's completion does not affect User B's progress.
    """
    headers_a = {"Authorization": "Bearer dev-token-user_alice"}
    headers_b = {"Authorization": "Bearer dev-token-user_bob"}

    # User A completes lesson 1
    client.post("/api/lessons/1/start", headers=headers_a)
    client.post("/api/lessons/1/complete", headers=headers_a)

    # User A has Lesson 1 COMPLETED, Lesson 2 AVAILABLE
    path_a = client.get("/api/course/path", headers=headers_a).json()
    a_l1 = path_a["units"][0]["skills"][0]["lessons"][0]
    a_l2 = path_a["units"][0]["skills"][0]["lessons"][1]
    assert a_l1["status"] == "COMPLETED"
    assert a_l2["status"] == "AVAILABLE"

    # User B should still have Lesson 1 AVAILABLE, Lesson 2 LOCKED
    path_b = client.get("/api/course/path", headers=headers_b).json()
    b_l1 = path_b["units"][0]["skills"][0]["lessons"][0]
    b_l2 = path_b["units"][0]["skills"][0]["lessons"][1]
    assert b_l1["status"] == "AVAILABLE"
    assert b_l1["completed"] is False
    assert b_l2["status"] == "LOCKED"
    assert b_l2["completed"] is False


def test_11_double_completion_request_idempotent(client):
    """
    Scenario 11:
    Calling POST /api/lessons/{id}/complete multiple times consecutively
    succeeds idempotently without throwing errors or corrupting state.
    """
    headers = {"Authorization": "Bearer dev-token-idempotent_user"}
    client.post("/api/lessons/1/start", headers=headers)

    resp1 = client.post("/api/lessons/1/complete", headers=headers)
    assert resp1.status_code == 200
    assert resp1.json()["completed"] is True

    resp2 = client.post("/api/lessons/1/complete", headers=headers)
    assert resp2.status_code == 200
    assert resp2.json()["completed"] is True
    assert resp2.json()["xp_earned"] == 0

    resp3 = client.post("/api/lessons/1/complete", headers=headers)
    assert resp3.status_code == 200
    assert resp3.json()["completed"] is True
    assert resp3.json()["xp_earned"] == 0
