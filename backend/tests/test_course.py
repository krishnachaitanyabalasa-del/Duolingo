def test_get_course(client):
    """Test retrieving active course details."""
    response = client.get("/api/course")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "English Course"
    assert len(data["units"]) >= 1
    assert data["units"][0]["title"] == "Unit 1: Basics"


def test_get_units(client):
    """Test retrieving course units."""
    response = client.get("/api/units")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2


def test_get_skill_detail(client):
    """Test retrieving single skill detail."""
    response = client.get("/api/skills/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["title"] == "Greetings"
    assert data["status"] == "COMPLETED"
    assert len(data["lessons"]) == 2


def test_get_nonexistent_skill(client):
    """Test retrieving non-existent skill returns 404."""
    response = client.get("/api/skills/9999")
    assert response.status_code == 404
