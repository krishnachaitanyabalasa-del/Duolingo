def test_heart_depletion_and_refill(client):
    """Test hearts deduction down to 0, preventing session start, and refill functionality."""
    # Deduct 5 hearts by submitting incorrect answers
    for i in range(5):
        resp = client.post(
            "/api/lessons/1/answer",
            json={"exercise_id": 1, "answer": "Wrong"}
        )
        assert resp.status_code == 200

    # User now has 0 hearts
    user_resp = client.get("/api/user")
    assert user_resp.json()["hearts"] == 0

    # Starting a lesson with 0 hearts should fail with 400 Bad Request
    start_resp = client.post("/api/lessons/1/start")
    assert start_resp.status_code == 400
    assert "No hearts remaining" in start_resp.json()["detail"]

    # Refill hearts
    refill_resp = client.post("/api/hearts/refill")
    assert refill_resp.status_code == 200
    assert refill_resp.json()["hearts"] == 5

    # Should be able to start lesson again
    start_resp2 = client.post("/api/lessons/1/start")
    assert start_resp2.status_code == 200
