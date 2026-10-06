from fastapi.testclient import TestClient


def test_get_profile(client: TestClient):
    response = client.get("/api/profile")
    assert response.status_code == 200
    data = response.json()
    assert "username" in data
    assert "display_name" in data
    assert "avatar_id" in data
    assert "stats" in data
    assert "courses" in data


def test_update_profile(client: TestClient):
    update_payload = {
        "display_name": "Krishna Test Chaitanya",
        "bio": "Testing profile update",
        "avatar_id": "avatar_02"
    }
    response = client.put("/api/profile", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["display_name"] == "Krishna Test Chaitanya"
    assert data["bio"] == "Testing profile update"
    assert data["avatar_id"] == "avatar_02"


def test_get_followers_and_following(client: TestClient):
    resp_followers = client.get("/api/profile/followers")
    assert resp_followers.status_code == 200
    assert isinstance(resp_followers.json(), list)

    resp_following = client.get("/api/profile/following")
    assert resp_following.status_code == 200
    assert isinstance(resp_following.json(), list)
