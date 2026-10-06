def test_skill_unlocking_and_progress(client):
    """Test completing all lessons in an AVAILABLE skill unlocks the next skill automatically."""
    # Skill 3 (Basic Words) is AVAILABLE, contains Lesson 5 and Lesson 6.
    # Complete Lesson 5
    client.post("/api/lessons/5/complete")

    # Complete Lesson 6 to make Skill 3 (Basic Words) 100% COMPLETED
    comp_resp = client.post("/api/lessons/6/complete")
    assert comp_resp.status_code == 200
    data = comp_resp.json()
    assert data["completed"] is True
    assert data["skill_completed"] is True

    # Check Skill 3 status
    skill3_resp = client.get("/api/skills/3")
    assert skill3_resp.json()["status"] == "COMPLETED"
    assert skill3_resp.json()["progress_percentage"] == 100.0
    assert skill3_resp.json()["crown_level"] == 4

    # Skill 4 (Food & Drinks) should now be unlocked and AVAILABLE
    skill4_resp = client.get("/api/skills/4")
    assert skill4_resp.json()["status"] == "AVAILABLE"


def test_leaderboard(client):
    """Test leaderboard returns ranked users sorted by XP descending."""
    response = client.get("/api/leaderboard")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 6
    assert data[0]["rank"] == 1
    assert data[0]["username"] == "Orion"
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
