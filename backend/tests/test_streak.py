from datetime import date, timedelta
from app.utils.date_utils import set_mock_today, reset_mock_today


def test_streak_consecutive_day(client):
    """Test streak increments on consecutive day activity."""
    # Seeded learner last activity was yesterday, streak=5
    set_mock_today(date.today())

    resp = client.post("/api/streak/check")
    assert resp.status_code == 200
    data = resp.json()
    assert data["current_streak"] == 6
    assert data["longest_streak"] == 6


def test_streak_same_day(client):
    """Test streak remains unchanged on same day activity."""
    # Set activity to yesterday (same day as seeded last_activity_date)
    yesterday = date.today() - timedelta(days=1)
    set_mock_today(yesterday)

    resp = client.post("/api/streak/check")
    assert resp.status_code == 200
    data = resp.json()
    assert data["current_streak"] == 5
    assert data["updated"] is False


def test_streak_reset_on_gap(client):
    """Test streak resets to 1 after a gap of >1 day."""
    # Set mock date 3 days in the future
    future_date = date.today() + timedelta(days=3)
    set_mock_today(future_date)

    resp = client.post("/api/streak/check")
    assert resp.status_code == 200
    data = resp.json()
    assert data["current_streak"] == 1
