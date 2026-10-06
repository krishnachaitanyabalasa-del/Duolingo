from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.course import Course, Unit, Skill, Lesson, Exercise, UnitTest, TestExercise
from app.models.progress import UserUnitProgress, UserSkillProgress, UserLessonProgress, LessonAttempt, UserTestAttempt
from app.models.achievement import Achievement, UserAchievement
from app.models.sound import SoundCategory, Sound, UserSoundProgress


def seed_database(db: Session = None):
    close_db = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    try:
        print("Seeding database with 10-unit English Foundations course, Unit Tests, and Pronunciation Sounds...")

        # 1. Seed Users (Default Learner + Leaderboard entries)
        yesterday = date.today() - timedelta(days=1)

        learner = db.query(User).filter(User.id == 1).first()
        if not learner:
            learner = User(
                id=1,
                username="learner",
                display_name="krishnachaitanyabalasa",
                avatar_id="avatar_01",
                bio="Learning languages every day on Duolingo!",
                joined_date="Joined April 2025",
                email="learner@duolingo.clone",
                xp=120,
                streak=5,
                longest_streak=5,
                hearts=5,
                gems=6450,
                league="Amethyst",
                top_three_finishes=7,
                following_count=0,
                followers_count=1,
                last_activity_date=yesterday,
            )

            leaderboard_users = [
                learner,
                User(id=2, username="Orion", display_name="Orion Star", avatar_id="avatar_03", email="orion@example.com", xp=1250, streak=14, longest_streak=14, hearts=5, gems=350, last_activity_date=date.today()),
                User(id=3, username="Sarah", display_name="Sarah Miller", avatar_id="avatar_02", email="sarah@example.com", xp=980, streak=9, longest_streak=12, hearts=4, gems=200, last_activity_date=date.today()),
                User(id=4, username="Rahul", display_name="Rahul Sharma", avatar_id="avatar_04", email="rahul@example.com", xp=750, streak=7, longest_streak=7, hearts=5, gems=150, last_activity_date=yesterday),
                User(id=5, username="Elena", display_name="Elena Rostova", avatar_id="avatar_05", email="elena@example.com", xp=90, streak=2, longest_streak=3, hearts=3, gems=80, last_activity_date=yesterday),
                User(id=6, username="David", display_name="David Chen", avatar_id="avatar_06", email="david@example.com", xp=45, streak=1, longest_streak=1, hearts=5, gems=50, last_activity_date=date.today()),
            ]
            db.add_all(leaderboard_users)
            db.commit()

        # 2. Seed Course, Units, Skills, Lessons, Exercises, and Unit Tests
        course = db.query(Course).filter(Course.id == 1).first()
        if not course:
            course = Course(
                id=1,
                title="English Foundations",
                description="Master English foundations from basics to advanced communication.",
                language_code="en",
                icon="🇬🇧",
            )
            db.add(course)
            db.commit()

        UNITS_CONFIG = [
            {
                "id": 1,
                "title": "UNIT 1 — BASICS",
                "description": "Learn greetings, introductions, and essential words.",
                "skills": [
                    ("Greetings", "Basic hello, goodbye, and polite phrases", "👋"),
                    ("Introductions", "Introduce yourself and meet others", "🤝"),
                    ("Basic Words", "Essential everyday vocabulary", "📚"),
                ]
            },
            {
                "id": 2,
                "title": "UNIT 2 — EVERYDAY ENGLISH",
                "description": "Talk about food, drinks, and daily routines.",
                "skills": [
                    ("Food & Drinks", "Express food preferences and meals", "🍎"),
                    ("Daily Activities", "Talk about daily routines and actions", "🏃"),
                ]
            },
            {
                "id": 3,
                "title": "UNIT 3 — PEOPLE & PLACES",
                "description": "Discuss family members, places around town, and directions.",
                "skills": [
                    ("Family", "Talk about relatives and family members", "👨‍👩‍👧"),
                    ("Places", "Identify places in a city or town", "🏙️"),
                    ("Directions", "Ask for and give directions", "🗺️"),
                ]
            },
            {
                "id": 4,
                "title": "UNIT 4 — DAILY CONVERSATIONS",
                "description": "Ask questions, give answers, and have basic conversations.",
                "skills": [
                    ("Questions", "Form basic questions in English", "❓"),
                    ("Answers", "Give clear responses and statements", "💬"),
                    ("Conversations", "Hold everyday dialogs", "🗣️"),
                ]
            },
            {
                "id": 5,
                "title": "UNIT 5 — SHOPPING",
                "description": "Learn vocabulary for money, clothes, and store interactions.",
                "skills": [
                    ("Money", "Prices, currency, and paying", "💵"),
                    ("Clothes", "Clothing items and sizes", "👕"),
                    ("Shopping Conversations", "Store interactions and asking for help", "🛍️"),
                ]
            },
            {
                "id": 6,
                "title": "UNIT 6 — TRAVEL",
                "description": "Navigate airports, book hotels, and use transportation.",
                "skills": [
                    ("Airport", "Check-in, boarding, and luggage", "✈️"),
                    ("Hotel", "Reservations and hotel amenities", "🏨"),
                    ("Transportation", "Buses, trains, taxis, and routes", "🚌"),
                ]
            },
            {
                "id": 7,
                "title": "UNIT 7 — WORK & SCHOOL",
                "description": "Discuss school subjects, jobs, and workplace tasks.",
                "skills": [
                    ("School", "Classes, homework, and studies", "🎓"),
                    ("Jobs", "Professions and career titles", "💼"),
                    ("Workplace", "Office routines and teamwork", "🏢"),
                ]
            },
            {
                "id": 8,
                "title": "UNIT 8 — FOOD & RESTAURANTS",
                "description": "Order meals, understand menus, and talk about cooking.",
                "skills": [
                    ("Restaurant", "Dining out and ordering", "🍽️"),
                    ("Ordering Food", "Customizing orders and bills", "📝"),
                    ("Cooking", "Ingredients, recipes, and kitchen", "🍳"),
                ]
            },
            {
                "id": 9,
                "title": "UNIT 9 — HEALTH & LIFE",
                "description": "Describe body parts, health concerns, and wellness.",
                "skills": [
                    ("Body", "Body parts and physical appearance", "🦵"),
                    ("Health", "Symptoms, doctors, and medicine", "🩺"),
                    ("Daily Life", "Habits, health, and lifestyle", "🌱"),
                ]
            },
            {
                "id": 10,
                "title": "UNIT 10 — ADVANCED CONVERSATIONS",
                "description": "Master longer sentences, complex dialogs, and final review.",
                "skills": [
                    ("Longer Sentences", "Compound and complex sentence building", "✍️"),
                    ("Advanced Conversations", "Fluent dialogs and expressions", "🗣️"),
                    ("Review", "Comprehensive English Foundations review", "⭐"),
                ]
            },
        ]

        # Seed units, skills, lessons, exercises, and unit tests if unit count < 10
        if db.query(Unit).count() < 10:
            skill_global_id = 1
            lesson_global_id = 1
            exercise_global_id = 1
            test_global_id = 1
            test_ex_global_id = 1

            for u_idx, u_conf in enumerate(UNITS_CONFIG, start=1):
                unit = db.query(Unit).filter(Unit.id == u_conf["id"]).first()
                if not unit:
                    unit = Unit(
                        id=u_conf["id"],
                        course_id=course.id,
                        title=u_conf["title"],
                        description=u_conf["description"],
                        order=u_idx
                    )
                    db.add(unit)
                    db.commit()

                # Add skills for this unit
                unit_skills = []
                for s_idx, (s_title, s_desc, s_icon) in enumerate(u_conf["skills"], start=1):
                    skill = db.query(Skill).filter(Skill.id == skill_global_id).first()
                    if not skill:
                        skill = Skill(
                            id=skill_global_id,
                            unit_id=unit.id,
                            title=s_title,
                            description=s_desc,
                            icon=s_icon,
                            order=s_idx
                        )
                        db.add(skill)
                        db.commit()
                    unit_skills.append(skill)
                    skill_global_id += 1

                    # Add 2 lessons per skill
                    for l_idx in range(1, 3):
                        lesson = db.query(Lesson).filter(Lesson.id == lesson_global_id).first()
                        if not lesson:
                            lesson = Lesson(
                                id=lesson_global_id,
                                skill_id=skill.id,
                                title=f"{s_title} {l_idx}",
                                order=l_idx,
                                xp_reward=10
                            )
                            db.add(lesson)
                            db.commit()

                        # Add 6 exercises per lesson
                        if db.query(Exercise).filter(Exercise.lesson_id == lesson.id).count() == 0:
                            if lesson.id == 1:
                                exercises = [
                                    Exercise(
                                        id=1,
                                        lesson_id=1,
                                        type="MULTIPLE_CHOICE",
                                        prompt="What does 'Hello' mean?",
                                        content={"options": ["Hi", "Goodbye", "Thank you", "Please"]},
                                        correct_answer="Hi",
                                        order=1
                                    ),
                                    Exercise(
                                        id=2,
                                        lesson_id=1,
                                        type="TRANSLATE",
                                        prompt="Translate: Hello",
                                        content={"text": "Hello", "word_bank": ["Hello", "Goodbye", "Thank", "You"]},
                                        correct_answer=["Hello"],
                                        order=2
                                    ),
                                    Exercise(
                                        id=3,
                                        lesson_id=1,
                                        type="FILL_BLANK",
                                        prompt="Good _____!",
                                        content={"sentence": "Good _____!", "options": ["morning", "night", "bad", "hello"]},
                                        correct_answer="morning",
                                        order=3
                                    ),
                                    Exercise(
                                        id=4,
                                        lesson_id=1,
                                        type="TYPE_ANSWER",
                                        prompt="Type the English word for 'Hola'.",
                                        content={"text": "Hola", "speak_text": "Hola"},
                                        correct_answer="Hello",
                                        order=4
                                    ),
                                    Exercise(
                                        id=5,
                                        lesson_id=1,
                                        type="MATCH_PAIRS",
                                        prompt="Match the pairs",
                                        content={"pairs": [{"left": "Hello", "right": "Hola"}, {"left": "Goodbye", "right": "Adiós"}, {"left": "Thank you", "right": "Gracias"}, {"left": "Please", "right": "Por favor"}]},
                                        correct_answer=[{"left": "Hello", "right": "Hola"}, {"left": "Goodbye", "right": "Adiós"}, {"left": "Thank you", "right": "Gracias"}, {"left": "Please", "right": "Por favor"}],
                                        order=5
                                    ),
                                    Exercise(
                                        id=6,
                                        lesson_id=1,
                                        type="MULTIPLE_CHOICE",
                                        prompt="Select the best phrase for Greetings",
                                        content={"options": ["Good morning", "Night", "Bad", "No"]},
                                        correct_answer="Good morning",
                                        order=6
                                    ),
                                    Exercise(
                                        id=7,
                                        lesson_id=1,
                                        type="TRANSLATE",
                                        prompt="Translate: Goodbye",
                                        content={"text": "Goodbye", "word_bank": ["Goodbye", "Hello", "Thanks", "Bye"]},
                                        correct_answer="Goodbye",
                                        order=7
                                    ),
                                    Exercise(
                                        id=8,
                                        lesson_id=1,
                                        type="TYPE_ANSWER",
                                        prompt="Type: Thank you",
                                        content={"text": "Thank you", "speak_text": "Thank you"},
                                        correct_answer="thank you",
                                        order=8
                                    ),
                                ]
                                db.add_all(exercises)
                                db.commit()
                                exercise_global_id = 9
                            else:
                                exercises = [
                                    Exercise(
                                        id=exercise_global_id,
                                        lesson_id=lesson.id,
                                        type="MULTIPLE_CHOICE",
                                        prompt=f"What is the correct translation for '{s_title}' in lesson {l_idx}?",
                                        content={"options": [s_title, "Goodbye", "Thank you", "Please"]},
                                        correct_answer=s_title,
                                        order=1
                                    ),
                                    Exercise(
                                        id=exercise_global_id + 1,
                                        lesson_id=lesson.id,
                                        type="TRANSLATE",
                                        prompt=f"Translate 'Hello' to English",
                                        content={"text": "Hello", "word_bank": ["Hello", "Goodbye", "Hi", "Thanks", "Please", "Morning"]},
                                        correct_answer="Hello",
                                        order=2
                                    ),
                                    Exercise(
                                        id=exercise_global_id + 2,
                                        lesson_id=lesson.id,
                                        type="FILL_BLANK",
                                        prompt=f"Complete: _____ you tomorrow",
                                        content={"sentence": "_____ you tomorrow", "options": ["See", "Eat", "Run", "Sleep"]},
                                        correct_answer="See",
                                        order=3
                                    ),
                                    Exercise(
                                        id=exercise_global_id + 3,
                                        lesson_id=lesson.id,
                                        type="TYPE_ANSWER",
                                        prompt=f"Type the English word for 'Hello'",
                                        content={"text": "Hello", "speak_text": "Hello"},
                                        correct_answer="hello",
                                        order=4
                                    ),
                                    Exercise(
                                        id=exercise_global_id + 4,
                                        lesson_id=lesson.id,
                                        type="MATCH_PAIRS",
                                        prompt="Match the matching English word pairs",
                                        content={"pairs": [{"left": "Hello", "right": "Hi"}, {"left": "Bye", "right": "Goodbye"}]},
                                        correct_answer=[{"left": "Hello", "right": "Hi"}, {"left": "Bye", "right": "Goodbye"}],
                                        order=5
                                    ),
                                    Exercise(
                                        id=exercise_global_id + 5,
                                        lesson_id=lesson.id,
                                        type="MULTIPLE_CHOICE",
                                        prompt=f"Select the best phrase for {s_title}",
                                        content={"options": ["Good morning", "Night", "Bad", "No"]},
                                        correct_answer="Good morning",
                                        order=6
                                    ),
                                ]
                            db.add_all(exercises)
                            db.commit()
                            exercise_global_id += 6
                        else:
                            exercise_global_id += 6

                        lesson_global_id += 1

                # Seed Unit Test for this unit
                unit_test = db.query(UnitTest).filter(UnitTest.unit_id == unit.id).first()
                if not unit_test:
                    unit_test = UnitTest(
                        id=u_conf["id"],
                        unit_id=unit.id,
                        title=f"{u_conf['title']} Test",
                        description=f"Pass this test to unlock the next unit in English Foundations!",
                        passing_score_percentage=80.0,
                        xp_reward=50
                    )
                    db.add(unit_test)
                    db.commit()

                    # Add 10 questions covering all 5 exercise types
                    test_exs = [
                        TestExercise(
                            id=test_ex_global_id,
                            test_id=unit_test.id,
                            type="MULTIPLE_CHOICE",
                            prompt=f"Unit {u_conf['id']} Review: What is the main meaning of 'Hello'?",
                            content={"options": ["Hello", "Goodbye", "Sorry", "No"]},
                            correct_answer="Hello",
                            order=1
                        ),
                        TestExercise(
                            id=test_ex_global_id + 1,
                            test_id=unit_test.id,
                            type="TRANSLATE",
                            prompt=f"Translate: 'Good morning'",
                            content={"text": "Good morning"},
                            correct_answer="Good morning",
                            order=2
                        ),
                        TestExercise(
                            id=test_ex_global_id + 2,
                            test_id=unit_test.id,
                            type="FILL_BLANK",
                            prompt="Fill in the blank: How _____ you today?",
                            content={"sentence": "How _____ you today?", "options": ["are", "is", "am", "be"]},
                            correct_answer="are",
                            order=3
                        ),
                        TestExercise(
                            id=test_ex_global_id + 3,
                            test_id=unit_test.id,
                            type="TYPE_ANSWER",
                            prompt="Type the opposite of 'bad':",
                            content={},
                            correct_answer="good",
                            order=4
                        ),
                        TestExercise(
                            id=test_ex_global_id + 4,
                            test_id=unit_test.id,
                            type="MATCH_PAIRS",
                            prompt="Match English greetings:",
                            content={"pairs": [{"left": "Hi", "right": "Hello"}, {"left": "Thanks", "right": "Thank you"}]},
                            correct_answer=[{"left": "Hi", "right": "Hello"}, {"left": "Thanks", "right": "Thank you"}],
                            order=5
                        ),
                        TestExercise(
                            id=test_ex_global_id + 5,
                            test_id=unit_test.id,
                            type="MULTIPLE_CHOICE",
                            prompt="Which response is polite when receiving a gift?",
                            content={"options": ["Thank you!", "No way", "Go away", "Stop"]},
                            correct_answer="Thank you!",
                            order=6
                        ),
                        TestExercise(
                            id=test_ex_global_id + 6,
                            test_id=unit_test.id,
                            type="TRANSLATE",
                            prompt="Translate: 'Nice to meet you'",
                            content={"text": "Nice to meet you"},
                            correct_answer="Nice to meet you",
                            order=7
                        ),
                        TestExercise(
                            id=test_ex_global_id + 7,
                            test_id=unit_test.id,
                            type="FILL_BLANK",
                            prompt="Complete the sentence: Have a _____ day!",
                            content={"sentence": "Have a _____ day!", "options": ["nice", "sad", "cold", "bad"]},
                            correct_answer="nice",
                            order=8
                        ),
                        TestExercise(
                            id=test_ex_global_id + 8,
                            test_id=unit_test.id,
                            type="TYPE_ANSWER",
                            prompt="Type the English word for 'Goodbye':",
                            content={},
                            correct_answer="goodbye",
                            order=9
                        ),
                        TestExercise(
                            id=test_ex_global_id + 9,
                            test_id=unit_test.id,
                            type="MULTIPLE_CHOICE",
                            prompt="What do you say before going to sleep at night?",
                            content={"options": ["Good night", "Good morning", "Happy birthday", "Welcome"]},
                            correct_answer="Good night",
                            order=10
                        ),
                    ]
                    db.add_all(test_exs)
                    db.commit()
                    test_ex_global_id += 10

        # 3. Initialize default user unit progress (Unit 1 AVAILABLE, Units 2-10 LOCKED)
        all_units = db.query(Unit).order_by(Unit.order.asc()).all()
        for idx, u in enumerate(all_units):
            u_prog = db.query(UserUnitProgress).filter(UserUnitProgress.user_id == learner.id, UserUnitProgress.unit_id == u.id).first()
            if not u_prog:
                status = "AVAILABLE" if idx == 0 else "LOCKED"
                db.add(UserUnitProgress(user_id=learner.id, unit_id=u.id, status=status, progress_percentage=0.0))
        db.commit()

        # 4. Seed Achievements & User Achievements
        if db.query(Achievement).count() == 0:
            achievements = [
                Achievement(id=1, code="wildfire", title="Wildfire", description="Reach a 3-day streak", icon="🔥", target_value=3),
                Achievement(id=2, code="overachiever", title="Overachiever", description="Earn 100 XP", icon="⚡", target_value=100),
                Achievement(id=3, code="scholar", title="Scholar", description="Complete 5 lessons", icon="🎓", target_value=5),
                Achievement(id=4, code="sharp_mind", title="Sharp Mind", description="Complete a lesson with full hearts", icon="🎯", target_value=1),
                Achievement(id=5, code="champion", title="Champion", description="Reach 500 XP", icon="🏆", target_value=500),
            ]
            db.add_all(achievements)
            db.commit()

            ua1 = UserAchievement(user_id=learner.id, achievement_id=1, progress=5, is_unlocked=True, unlocked_at=datetime.utcnow() - timedelta(days=1))
            ua2 = UserAchievement(user_id=learner.id, achievement_id=2, progress=120, is_unlocked=True, unlocked_at=datetime.utcnow() - timedelta(days=1))
            ua3 = UserAchievement(user_id=learner.id, achievement_id=3, progress=4, is_unlocked=False)
            ua4 = UserAchievement(user_id=learner.id, achievement_id=4, progress=1, is_unlocked=True, unlocked_at=datetime.utcnow() - timedelta(days=2))
            ua5 = UserAchievement(user_id=learner.id, achievement_id=5, progress=120, is_unlocked=False)

            db.add_all([ua1, ua2, ua3, ua4, ua5])
            db.commit()

        # 5. Seed Pronunciation Sound Categories & Sounds
        if db.query(SoundCategory).count() == 0:
            cat_vowels = SoundCategory(id=1, name="Vowels", slug="vowels", display_order=1)
            cat_consonants = SoundCategory(id=2, name="Consonants", slug="consonants", display_order=2)
            db.add_all([cat_vowels, cat_consonants])
            db.commit()

        cat_vowels = db.query(SoundCategory).filter(SoundCategory.id == 1).first()
        cat_consonants = db.query(SoundCategory).filter(SoundCategory.id == 2).first()

        if db.query(Sound).count() == 0:
            vowels_data = [
                ("a", "hot"), ("æ", "cat"), ("ʌ", "but"), ("ɛ", "bed"), ("eɪ", "say"),
                ("ɝ", "bird"), ("ɪ", "ship"), ("i", "sheep"), ("ə", "about"), ("oʊ", "boat"),
                ("ʊ", "foot"), ("u", "food"), ("aʊ", "cow"), ("aɪ", "time"), ("ɔɪ", "boy")
            ]

            consonants_data = [
                ("b", "book"), ("tʃ", "chair"), ("d", "day"), ("f", "fish"), ("g", "go"),
                ("h", "home"), ("dʒ", "job"), ("k", "key"), ("l", "lion"), ("m", "moon"),
                ("n", "nose"), ("ŋ", "sing"), ("p", "pig"), ("r", "red"), ("s", "see"),
                ("ʒ", "measure"), ("ʃ", "shoe"), ("t", "time"), ("ð", "then"), ("θ", "think"),
                ("v", "very"), ("w", "water"), ("j", "you"), ("z", "zoo")
            ]

            vowel_sounds = []
            for i, (sym, word) in enumerate(vowels_data, start=1):
                vowel_sounds.append(
                    Sound(
                        id=i,
                        category_id=cat_vowels.id,
                        symbol=sym,
                        example_word=word,
                        audio_text=word,
                        display_order=i,
                        is_active=True,
                    )
                )

            consonant_sounds = []
            for j, (sym, word) in enumerate(consonants_data, start=16):
                consonant_sounds.append(
                    Sound(
                        id=j,
                        category_id=cat_consonants.id,
                        symbol=sym,
                        example_word=word,
                        audio_text=word,
                        display_order=j,
                        is_active=True,
                    )
                )

            db.add_all(vowel_sounds)
            db.add_all(consonant_sounds)
            db.commit()

        if db.query(UserSoundProgress).filter(UserSoundProgress.user_id == learner.id).count() == 0:
            initial_sound_progress = [
                UserSoundProgress(user_id=learner.id, sound_id=1, practice_count=1, correct_count=1, incorrect_count=0, progress_percent=20, mastered=False),
                UserSoundProgress(user_id=learner.id, sound_id=2, practice_count=2, correct_count=2, incorrect_count=0, progress_percent=40, mastered=False),
                UserSoundProgress(user_id=learner.id, sound_id=3, practice_count=1, correct_count=0, incorrect_count=1, progress_percent=10, mastered=False),
                UserSoundProgress(user_id=learner.id, sound_id=4, practice_count=2, correct_count=1, incorrect_count=1, progress_percent=30, mastered=False),
                UserSoundProgress(user_id=learner.id, sound_id=5, practice_count=0, correct_count=0, incorrect_count=0, progress_percent=0, mastered=False),
            ]
            db.add_all(initial_sound_progress)
            db.commit()

        print("Successfully seeded 10-unit English Foundations course with Unit Tests and Pronunciation Sounds!")

    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_database()
