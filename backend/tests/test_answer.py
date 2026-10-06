def test_correct_answer(client):
    """Test submitting a correct answer awards XP and keeps hearts."""
    response = client.post(
        "/api/lessons/1/answer",
        json={"exercise_id": 1, "answer": "Hola"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["correct"] is True
    assert data["hearts"] == 5
    assert data["xp_earned"] == 1


def test_incorrect_answer_deducts_heart(client):
    """Test submitting an incorrect answer deducts 1 heart."""
    response = client.post(
        "/api/lessons/1/answer",
        json={"exercise_id": 1, "answer": "Wrong Answer"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["correct"] is False
    assert data["hearts"] == 4
    assert data["xp_earned"] == 0


def test_match_pairs_answer(client):
    """Test submitting match pairs exercise answer."""
    pairs_answer = [
        {"left": "Hola", "right": "Hello"},
        {"left": "Adiós", "right": "Goodbye"},
        {"left": "Gracias", "right": "Thank you"}
    ]
    response = client.post(
        "/api/lessons/2/answer",
        json={"exercise_id": 4, "answer": pairs_answer}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["correct"] is True
