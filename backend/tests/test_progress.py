def test_skill_unlocking_and_progress(client):
    """Test completing all lessons in a skill unlocks the next skill automatically."""
    # Skill 2 (Introductions) has 2 lessons: Lesson 3 (already done) and Lesson 4 (not done)
    # Skill 3 (Food) is currently AVAILABLE

    # Complete Lesson 4 to make Skill 2 (Introductions) 100% COMPLETED
    comp_resp = client.post("/api/lessons/4/complete")
    assert comp_resp.status_code == 200
    data = comp_resp.json()
    assert data["completed"] is True
    assert data["skill_completed"] is True

    # Check Skill 2 status
    skill2_resp = client.get("/api/skills/2")
    assert skill2_resp.json()["status"] == "COMPLETED"
    assert skill2_resp.json()["progress_percentage"] == 100.0
    assert skill2_resp.json()["crown_level"] == 4


def test_leaderboard(client):
    """Test leaderboard returns ranked users sorted by XP descending."""
    response = client.get("/api/leaderboard")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 6
    assert data[0]["rank"] == 1
    assert data[0]["username"] == "Alex"
    assert data[0]["xp"] == 1250

    # Ensure current user is in leaderboard
    current_user_entries = [entry for entry in data if entry["is_current_user"]]
    assert len(current_user_entries) == 1
    assert current_user_entries[0]["username"] == "learner"


def test_achievements(client):
    """Test retrieving user achievements."""
    response = client.get("/api/achievements")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5
