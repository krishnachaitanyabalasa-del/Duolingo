def test_get_lesson_detail(client):
    """Test retrieving lesson detail and exercises."""
    response = client.get("/api/lessons/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["title"] in ["Greetings 1", "Basic Greetings"]
    assert len(data["exercises"]) >= 6


def test_start_lesson(client):
    """Test starting a lesson attempt session."""
    response = client.post("/api/lessons/1/start")
    assert response.status_code == 200
    data = response.json()
    assert "attempt_id" in data
    assert data["user_hearts"] == 5
    assert data["lesson"]["id"] == 1
