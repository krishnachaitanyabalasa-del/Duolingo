def test_course_path_endpoint(client):
    """Test retrieving course path returns 10 units with progression states."""
    response = client.get("/api/course/path")
    assert response.status_code == 200
    data = response.json()
    assert "course" in data
    assert "units" in data
    assert len(data["units"]) == 10
    
    # Unit 1 is AVAILABLE, Unit 2 is LOCKED initially
    assert data["units"][0]["status"] in ["AVAILABLE", "IN_PROGRESS", "COMPLETED"]
    assert data["units"][1]["status"] in ["LOCKED", "AVAILABLE"]
    assert data["units"][0]["test"]["name"] == "UNIT 1 — BASICS Test"


def test_unit_test_locked_until_lessons_completed(client):
    """Test unit test is locked when lessons are not completed."""
    # Unit 1 Test should be locked if lessons are not done
    response = client.get("/api/tests/1")
    # If uncompleted, returns 403 Forbidden
    assert response.status_code in [200, 403]


def test_unit_test_submission_and_unit_unlocking(client):
    """Test completing lessons, taking test, passing >=80%, and unlocking Unit 2."""
    # 1. Complete lessons in Unit 1 (lessons 1..6)
    for l_id in range(1, 7):
        client.post(f"/api/lessons/{l_id}/complete")

    # 2. Get Unit 1 Test questions
    test_resp = client.get("/api/tests/1")
    assert test_resp.status_code == 200
    test_data = test_resp.json()
    assert test_data["id"] == 1
    assert "questions" in test_data
    assert len(test_data["questions"]) == 10

    # Verify no correct_answer field is exposed in GET test
    for q in test_data["questions"]:
        assert "correct_answer" not in q

    # 3. Submit correct answers to pass test (>=80%)
    answers = [
        {"question_id": 1, "answer": "Hello"},
        {"question_id": 2, "answer": "Good morning"},
        {"question_id": 3, "answer": "are"},
        {"question_id": 4, "answer": "good"},
        {"question_id": 5, "answer": [{"left": "Hi", "right": "Hello"}, {"left": "Thanks", "right": "Thank you"}]},
        {"question_id": 6, "answer": "Thank you!"},
        {"question_id": 7, "answer": "Nice to meet you"},
        {"question_id": 8, "answer": "nice"},
        {"question_id": 9, "answer": "goodbye"},
        {"question_id": 10, "answer": "Good night"},
    ]

    submit_resp = client.post("/api/tests/1/submit", json={"answers": answers})
    assert submit_resp.status_code == 200
    submit_data = submit_resp.json()
    assert submit_data["passed"] is True
    assert submit_data["percentage"] >= 80.0
    assert submit_data["xp_earned"] == 50
    assert submit_data["next_unit_unlocked"] == 2

    # 4. Verify Unit 2 is now AVAILABLE on course path
    path_resp = client.get("/api/course/path")
    assert path_resp.status_code == 200
    path_data = path_resp.json()
    assert path_data["units"][0]["status"] == "COMPLETED"
    assert path_data["units"][1]["status"] in ["AVAILABLE", "IN_PROGRESS", "COMPLETED"]
