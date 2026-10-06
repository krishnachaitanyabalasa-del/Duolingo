def test_get_sounds_overview(client):
    """Test GET /api/sounds returns Vowels and Consonants categories with sounds and learner progress."""
    response = client.get("/api/sounds")
    assert response.status_code == 200
    data = response.json()
    assert "categories" in data
    categories = data["categories"]
    assert len(categories) == 2

    # Check Vowels
    vowels_cat = categories[0]
    assert vowels_cat["name"] == "Vowels"
    assert vowels_cat["slug"] == "vowels"
    assert len(vowels_cat["sounds"]) == 15
    assert vowels_cat["sounds"][0]["symbol"] == "a"
    assert vowels_cat["sounds"][0]["example_word"] == "hot"
    assert vowels_cat["sounds"][0]["progress_percent"] == 20

    # Check Consonants
    consonants_cat = categories[1]
    assert consonants_cat["name"] == "Consonants"
    assert consonants_cat["slug"] == "consonants"
    assert len(consonants_cat["sounds"]) == 24
    assert consonants_cat["sounds"][0]["symbol"] == "b"
    assert consonants_cat["sounds"][0]["example_word"] == "book"


def test_get_sound_detail(client):
    """Test GET /api/sounds/{sound_id} returns single sound details and progress."""
    response = client.get("/api/sounds/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["symbol"] == "a"
    assert data["example_word"] == "hot"
    assert data["category"] == "Vowels"
    assert data["audio_text"] == "hot"
    assert data["progress_percent"] == 20


def test_practice_sound_correct_and_mastery(client):
    """Test practicing a sound increments count, calculates progress percentage, and caps at 100% mastery."""
    # Practice sound 1 with correct=True
    resp1 = client.post("/api/sounds/1/practice", json={"correct": True})
    assert resp1.status_code == 200
    data1 = resp1.json()
    assert data1["sound_id"] == 1
    assert data1["practice_count"] == 2
    assert data1["correct_count"] == 2
    assert data1["progress_percent"] == 40
    assert data1["mastered"] is False

    # Practice 3 more correct times to reach 5 correct (100% progress)
    for _ in range(3):
        client.post("/api/sounds/1/practice", json={"correct": True})

    detail_resp = client.get("/api/sounds/1")
    assert detail_resp.status_code == 200
    data_final = detail_resp.json()
    assert data_final["progress_percent"] == 100
    assert data_final["mastered"] is True


def test_practice_nonexistent_sound(client):
    """Test practicing a non-existent sound returns 404."""
    response = client.post("/api/sounds/9999/practice", json={"correct": True})
    assert response.status_code == 404
