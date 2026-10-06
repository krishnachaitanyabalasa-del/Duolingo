from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.course import Course, Unit, Skill, Lesson, Exercise
from app.models.progress import UserSkillProgress, UserLessonProgress
from app.models.achievement import Achievement, UserAchievement


def seed_database(db: Session = None):
    close_db = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    try:
        # Check if already seeded
        if db.query(Course).first():
            print("Database already contains seed data.")
            return

        print("Seeding database...")

        # 1. Seed Users (including default learner and leaderboard entries)
        yesterday = date.today() - timedelta(days=1)

        learner = User(
            id=1,
            username="learner",
            email="learner@duolingo.clone",
            xp=120,
            streak=5,
            longest_streak=5,
            hearts=5,
            gems=100,
            last_activity_date=yesterday,
        )

        leaderboard_users = [
            learner,
            User(id=2, username="Alex", email="alex@example.com", xp=1250, streak=14, longest_streak=14, hearts=5, gems=350, last_activity_date=date.today()),
            User(id=3, username="Sarah", email="sarah@example.com", xp=980, streak=9, longest_streak=12, hearts=4, gems=200, last_activity_date=date.today()),
            User(id=4, username="Rahul", email="rahul@example.com", xp=750, streak=7, longest_streak=7, hearts=5, gems=150, last_activity_date=yesterday),
            User(id=5, username="Elena", email="elena@example.com", xp=90, streak=2, longest_streak=3, hearts=3, gems=80, last_activity_date=yesterday),
            User(id=6, username="David", email="david@example.com", xp=45, streak=1, longest_streak=1, hearts=5, gems=50, last_activity_date=date.today()),
        ]

        for u in leaderboard_users:
            db.add(u)
        db.commit()

        # 2. Seed Course, Units, Skills, Lessons, Exercises
        course = Course(
            id=1,
            title="English Course",
            description="Master English from basics to everyday conversations.",
            language_code="en",
            icon="🇬🇧",
        )
        db.add(course)
        db.commit()

        # Unit 1: Basics
        unit1 = Unit(
            id=1,
            course_id=course.id,
            title="Unit 1: Basics",
            description="Learn basic greetings, introductions, and food vocabulary.",
            order=1,
        )
        # Unit 2: Everyday Life
        unit2 = Unit(
            id=2,
            course_id=course.id,
            title="Unit 2: Everyday Life",
            description="Talk about family, places around town, and daily activities.",
            order=2,
        )
        db.add_all([unit1, unit2])
        db.commit()

        # Skills
        skill_greetings = Skill(id=1, unit_id=unit1.id, title="Greetings", description="Basic hello and goodbye", icon="👋", order=1)
        skill_introductions = Skill(id=2, unit_id=unit1.id, title="Introductions", description="Introduce yourself and ask names", icon="🤝", order=2)
        skill_food = Skill(id=3, unit_id=unit1.id, title="Food", description="Order food and identify drinks", icon="🍎", order=3)

        skill_family = Skill(id=4, unit_id=unit2.id, title="Family", description="Talk about family members", icon="👨‍👩‍👧‍👦", order=4)
        skill_places = Skill(id=5, unit_id=unit2.id, title="Places", description="Navigate places around town", icon="🏦", order=5)
        skill_activities = Skill(id=6, unit_id=unit2.id, title="Daily Activities", description="Express daily routines", icon="🏃", order=6)

        skills = [skill_greetings, skill_introductions, skill_food, skill_family, skill_places, skill_activities]
        db.add_all(skills)
        db.commit()

        # Lessons & Exercises for Skill 1: Greetings
        l1_greetings = Lesson(id=1, skill_id=skill_greetings.id, title="Basic Greetings", order=1, xp_reward=10)
        l2_greetings = Lesson(id=2, skill_id=skill_greetings.id, title="Goodbye & Farewells", order=2, xp_reward=10)

        # Lessons for Skill 2: Introductions
        l1_intro = Lesson(id=3, skill_id=skill_introductions.id, title="Names & Titles", order=1, xp_reward=10)
        l2_intro = Lesson(id=4, skill_id=skill_introductions.id, title="Origins & Countries", order=2, xp_reward=10)

        # Lessons for Skill 3: Food
        l1_food = Lesson(id=5, skill_id=skill_food.id, title="Common Foods", order=1, xp_reward=10)
        l2_food = Lesson(id=6, skill_id=skill_food.id, title="Ordering Food", order=2, xp_reward=10)

        # Lessons for Skill 4: Family
        l1_family = Lesson(id=7, skill_id=skill_family.id, title="Family Members", order=1, xp_reward=10)
        l2_family = Lesson(id=8, skill_id=skill_family.id, title="Describing Family", order=2, xp_reward=10)

        # Lessons for Skill 5: Places
        l1_places = Lesson(id=9, skill_id=skill_places.id, title="Around Town", order=1, xp_reward=10)

        # Lessons for Skill 6: Daily Activities
        l1_activities = Lesson(id=10, skill_id=skill_activities.id, title="Daily Routines", order=1, xp_reward=10)

        lessons = [l1_greetings, l2_greetings, l1_intro, l2_intro, l1_food, l2_food, l1_family, l2_family, l1_places, l1_activities]
        db.add_all(lessons)
        db.commit()

        # Seed Exercises demonstrating all 5 exercise types:
        # 1. MULTIPLE_CHOICE
        # 2. TRANSLATE
        # 3. MATCH_PAIRS
        # 4. FILL_BLANK
        # 5. TYPE_ANSWER

        exercises = [
            # Lesson 1: Basic Greetings (Skill 1)
            Exercise(
                id=1,
                lesson_id=l1_greetings.id,
                type="MULTIPLE_CHOICE",
                prompt="Select the correct translation for 'Hello'",
                content={"text": "Hello", "options": ["Hola", "Adiós", "Gracias", "Por favor"]},
                correct_answer="Hola",
                explanation="'Hola' is the Spanish translation for 'Hello'.",
                order=1,
            ),
            Exercise(
                id=2,
                lesson_id=l1_greetings.id,
                type="TRANSLATE",
                prompt="Translate this phrase into English",
                content={"text": "Buenos días, ¿cómo estás?", "hint": "Good morning..."},
                correct_answer="Good morning, how are you?",
                explanation="'Buenos días' means 'Good morning' and '¿cómo estás?' means 'how are you?'.",
                order=2,
            ),

            # Lesson 2: Goodbye & Farewells (Skill 1)
            Exercise(
                id=3,
                lesson_id=l2_greetings.id,
                type="TYPE_ANSWER",
                prompt="Type the English translation for 'Gracias'",
                content={"text": "Gracias"},
                correct_answer="Thank you",
                explanation="'Gracias' translates directly to 'Thank you'.",
                order=1,
            ),
            Exercise(
                id=4,
                lesson_id=l2_greetings.id,
                type="MATCH_PAIRS",
                prompt="Match the Spanish words with their English translations",
                content={"pairs": [
                    {"left": "Hola", "right": "Hello"},
                    {"left": "Adiós", "right": "Goodbye"},
                    {"left": "Gracias", "right": "Thank you"}
                ]},
                correct_answer=[
                    {"left": "Hola", "right": "Hello"},
                    {"left": "Adiós", "right": "Goodbye"},
                    {"left": "Gracias", "right": "Thank you"}
                ],
                explanation="Pair matching helps connect equivalent vocabulary terms.",
                order=2,
            ),

            # Lesson 3: Names & Titles (Skill 2)
            Exercise(
                id=5,
                lesson_id=l1_intro.id,
                type="FILL_BLANK",
                prompt="Fill in the missing word in the sentence",
                content={"sentence": "My name ___ Alex.", "options": ["am", "is", "are", "be"]},
                correct_answer="is",
                explanation="Third person singular takes 'is': 'My name is Alex'.",
                order=1,
            ),
            Exercise(
                id=6,
                lesson_id=l1_intro.id,
                type="TRANSLATE",
                prompt="Translate into English",
                content={"text": "Me llamo María."},
                correct_answer="My name is Maria",
                explanation="'Me llamo' literally means 'I call myself', idiomatically 'My name is'.",
                order=2,
            ),

            # Lesson 4: Origins & Countries (Skill 2)
            Exercise(
                id=7,
                lesson_id=l2_intro.id,
                type="MULTIPLE_CHOICE",
                prompt="Select the correct word to complete: 'Where ___ you from?'",
                content={"text": "Where ___ you from?", "options": ["is", "are", "do", "am"]},
                correct_answer="are",
                explanation="'Where are you from?' is the correct grammatical structure.",
                order=1,
            ),
            Exercise(
                id=8,
                lesson_id=l2_intro.id,
                type="TYPE_ANSWER",
                prompt="Type the translation: 'Soy de España.'",
                content={"text": "Soy de España."},
                correct_answer="I am from Spain",
                explanation="'Soy de' means 'I am from'.",
                order=2,
            ),

            # Lesson 5: Common Foods (Skill 3)
            Exercise(
                id=9,
                lesson_id=l1_food.id,
                type="MATCH_PAIRS",
                prompt="Match the food items with their translations",
                content={"pairs": [
                    {"left": "Apple", "right": "Manzana"},
                    {"left": "Water", "right": "Agua"},
                    {"left": "Bread", "right": "Pan"}
                ]},
                correct_answer=[
                    {"left": "Apple", "right": "Manzana"},
                    {"left": "Water", "right": "Agua"},
                    {"left": "Bread", "right": "Pan"}
                ],
                explanation="Matches food vocabulary.",
                order=1,
            ),
            Exercise(
                id=10,
                lesson_id=l1_food.id,
                type="FILL_BLANK",
                prompt="Fill in the blank: 'I would like an ___ please.'",
                content={"sentence": "I would like an ___ please.", "options": ["apple", "water", "bread", "milk"]},
                correct_answer="apple",
                explanation="An precedes vowel sounds (apple).",
                order=2,
            ),
        ]
        db.add_all(exercises)
        db.commit()

        # 3. Seed Learner Skill & Lesson Progress
        # Skill 1 (Greetings): COMPLETED (100%, 4 crowns)
        sp_greetings = UserSkillProgress(
            user_id=learner.id,
            skill_id=skill_greetings.id,
            status="COMPLETED",
            crown_level=4,
            progress_percentage=100.0,
            completed_at=datetime.utcnow() - timedelta(days=2),
        )
        lp1 = UserLessonProgress(user_id=learner.id, lesson_id=l1_greetings.id, is_completed=True, attempts_count=1, completed_at=datetime.utcnow() - timedelta(days=2))
        lp2 = UserLessonProgress(user_id=learner.id, lesson_id=l2_greetings.id, is_completed=True, attempts_count=1, completed_at=datetime.utcnow() - timedelta(days=2))

        # Skill 2 (Introductions): IN_PROGRESS (50%, 2 crowns)
        sp_intro = UserSkillProgress(
            user_id=learner.id,
            skill_id=skill_introductions.id,
            status="IN_PROGRESS",
            crown_level=2,
            progress_percentage=50.0,
        )
        lp3 = UserLessonProgress(user_id=learner.id, lesson_id=l1_intro.id, is_completed=True, attempts_count=1, completed_at=datetime.utcnow() - timedelta(days=1))
        lp4 = UserLessonProgress(user_id=learner.id, lesson_id=l2_intro.id, is_completed=False, attempts_count=0)

        # Skill 3 (Food): AVAILABLE (0%, 0 crowns)
        sp_food = UserSkillProgress(
            user_id=learner.id,
            skill_id=skill_food.id,
            status="AVAILABLE",
            crown_level=0,
            progress_percentage=0.0,
            unlocked_at=datetime.utcnow() - timedelta(days=1),
        )

        # Skills 4, 5, 6: LOCKED
        sp_family = UserSkillProgress(user_id=learner.id, skill_id=skill_family.id, status="LOCKED")
        sp_places = UserSkillProgress(user_id=learner.id, skill_id=skill_places.id, status="LOCKED")
        sp_activities = UserSkillProgress(user_id=learner.id, skill_id=skill_activities.id, status="LOCKED")

        db.add_all([sp_greetings, sp_intro, sp_food, sp_family, sp_places, sp_activities])
        db.add_all([lp1, lp2, lp3, lp4])
        db.commit()

        # 4. Seed Achievements & User Achievements
        achievements = [
            Achievement(id=1, code="wildfire", title="Wildfire", description="Reach a 3-day streak", icon="🔥", target_value=3),
            Achievement(id=2, code="overachiever", title="Overachiever", description="Earn 100 XP", icon="⚡", target_value=100),
            Achievement(id=3, code="scholar", title="Scholar", description="Complete 5 lessons", icon="🎓", target_value=5),
            Achievement(id=4, code="sharp_mind", title="Sharp Mind", description="Complete a lesson with full hearts", icon="🎯", target_value=1),
            Achievement(id=5, code="champion", title="Champion", description="Reach 500 XP", icon="🏆", target_value=500),
        ]
        db.add_all(achievements)
        db.commit()

        # Seed initial unlocked status for learner
        ua1 = UserAchievement(user_id=learner.id, achievement_id=1, progress=5, is_unlocked=True, unlocked_at=datetime.utcnow() - timedelta(days=1))
        ua2 = UserAchievement(user_id=learner.id, achievement_id=2, progress=120, is_unlocked=True, unlocked_at=datetime.utcnow() - timedelta(days=1))
        ua3 = UserAchievement(user_id=learner.id, achievement_id=3, progress=3, is_unlocked=False)
        ua4 = UserAchievement(user_id=learner.id, achievement_id=4, progress=1, is_unlocked=True, unlocked_at=datetime.utcnow() - timedelta(days=2))
        ua5 = UserAchievement(user_id=learner.id, achievement_id=5, progress=120, is_unlocked=False)

        db.add_all([ua1, ua2, ua3, ua4, ua5])
        db.commit()

        print("Database successfully seeded!")

    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_database()
