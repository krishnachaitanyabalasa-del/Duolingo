def test_xp_calculation_and_lesson_completion(client):
    """Test XP increment on correct answer and +10 bonus on lesson completion."""
    initial_user = client.get("/api/user").json()
    initial_xp = initial_user["xp"]

    # Complete lesson 4 (Lesson 2 of Skill 2: Introductions)
    comp_resp = client.post("/api/lessons/4/complete")
    assert comp_resp.status_code == 200
    data = comp_resp.json()
    assert data["completed"] is True
    assert data["xp_awarded"] == 10
    assert data["total_xp"] == initial_xp + 10

    # Test idempotency: completing the same lesson again does not award double XP
    repeat_resp = client.post("/api/lessons/4/complete")
    assert repeat_resp.status_code == 200
    repeat_data = repeat_resp.json()
    assert repeat_data["xp_awarded"] == 0
    assert repeat_data["total_xp"] == initial_xp + 10
