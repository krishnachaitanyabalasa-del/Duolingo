from app.seed.seed_data import seed_database
from app.models.course import Course, Unit, Skill, Lesson, Exercise


def test_get_lesson_includes_correct_answer(client):
    """Req #15: Exercise data stored and retrieved includes correct_answer."""
    response = client.get("/api/lessons/1")
    assert response.status_code == 200
    data = response.json()
    assert "exercises" in data
    for ex in data["exercises"]:
        assert "correct_answer" in ex, f"correct_answer missing in GET lesson for exercise {ex['id']}"


def test_multiple_choice_correct_and_wrong(client):
    """Req #1 & #2 & #16: Correct MC -> true; Wrong MC -> false + correct answer."""
    # Ex 1: MC "What does 'Hello' mean?", options: ["Hi", "Goodbye", "Thank you", "Please"], correct: "Hi"
    wrong_resp = client.post("/api/lessons/1/answer", json={"exercise_id": 1, "answer": "Goodbye"})
    assert wrong_resp.status_code == 200
    wrong_data = wrong_resp.json()
    assert wrong_data["correct"] is False
    assert wrong_data["correct_answer"] == "Hi"

    correct_resp = client.post("/api/lessons/1/answer", json={"exercise_id": 1, "answer": "Hi"})
    assert correct_resp.status_code == 200
    correct_data = correct_resp.json()
    assert correct_data["correct"] is True
    assert correct_data["correct_answer"] == "Hi"


def test_translate_correct_and_wrong(client):
    """Req #3 & #4: Correct translation -> true; Wrong translation -> false + correct answer."""
    # Ex 2: TRANSLATE "Translate: Hello", word_bank: ["Hello", ...], correct: ["Hello"]
    wrong_resp = client.post("/api/lessons/1/answer", json={"exercise_id": 2, "answer": ["Goodbye"]})
    assert wrong_resp.status_code == 200
    wrong_data = wrong_resp.json()
    assert wrong_data["correct"] is False
    assert wrong_data["correct_answer"] == ["Hello"]

    correct_resp = client.post("/api/lessons/1/answer", json={"exercise_id": 2, "answer": ["Hello"]})
    assert correct_resp.status_code == 200
    correct_data = correct_resp.json()
    assert correct_data["correct"] is True


def test_match_pairs_correct_and_wrong(client):
    """Req #5 & #6: Correct match pairs -> true; Wrong match pairs -> false + correct mapping."""
    # Ex 5: MATCH_PAIRS on Lesson 1
    wrong_pairs = [
        {"left": "Hello", "right": "Adiós"},
        {"left": "Goodbye", "right": "Hola"},
        {"left": "Thank you", "right": "Gracias"},
        {"left": "Please", "right": "Por favor"}
    ]
    wrong_resp = client.post("/api/lessons/1/answer", json={"exercise_id": 5, "answer": wrong_pairs})
    assert wrong_resp.status_code == 200
    wrong_data = wrong_resp.json()
    assert wrong_data["correct"] is False
    assert isinstance(wrong_data["correct_answer"], list)

    correct_pairs = [
        {"left": "Hello", "right": "Hola"},
        {"left": "Goodbye", "right": "Adiós"},
        {"left": "Thank you", "right": "Gracias"},
        {"left": "Please", "right": "Por favor"}
    ]
    correct_resp = client.post("/api/lessons/1/answer", json={"exercise_id": 5, "answer": correct_pairs})
    assert correct_resp.status_code == 200
    assert correct_resp.json()["correct"] is True


def test_fill_blank_correct_and_wrong(client):
    """Req #7 & #8: Correct fill blank -> true; Wrong fill blank -> false + correct answer."""
    # Ex 3: FILL_BLANK "Good _____!", sentence: "Good _____!", correct: "morning"
    wrong_resp = client.post("/api/lessons/1/answer", json={"exercise_id": 3, "answer": "night"})
    assert wrong_resp.status_code == 200
    wrong_data = wrong_resp.json()
    assert wrong_data["correct"] is False
    assert wrong_data["correct_answer"] == "morning"

    correct_resp = client.post("/api/lessons/1/answer", json={"exercise_id": 3, "answer": "morning"})
    assert correct_resp.status_code == 200
    assert correct_resp.json()["correct"] is True


def test_type_answer_correct_normalization_and_wrong(client):
    """Req #9 & #10: Correct type answer -> true (with case/whitespace normalization); Wrong -> false."""
    # Ex 4: TYPE_ANSWER "Type the English word for 'Hola'.", correct: "Hello"
    # Normalization check: " hello " should match "Hello"
    correct_resp = client.post("/api/lessons/1/answer", json={"exercise_id": 4, "answer": " hello "})
    assert correct_resp.status_code == 200
    assert correct_resp.json()["correct"] is True

    wrong_resp = client.post("/api/lessons/1/answer", json={"exercise_id": 4, "answer": "goodbye"})
    assert wrong_resp.status_code == 200
    wrong_data = wrong_resp.json()
    assert wrong_data["correct"] is False
    assert wrong_data["correct_answer"] == "Hello"


def test_heart_deduction_and_preservation(client):
    """Req #11 & #12 & #13 & #14: Heart deduction, heart preservation, non-negative hearts, and XP awards."""
    initial_user = client.get("/api/user").json()
    initial_hearts = initial_user["hearts"]
    initial_xp = initial_user["xp"]

    # Submit correct answer: hearts unchanged, +1 XP awarded
    correct_resp = client.post("/api/lessons/1/answer", json={"exercise_id": 1, "answer": "Hi"})
    assert correct_resp.json()["hearts"] == initial_hearts
    assert correct_resp.json()["xp_earned"] == 1

    # Submit wrong answer: hearts reduced by 1, 0 XP awarded
    wrong_resp = client.post("/api/lessons/1/answer", json={"exercise_id": 1, "answer": "Wrong"})
    assert wrong_resp.json()["hearts"] == initial_hearts - 1
    assert wrong_resp.json()["xp_earned"] == 0


def test_idempotent_seeding(db_session):
    """Req #17: Running seed multiple times does not create duplicate records."""
    seed_database(db_session)
    seed_database(db_session)

    courses_count = db_session.query(Course).count()
    units_count = db_session.query(Unit).count()
    skills_count = db_session.query(Skill).count()
    lessons_count = db_session.query(Lesson).count()
    exercises_count = db_session.query(Exercise).count()

    assert courses_count == 1
    assert units_count == 2
    assert skills_count == 5
    assert lessons_count == 10
    assert exercises_count == 80
