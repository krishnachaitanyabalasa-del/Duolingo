from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.course import Course, Unit, Skill, Lesson, Exercise
from app.models.progress import UserSkillProgress, UserLessonProgress, LessonAttempt
from app.models.achievement import Achievement, UserAchievement
from app.models.sound import SoundCategory, Sound, UserSoundProgress


def seed_database(db: Session = None):
    close_db = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    try:
        print("Seeding database with English Foundations course data and Pronunciation Sounds...")

        # Check if database is already seeded with user and sound categories
        if db.query(User).filter(User.id == 1).first() is not None and db.query(SoundCategory).count() > 0:
            print("Database already seeded. Preserving existing records.")
            return


        # 1. Seed Users (Default Learner + Leaderboard entries)
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
        db.add_all(leaderboard_users)
        db.commit()

        # 2. Seed Course, Units, Skills, Lessons
        course = Course(
            id=1,
            title="English Foundations",
            description="Master English foundations from basics to everyday communication.",
            language_code="en",
            icon="🇬🇧",
        )
        db.add(course)
        db.commit()

        # Units
        unit1 = Unit(id=1, course_id=course.id, title="UNIT 1 — BASICS", description="Learn greetings, introductions, and essential words.", order=1)
        unit2 = Unit(id=2, course_id=course.id, title="UNIT 2 — EVERYDAY ENGLISH", description="Talk about food, drinks, and daily activities.", order=2)
        db.add_all([unit1, unit2])
        db.commit()

        # Skills (5 total)
        skill1 = Skill(id=1, unit_id=unit1.id, title="Greetings", description="Basic hello, goodbye, and polite phrases", icon="👋", order=1)
        skill2 = Skill(id=2, unit_id=unit1.id, title="Introductions", description="Introduce yourself and meet others", icon="🤝", order=2)
        skill3 = Skill(id=3, unit_id=unit1.id, title="Basic Words", description="Essential everyday vocabulary", icon="📚", order=3)

        skill4 = Skill(id=4, unit_id=unit2.id, title="Food & Drinks", description="Express food preferences and meals", icon="🍎", order=4)
        skill5 = Skill(id=5, unit_id=unit2.id, title="Daily Activities", description="Talk about daily routines and actions", icon="🏃", order=5)

        skills = [skill1, skill2, skill3, skill4, skill5]
        db.add_all(skills)
        db.commit()

        # Lessons (2 per skill = 10 lessons)
        l1 = Lesson(id=1, skill_id=skill1.id, title="Basic Greetings", order=1, xp_reward=10)
        l2 = Lesson(id=2, skill_id=skill1.id, title="Greeting Conversations", order=2, xp_reward=10)

        l3 = Lesson(id=3, skill_id=skill2.id, title="Personal Info", order=1, xp_reward=10)
        l4 = Lesson(id=4, skill_id=skill2.id, title="Meeting People", order=2, xp_reward=10)

        l5 = Lesson(id=5, skill_id=skill3.id, title="Essential Words", order=1, xp_reward=10)
        l6 = Lesson(id=6, skill_id=skill3.id, title="Objects & Nouns", order=2, xp_reward=10)

        l7 = Lesson(id=7, skill_id=skill4.id, title="Food & Drinks", order=1, xp_reward=10)
        l8 = Lesson(id=8, skill_id=skill4.id, title="Meals & Orders", order=2, xp_reward=10)

        l9 = Lesson(id=9, skill_id=skill5.id, title="Routines", order=1, xp_reward=10)
        l10 = Lesson(id=10, skill_id=skill5.id, title="Daily Actions", order=2, xp_reward=10)

        lessons = [l1, l2, l3, l4, l5, l6, l7, l8, l9, l10]
        db.add_all(lessons)
        db.commit()

        # 3. Seed 8 Exercises per Lesson (80 total exercises covering ALL 5 types in every lesson)
        exercises = [
            # ==========================================
            # LESSON 1: Basic Greetings (Skill 1)
            # ==========================================
            Exercise(
                id=1, lesson_id=l1.id, type="MULTIPLE_CHOICE",
                prompt="What does 'Hello' mean?",
                content={"question": "What does 'Hello' mean?", "text": "Hello", "options": ["Hi", "Goodbye", "Thank you", "Please"], "speak_text": "Hello"},
                correct_answer="Hi", explanation="'Hello' is a standard greeting, equivalent to 'Hi'.", order=1
            ),
            Exercise(
                id=2, lesson_id=l1.id, type="TRANSLATE",
                prompt="Translate: Hello",
                content={"question": "Translate: Hello", "text": "Hello", "word_bank": ["Hello", "Goodbye", "Please", "Thanks"], "speak_text": "Hello"},
                correct_answer=["Hello"], explanation="'Hello' translates directly to 'Hello'.", order=2
            ),
            Exercise(
                id=3, lesson_id=l1.id, type="FILL_BLANK",
                prompt="Fill in the blank: Good _____!",
                content={"question": "Fill in the blank", "sentence": "Good _____!", "options": ["morning", "name", "food", "book"], "speak_text": "Good morning!"},
                correct_answer="morning", explanation="'Good morning!' is a standard morning greeting.", order=3
            ),
            Exercise(
                id=4, lesson_id=l1.id, type="TYPE_ANSWER",
                prompt="Type the English word for 'Hola'.",
                content={"question": "Type the English word for 'Hola'.", "text": "Hola", "speak_text": "Hello"},
                correct_answer="Hello", explanation="'Hola' translates to 'Hello'.", order=4
            ),
            Exercise(
                id=5, lesson_id=l1.id, type="MATCH_PAIRS",
                prompt="Match the greeting pairs",
                content={"question": "Match the pairs", "pairs": [{"left": "Hello", "right": "Hola"}, {"left": "Goodbye", "right": "Adiós"}, {"left": "Thank you", "right": "Gracias"}, {"left": "Please", "right": "Por favor"}]},
                correct_answer=[{"left": "Hello", "right": "Hola"}, {"left": "Goodbye", "right": "Adiós"}, {"left": "Thank you", "right": "Gracias"}, {"left": "Please", "right": "Por favor"}],
                explanation="Matches English greetings with Spanish equivalents.", order=5
            ),
            Exercise(
                id=6, lesson_id=l1.id, type="MULTIPLE_CHOICE",
                prompt="How do you say 'Good evening'?",
                content={"question": "How do you say 'Good evening'?", "text": "Good evening", "options": ["Good evening", "Good night", "Goodbye", "Good morning"], "speak_text": "Good evening"},
                correct_answer="Good evening", explanation="'Good evening' is used when greeting someone in the evening.", order=6
            ),
            Exercise(
                id=7, lesson_id=l1.id, type="TRANSLATE",
                prompt="Translate: Thank you",
                content={"question": "Translate: Thank you", "text": "Thank you", "word_bank": ["Thank", "you", "Hello", "Bye"], "speak_text": "Thank you"},
                correct_answer=["Thank", "you"], explanation="'Thank you' expresses gratitude.", order=7
            ),
            Exercise(
                id=8, lesson_id=l1.id, type="FILL_BLANK",
                prompt="Fill in the blank: See you _____!",
                content={"question": "Fill in the blank", "sentence": "See you _____!", "options": ["later", "apple", "night", "water"], "speak_text": "See you later!"},
                correct_answer="later", explanation="'See you later!' is a polite farewell.", order=8
            ),

            # ==========================================
            # LESSON 2: Greeting Conversations (Skill 1)
            # ==========================================
            Exercise(
                id=9, lesson_id=l2.id, type="TRANSLATE",
                prompt="Translate: Good morning! How are you?",
                content={"question": "Translate: Good morning! How are you?", "text": "Good morning! How are you?", "word_bank": ["Good", "morning", "How", "are", "you", "thanks"], "speak_text": "Good morning! How are you?"},
                correct_answer=["Good", "morning", "How", "are", "you"], explanation="Standard polite morning conversation.", order=1
            ),
            Exercise(
                id=10, lesson_id=l2.id, type="MULTIPLE_CHOICE",
                prompt="What is the best response to 'How are you?'",
                content={"question": "What is the best response to 'How are you?'", "text": "How are you?", "options": ["I'm fine, thank you.", "Good night.", "My name is John.", "Yes, please."], "speak_text": "I'm fine, thank you."},
                correct_answer="I'm fine, thank you.", explanation="'I'm fine, thank you.' answers how you are doing.", order=2
            ),
            Exercise(
                id=11, lesson_id=l2.id, type="FILL_BLANK",
                prompt="Complete: I am fine, _____ you.",
                content={"question": "Complete the sentence", "sentence": "I am fine, _____ you.", "options": ["thank", "hello", "please", "good"], "speak_text": "I am fine, thank you."},
                correct_answer="thank", explanation="'thank you' follows 'I am fine'.", order=3
            ),
            Exercise(
                id=12, lesson_id=l2.id, type="MATCH_PAIRS",
                prompt="Match conversation phrases",
                content={"question": "Match the pairs", "pairs": [{"left": "How are you?", "right": "¿Cómo estás?"}, {"left": "I am fine.", "right": "Estoy bien."}, {"left": "See you tomorrow.", "right": "Hasta mañana."}, {"left": "Good night.", "right": "Buenas noches."}]},
                correct_answer=[{"left": "How are you?", "right": "¿Cómo estás?"}, {"left": "I am fine.", "right": "Estoy bien."}, {"left": "See you tomorrow.", "right": "Hasta mañana."}, {"left": "Good night.", "right": "Buenas noches."}],
                explanation="Matches conversation expressions.", order=4
            ),
            Exercise(
                id=13, lesson_id=l2.id, type="TYPE_ANSWER",
                prompt="Type the English response to 'How are you?'",
                content={"question": "Type the response to 'How are you?'", "text": "How are you?", "speak_text": "I am fine"},
                correct_answer="I am fine", explanation="'I am fine' is a standard response.", order=5
            ),
            Exercise(
                id=14, lesson_id=l2.id, type="MULTIPLE_CHOICE",
                prompt="What does 'See you tomorrow' mean?",
                content={"question": "What does 'See you tomorrow' mean?", "text": "See you tomorrow", "options": ["Hasta mañana", "Hasta luego", "Buenos días", "De nada"], "speak_text": "See you tomorrow"},
                correct_answer="Hasta mañana", explanation="'See you tomorrow' translates to 'Hasta mañana'.", order=6
            ),
            Exercise(
                id=15, lesson_id=l2.id, type="TRANSLATE",
                prompt="Translate: See you tomorrow",
                content={"question": "Translate: See you tomorrow", "text": "See you tomorrow", "word_bank": ["See", "you", "tomorrow", "today"], "speak_text": "See you tomorrow"},
                correct_answer=["See", "you", "tomorrow"], explanation="'See you tomorrow' is used when parting.", order=7
            ),
            Exercise(
                id=16, lesson_id=l2.id, type="FILL_BLANK",
                prompt="Fill in the blank: _____ afternoon, everyone!",
                content={"question": "Fill in the blank", "sentence": "_____ afternoon, everyone!", "options": ["Good", "Fine", "Nice", "Hello"], "speak_text": "Good afternoon, everyone!"},
                correct_answer="Good", explanation="'Good afternoon' greets people in the afternoon.", order=8
            ),

            # ==========================================
            # LESSON 3: Personal Info (Skill 2)
            # ==========================================
            Exercise(
                id=17, lesson_id=l3.id, type="MULTIPLE_CHOICE",
                prompt="What does 'My name is Sarah' mean?",
                content={"question": "What does 'My name is Sarah' mean?", "text": "My name is Sarah", "options": ["Me llamo Sarah", "Soy Sarah", "Gracias Sarah", "Hola Sarah"], "speak_text": "My name is Sarah"},
                correct_answer="Me llamo Sarah", explanation="'My name is' expresses your name.", order=1
            ),
            Exercise(
                id=18, lesson_id=l3.id, type="TRANSLATE",
                prompt="Translate: My name is John.",
                content={"question": "Translate: My name is John.", "text": "My name is John.", "word_bank": ["My", "name", "is", "John", "friend"], "speak_text": "My name is John."},
                correct_answer=["My", "name", "is", "John"], explanation="Standard name introduction.", order=2
            ),
            Exercise(
                id=19, lesson_id=l3.id, type="FILL_BLANK",
                prompt="Complete: My _____ is Alex.",
                content={"question": "Complete the sentence", "sentence": "My _____ is Alex.", "options": ["name", "is", "friend", "from"], "speak_text": "My name is Alex."},
                correct_answer="name", explanation="'name' fits after 'My'.", order=3
            ),
            Exercise(
                id=20, lesson_id=l3.id, type="TYPE_ANSWER",
                prompt="Type the missing word: 'What is your ____?'",
                content={"question": "Complete: What is your ____?", "text": "What is your ____?", "speak_text": "name"},
                correct_answer="name", explanation="'What is your name?' asks for a name.", order=4
            ),
            Exercise(
                id=21, lesson_id=l3.id, type="MATCH_PAIRS",
                prompt="Match introduction phrases",
                content={"question": "Match the pairs", "pairs": [{"left": "My name is...", "right": "Mi nombre es..."}, {"left": "What is your name?", "right": "¿Cómo te llamas?"}, {"left": "I am a student.", "right": "Soy estudiante."}, {"left": "I am from...", "right": "Soy de..."}]},
                correct_answer=[{"left": "My name is...", "right": "Mi nombre es..."}, {"left": "What is your name?", "right": "¿Cómo te llamas?"}, {"left": "I am a student.", "right": "Soy estudiante."}, {"left": "I am from...", "right": "Soy de..."}],
                explanation="Matches personal info statements.", order=5
            ),
            Exercise(
                id=22, lesson_id=l3.id, type="MULTIPLE_CHOICE",
                prompt="How do you ask someone's name?",
                content={"question": "How do you ask someone's name?", "text": "What is your name?", "options": ["What is your name?", "Where are you?", "How are you?", "Who is that?"], "speak_text": "What is your name?"},
                correct_answer="What is your name?", explanation="'What is your name?' asks for a name.", order=6
            ),
            Exercise(
                id=23, lesson_id=l3.id, type="TRANSLATE",
                prompt="Translate: I am a student.",
                content={"question": "Translate: I am a student.", "text": "I am a student.", "word_bank": ["I", "am", "a", "student", "teacher"], "speak_text": "I am a student."},
                correct_answer=["I", "am", "a", "student"], explanation="States student occupation.", order=7
            ),
            Exercise(
                id=24, lesson_id=l3.id, type="FILL_BLANK",
                prompt="Complete: I am _____ Spain.",
                content={"question": "Complete the sentence", "sentence": "I am _____ Spain.", "options": ["from", "is", "name", "are"], "speak_text": "I am from Spain."},
                correct_answer="from", explanation="'from' specifies place of origin.", order=8
            ),

            # ==========================================
            # LESSON 4: Meeting People (Skill 2)
            # ==========================================
            Exercise(
                id=25, lesson_id=l4.id, type="MULTIPLE_CHOICE",
                prompt="What should you say when meeting someone for the first time?",
                content={"question": "What should you say when meeting someone for the first time?", "text": "Nice to meet you.", "options": ["Nice to meet you.", "Good night.", "I'm hungry.", "See you yesterday."], "speak_text": "Nice to meet you."},
                correct_answer="Nice to meet you.", explanation="'Nice to meet you.' is polite when introduced.", order=1
            ),
            Exercise(
                id=26, lesson_id=l4.id, type="TRANSLATE",
                prompt="Translate: Nice to meet you.",
                content={"question": "Translate: Nice to meet you.", "text": "Nice to meet you.", "word_bank": ["Nice", "to", "meet", "you", "friend"], "speak_text": "Nice to meet you."},
                correct_answer=["Nice", "to", "meet", "you"], explanation="'Nice to meet you' translates to 'Mucho gusto'.", order=2
            ),
            Exercise(
                id=27, lesson_id=l4.id, type="FILL_BLANK",
                prompt="Fill in the blank: Nice to _____ you.",
                content={"question": "Fill in the blank", "sentence": "Nice to _____ you.", "options": ["meet", "see", "say", "is"], "speak_text": "Nice to meet you."},
                correct_answer="meet", explanation="'meet' fits in 'Nice to meet you'.", order=3
            ),
            Exercise(
                id=28, lesson_id=l4.id, type="TYPE_ANSWER",
                prompt="Type the missing word: 'This is my _____.'",
                content={"question": "Complete: This is my ____.", "text": "This is my ____.", "speak_text": "friend"},
                correct_answer="friend", explanation="'This is my friend.' introduces someone.", order=4
            ),
            Exercise(
                id=29, lesson_id=l4.id, type="MATCH_PAIRS",
                prompt="Match phrases for meeting people",
                content={"question": "Match the pairs", "pairs": [{"left": "Nice to meet you.", "right": "Mucho gusto."}, {"left": "Where are you from?", "right": "¿De dónde eres?"}, {"left": "This is my friend.", "right": "Este es mi amigo."}, {"left": "I am from America.", "right": "Soy de Estados Unidos."}]},
                correct_answer=[{"left": "Nice to meet you.", "right": "Mucho gusto."}, {"left": "Where are you from?", "right": "¿De dónde eres?"}, {"left": "This is my friend.", "right": "Este es mi amigo."}, {"left": "I am from America.", "right": "Soy de Estados Unidos."}],
                explanation="Matches social introduction phrases.", order=5
            ),
            Exercise(
                id=30, lesson_id=l4.id, type="MULTIPLE_CHOICE",
                prompt="How do you introduce a friend?",
                content={"question": "How do you introduce a friend?", "text": "This is my friend.", "options": ["This is my friend.", "Where is my friend?", "Good morning friend.", "Goodbye friend."], "speak_text": "This is my friend."},
                correct_answer="This is my friend.", explanation="'This is my friend.' introduces a friend.", order=6
            ),
            Exercise(
                id=31, lesson_id=l4.id, type="TRANSLATE",
                prompt="Translate: Where are you from?",
                content={"question": "Translate: Where are you from?", "text": "Where are you from?", "word_bank": ["Where", "are", "you", "from", "who"], "speak_text": "Where are you from?"},
                correct_answer=["Where", "are", "you", "from"], explanation="Asks about origin.", order=7
            ),
            Exercise(
                id=32, lesson_id=l4.id, type="FILL_BLANK",
                prompt="Fill in the blank: Where _____ you from?",
                content={"question": "Fill in the blank", "sentence": "Where _____ you from?", "options": ["are", "is", "am", "be"], "speak_text": "Where are you from?"},
                correct_answer="are", explanation="'are' agrees with 'you'.", order=8
            ),

            # ==========================================
            # LESSON 5: Essential Words (Skill 3)
            # ==========================================
            Exercise(
                id=33, lesson_id=l5.id, type="MULTIPLE_CHOICE",
                prompt="What is the English word for 'Por favor'?",
                content={"question": "What is the English word for 'Por favor'?", "text": "Por favor", "options": ["Please", "Thanks", "Sorry", "Yes"], "speak_text": "Please"},
                correct_answer="Please", explanation="'Por favor' translates to 'Please'.", order=1
            ),
            Exercise(
                id=34, lesson_id=l5.id, type="TRANSLATE",
                prompt="Translate: Yes, please.",
                content={"question": "Translate: Yes, please.", "text": "Yes, please.", "word_bank": ["Yes", "please", "No", "sorry"], "speak_text": "Yes, please."},
                correct_answer=["Yes", "please"], explanation="'Yes, please.' is a polite agreement.", order=2
            ),
            Exercise(
                id=35, lesson_id=l5.id, type="FILL_BLANK",
                prompt="Complete: No, _____ you.",
                content={"question": "Complete the sentence", "sentence": "No, _____ you.", "options": ["thank", "please", "sorry", "yes"], "speak_text": "No, thank you."},
                correct_answer="thank", explanation="'No, thank you.' is polite refusal.", order=3
            ),
            Exercise(
                id=36, lesson_id=l5.id, type="TYPE_ANSWER",
                prompt="Type the English word for 'Lo siento'.",
                content={"question": "Type the English word for 'Lo siento'.", "text": "Lo siento", "speak_text": "Sorry"},
                correct_answer="Sorry", explanation="'Lo siento' translates to 'Sorry'.", order=4
            ),
            Exercise(
                id=37, lesson_id=l5.id, type="MATCH_PAIRS",
                prompt="Match basic essential words",
                content={"question": "Match the pairs", "pairs": [{"left": "Yes", "right": "Sí"}, {"left": "No", "right": "No"}, {"left": "Sorry", "right": "Lo siento"}, {"left": "Thanks", "right": "Gracias"}]},
                correct_answer=[{"left": "Yes", "right": "Sí"}, {"left": "No", "right": "No"}, {"left": "Sorry", "right": "Lo siento"}, {"left": "Thanks", "right": "Gracias"}],
                explanation="Matches basic single-word expressions.", order=5
            ),
            Exercise(
                id=38, lesson_id=l5.id, type="MULTIPLE_CHOICE",
                prompt="What does 'I am sorry' mean?",
                content={"question": "What does 'I am sorry' mean?", "text": "I am sorry", "options": ["Lo siento", "Por favor", "De nada", "De acuerdo"], "speak_text": "I am sorry"},
                correct_answer="Lo siento", explanation="'I am sorry' expresses apology.", order=6
            ),
            Exercise(
                id=39, lesson_id=l5.id, type="TRANSLATE",
                prompt="Translate: I am sorry.",
                content={"question": "Translate: I am sorry.", "text": "I am sorry.", "word_bank": ["I", "am", "sorry", "yes"], "speak_text": "I am sorry."},
                correct_answer=["I", "am", "sorry"], explanation="Apologetic statement.", order=7
            ),
            Exercise(
                id=40, lesson_id=l5.id, type="FILL_BLANK",
                prompt="Fill in the blank: _____, I cannot come.",
                content={"question": "Fill in the blank", "sentence": "_____, I cannot come.", "options": ["Sorry", "Yes", "Please", "Thanks"], "speak_text": "Sorry, I cannot come."},
                correct_answer="Sorry", explanation="'Sorry' begins an apologetic response.", order=8
            ),

            # ==========================================
            # LESSON 6: Objects & Nouns (Skill 3)
            # ==========================================
            Exercise(
                id=41, lesson_id=l6.id, type="MULTIPLE_CHOICE",
                prompt="What is the English word for 'Libro'?",
                content={"question": "What is the English word for 'Libro'?", "text": "Libro", "options": ["Book", "House", "Water", "Teacher"], "speak_text": "Book"},
                correct_answer="Book", explanation="'Libro' translates to 'Book'.", order=1
            ),
            Exercise(
                id=42, lesson_id=l6.id, type="TRANSLATE",
                prompt="Translate: This is a book.",
                content={"question": "Translate: This is a book.", "text": "This is a book.", "word_bank": ["This", "is", "a", "book", "house"], "speak_text": "This is a book."},
                correct_answer=["This", "is", "a", "book"], explanation="Identifies a book.", order=2
            ),
            Exercise(
                id=43, lesson_id=l6.id, type="FILL_BLANK",
                prompt="Complete: I have a _____.",
                content={"question": "Complete the sentence", "sentence": "I have a _____.", "options": ["house", "yes", "please", "sorry"], "speak_text": "I have a house."},
                correct_answer="house", explanation="'house' fits after 'a'.", order=3
            ),
            Exercise(
                id=44, lesson_id=l6.id, type="TYPE_ANSWER",
                prompt="Type the English word for 'Agua'.",
                content={"question": "Type the English word for 'Agua'.", "text": "Agua", "speak_text": "Water"},
                correct_answer="Water", explanation="'Agua' translates to 'Water'.", order=4
            ),
            Exercise(
                id=45, lesson_id=l6.id, type="MATCH_PAIRS",
                prompt="Match basic objects and nouns",
                content={"question": "Match the pairs", "pairs": [{"left": "Book", "right": "Libro"}, {"left": "House", "right": "Casa"}, {"left": "Water", "right": "Agua"}, {"left": "Teacher", "right": "Profesor"}]},
                correct_answer=[{"left": "Book", "right": "Libro"}, {"left": "House", "right": "Casa"}, {"left": "Water", "right": "Agua"}, {"left": "Teacher", "right": "Profesor"}],
                explanation="Matches noun vocabulary.", order=5
            ),
            Exercise(
                id=46, lesson_id=l6.id, type="MULTIPLE_CHOICE",
                prompt="Who teaches students at school?",
                content={"question": "Who teaches students at school?", "text": "Teacher", "options": ["Teacher", "Friend", "House", "Book"], "speak_text": "Teacher"},
                correct_answer="Teacher", explanation="'Teacher' is a person who teaches.", order=6
            ),
            Exercise(
                id=47, lesson_id=l6.id, type="TRANSLATE",
                prompt="Translate: He is a teacher.",
                content={"question": "Translate: He is a teacher.", "text": "He is a teacher.", "word_bank": ["He", "is", "a", "teacher", "student"], "speak_text": "He is a teacher."},
                correct_answer=["He", "is", "a", "teacher"], explanation="Identifies teacher profession.", order=7
            ),
            Exercise(
                id=48, lesson_id=l6.id, type="FILL_BLANK",
                prompt="Fill in the blank: Water and _____.",
                content={"question": "Fill in the blank", "sentence": "Water and _____.", "options": ["food", "sorry", "please", "yes"], "speak_text": "Water and food."},
                correct_answer="food", explanation="'food' pairs naturally with water.", order=8
            ),

            # ==========================================
            # LESSON 7: Food & Drinks (Skill 4)
            # ==========================================
            Exercise(
                id=49, lesson_id=l7.id, type="MULTIPLE_CHOICE",
                prompt="Which item is a drink?",
                content={"question": "Which item is a drink?", "text": "Water", "options": ["Water", "Rice", "Bread", "Apple"], "speak_text": "Water"},
                correct_answer="Water", explanation="'Water' is a liquid drink.", order=1
            ),
            Exercise(
                id=50, lesson_id=l7.id, type="TRANSLATE",
                prompt="Translate: I like coffee.",
                content={"question": "Translate: I like coffee.", "text": "I like coffee.", "word_bank": ["I", "like", "coffee", "tea"], "speak_text": "I like coffee."},
                correct_answer=["I", "like", "coffee"], explanation="Expresses preference for coffee.", order=2
            ),
            Exercise(
                id=51, lesson_id=l7.id, type="FILL_BLANK",
                prompt="Complete: I drink _____.",
                content={"question": "Complete the sentence", "sentence": "I drink _____.", "options": ["milk", "bread", "apple", "rice"], "speak_text": "I drink milk."},
                correct_answer="milk", explanation="'milk' is drinkable.", order=3
            ),
            Exercise(
                id=52, lesson_id=l7.id, type="TYPE_ANSWER",
                prompt="Type the English word for 'Manzana'.",
                content={"question": "Type the English word for 'Manzana'.", "text": "Manzana", "speak_text": "Apple"},
                correct_answer="Apple", explanation="'Manzana' translates to 'Apple'.", order=4
            ),
            Exercise(
                id=53, lesson_id=l7.id, type="MATCH_PAIRS",
                prompt="Match food and drink terms",
                content={"question": "Match the pairs", "pairs": [{"left": "Apple", "right": "Manzana"}, {"left": "Milk", "right": "Leche"}, {"left": "Bread", "right": "Pan"}, {"left": "Coffee", "right": "Café"}]},
                correct_answer=[{"left": "Apple", "right": "Manzana"}, {"left": "Milk", "right": "Leche"}, {"left": "Bread", "right": "Pan"}, {"left": "Coffee", "right": "Café"}],
                explanation="Matches food and drink vocabulary.", order=5
            ),
            Exercise(
                id=54, lesson_id=l7.id, type="MULTIPLE_CHOICE",
                prompt="What do people drink in the morning?",
                content={"question": "What do people drink in the morning?", "text": "Coffee", "options": ["Coffee", "Rice", "Banana", "Dinner"], "speak_text": "Coffee"},
                correct_answer="Coffee", explanation="'Coffee' is popular in the morning.", order=6
            ),
            Exercise(
                id=55, lesson_id=l7.id, type="TRANSLATE",
                prompt="Translate: She likes apples.",
                content={"question": "Translate: She likes apples.", "text": "She likes apples.", "word_bank": ["She", "likes", "apples", "bananas"], "speak_text": "She likes apples."},
                correct_answer=["She", "likes", "apples"], explanation="Third-person sentence.", order=7
            ),
            Exercise(
                id=56, lesson_id=l7.id, type="FILL_BLANK",
                prompt="Complete: Can I have some _____?",
                content={"question": "Complete the sentence", "sentence": "Can I have some _____?", "options": ["water", "sleep", "house", "run"], "speak_text": "Can I have some water?"},
                correct_answer="water", explanation="'water' fits request.", order=8
            ),

            # ==========================================
            # LESSON 8: Meals & Orders (Skill 4)
            # ==========================================
            Exercise(
                id=57, lesson_id=l8.id, type="MULTIPLE_CHOICE",
                prompt="What meal do you eat in the morning?",
                content={"question": "What meal do you eat in the morning?", "text": "Breakfast", "options": ["Breakfast", "Lunch", "Dinner", "Coffee"], "speak_text": "Breakfast"},
                correct_answer="Breakfast", explanation="'Breakfast' is eaten in the morning.", order=1
            ),
            Exercise(
                id=58, lesson_id=l8.id, type="TRANSLATE",
                prompt="Translate: I eat rice for lunch.",
                content={"question": "Translate: I eat rice for lunch.", "text": "I eat rice for lunch.", "word_bank": ["I", "eat", "rice", "for", "lunch"], "speak_text": "I eat rice for lunch."},
                correct_answer=["I", "eat", "rice", "for", "lunch"], explanation="Meal statement.", order=2
            ),
            Exercise(
                id=59, lesson_id=l8.id, type="FILL_BLANK",
                prompt="Complete: We eat _____ at a restaurant.",
                content={"question": "Complete the sentence", "sentence": "We eat _____ at a restaurant.", "options": ["dinner", "water", "milk", "tea"], "speak_text": "We eat dinner at a restaurant."},
                correct_answer="dinner", explanation="'dinner' is a meal.", order=3
            ),
            Exercise(
                id=60, lesson_id=l8.id, type="TYPE_ANSWER",
                prompt="Type the English word for 'Restaurante'.",
                content={"question": "Type the English word for 'Restaurante'.", "text": "Restaurante", "speak_text": "Restaurant"},
                correct_answer="Restaurant", explanation="'Restaurante' translates to 'Restaurant'.", order=4
            ),
            Exercise(
                id=61, lesson_id=l8.id, type="MATCH_PAIRS",
                prompt="Match meal vocabulary",
                content={"question": "Match the pairs", "pairs": [{"left": "Breakfast", "right": "Desayuno"}, {"left": "Lunch", "right": "Almuerzo"}, {"left": "Dinner", "right": "Cena"}, {"left": "Restaurant", "right": "Restaurante"}]},
                correct_answer=[{"left": "Breakfast", "right": "Desayuno"}, {"left": "Lunch", "right": "Almuerzo"}, {"left": "Dinner", "right": "Cena"}, {"left": "Restaurant", "right": "Restaurante"}],
                explanation="Matches meal times and places.", order=5
            ),
            Exercise(
                id=62, lesson_id=l8.id, type="MULTIPLE_CHOICE",
                prompt="Where do people order food?",
                content={"question": "Where do people order food?", "text": "Restaurant", "options": ["Restaurant", "House", "School", "Bed"], "speak_text": "Restaurant"},
                correct_answer="Restaurant", explanation="'Restaurant' is where you order food.", order=6
            ),
            Exercise(
                id=63, lesson_id=l8.id, type="TRANSLATE",
                prompt="Translate: Where is the restaurant?",
                content={"question": "Translate: Where is the restaurant?", "text": "Where is the restaurant?", "word_bank": ["Where", "is", "the", "restaurant", "food"], "speak_text": "Where is the restaurant?"},
                correct_answer=["Where", "is", "the", "restaurant"], explanation="Asking for directions to a restaurant.", order=7
            ),
            Exercise(
                id=64, lesson_id=l8.id, type="FILL_BLANK",
                prompt="Fill in the blank: I want tea for _____.",
                content={"question": "Fill in the blank", "sentence": "I want tea for _____.", "options": ["breakfast", "water", "apple", "bread"], "speak_text": "I want tea for breakfast."},
                correct_answer="breakfast", explanation="'breakfast' fits meal context.", order=8
            ),

            # ==========================================
            # LESSON 9: Routines (Skill 5)
            # ==========================================
            Exercise(
                id=65, lesson_id=l9.id, type="MULTIPLE_CHOICE",
                prompt="What do you do in bed at night?",
                content={"question": "What do you do in bed at night?", "text": "Sleep", "options": ["Sleep", "Run", "Study", "Eat"], "speak_text": "Sleep"},
                correct_answer="Sleep", explanation="'Sleep' is done at night in bed.", order=1
            ),
            Exercise(
                id=66, lesson_id=l9.id, type="TRANSLATE",
                prompt="Translate: I wake up at seven.",
                content={"question": "Translate: I wake up at seven.", "text": "I wake up at seven.", "word_bank": ["I", "wake", "up", "at", "seven"], "speak_text": "I wake up at seven."},
                correct_answer=["I", "wake", "up", "at", "seven"], explanation="Routine morning action.", order=2
            ),
            Exercise(
                id=67, lesson_id=l9.id, type="FILL_BLANK",
                prompt="Complete: I _____ a book.",
                content={"question": "Complete the sentence", "sentence": "I _____ a book.", "options": ["read", "drink", "sleep", "walk"], "speak_text": "I read a book."},
                correct_answer="read", explanation="'read' fits with a book.", order=3
            ),
            Exercise(
                id=68, lesson_id=l9.id, type="TYPE_ANSWER",
                prompt="Type the English verb for 'Estudiar'.",
                content={"question": "Type the English verb for 'Estudiar'.", "text": "Estudiar", "speak_text": "Study"},
                correct_answer="Study", explanation="'Estudiar' translates to 'Study'.", order=4
            ),
            Exercise(
                id=69, lesson_id=l9.id, type="MATCH_PAIRS",
                prompt="Match routine actions",
                content={"question": "Match the pairs", "pairs": [{"left": "Wake up", "right": "Despertarse"}, {"left": "Study", "right": "Estudiar"}, {"left": "Sleep", "right": "Dormir"}, {"left": "Read", "right": "Leer"}]},
                correct_answer=[{"left": "Wake up", "right": "Despertarse"}, {"left": "Study", "right": "Estudiar"}, {"left": "Sleep", "right": "Dormir"}, {"left": "Read", "right": "Leer"}],
                explanation="Matches daily routine actions.", order=5
            ),
            Exercise(
                id=70, lesson_id=l9.id, type="MULTIPLE_CHOICE",
                prompt="What do students do at school?",
                content={"question": "What do students do at school?", "text": "Study", "options": ["Study", "Sleep", "Run", "Eat"], "speak_text": "Study"},
                correct_answer="Study", explanation="Students study at school.", order=6
            ),
            Exercise(
                id=71, lesson_id=l9.id, type="TRANSLATE",
                prompt="Translate: I study English.",
                content={"question": "Translate: I study English.", "text": "I study English.", "word_bank": ["I", "study", "English", "Spanish"], "speak_text": "I study English."},
                correct_answer=["I", "study", "English"], explanation="States subject of study.", order=7
            ),
            Exercise(
                id=72, lesson_id=l9.id, type="FILL_BLANK",
                prompt="Fill in the blank: I _____ to school.",
                content={"question": "Fill in the blank", "sentence": "I _____ to school.", "options": ["go", "sleep", "eat", "read"], "speak_text": "I go to school."},
                correct_answer="go", explanation="'go' fits direction to school.", order=8
            ),

            # ==========================================
            # LESSON 10: Daily Actions (Skill 5)
            # ==========================================
            Exercise(
                id=73, lesson_id=l10.id, type="MULTIPLE_CHOICE",
                prompt="Which action means moving fast on foot?",
                content={"question": "Which action means moving fast on foot?", "text": "Run", "options": ["Run", "Sleep", "Read", "Write"], "speak_text": "Run"},
                correct_answer="Run", explanation="'Run' is fast movement on foot.", order=1
            ),
            Exercise(
                id=74, lesson_id=l10.id, type="TRANSLATE",
                prompt="Translate: I write a letter.",
                content={"question": "Translate: I write a letter.", "text": "I write a letter.", "word_bank": ["I", "write", "a", "letter", "book"], "speak_text": "I write a letter."},
                correct_answer=["I", "write", "a", "letter"], explanation="States writing action.", order=2
            ),
            Exercise(
                id=75, lesson_id=l10.id, type="FILL_BLANK",
                prompt="Complete: I _____ water every day.",
                content={"question": "Complete the sentence", "sentence": "I _____ water every day.", "options": ["drink", "walk", "sleep", "write"], "speak_text": "I drink water every day."},
                correct_answer="drink", explanation="'drink' fits with water.", order=3
            ),
            Exercise(
                id=76, lesson_id=l10.id, type="TYPE_ANSWER",
                prompt="Type the English verb for 'Trabajar'.",
                content={"question": "Type the English verb for 'Trabajar'.", "text": "Trabajar", "speak_text": "Work"},
                correct_answer="Work", explanation="'Trabajar' translates to 'Work'.", order=4
            ),
            Exercise(
                id=77, lesson_id=l10.id, type="MATCH_PAIRS",
                prompt="Match daily action verbs",
                content={"question": "Match the pairs", "pairs": [{"left": "Work", "right": "Trabajar"}, {"left": "Walk", "right": "Caminar"}, {"left": "Run", "right": "Correr"}, {"left": "Write", "right": "Escribir"}]},
                correct_answer=[{"left": "Work", "right": "Trabajar"}, {"left": "Walk", "right": "Caminar"}, {"left": "Run", "right": "Correr"}, {"left": "Write", "right": "Escribir"}],
                explanation="Matches physical action verbs.", order=5
            ),
            Exercise(
                id=78, lesson_id=l10.id, type="MULTIPLE_CHOICE",
                prompt="What do people do at an office?",
                content={"question": "What do people do at an office?", "text": "Work", "options": ["Work", "Sleep", "Run", "Eat"], "speak_text": "Work"},
                correct_answer="Work", explanation="People work at an office.", order=6
            ),
            Exercise(
                id=79, lesson_id=l10.id, type="TRANSLATE",
                prompt="Translate: I walk in the park.",
                content={"question": "Translate: I walk in the park.", "text": "I walk in the park.", "word_bank": ["I", "walk", "in", "the", "park"], "speak_text": "I walk in the park."},
                correct_answer=["I", "walk", "in", "the", "park"], explanation="States walking action in a park.", order=7
            ),
            Exercise(
                id=80, lesson_id=l10.id, type="FILL_BLANK",
                prompt="Fill in the blank: Please _____ here.",
                content={"question": "Fill in the blank", "sentence": "Please _____ here.", "options": ["come", "sleep", "drink", "eat"], "speak_text": "Please come here."},
                correct_answer="come", explanation="'come' fits command.", order=8
            ),
        ]
        db.add_all(exercises)
        db.commit()

        # 4. Seed Learner Initial Skill & Lesson Progress
        # Skill 1 (Greetings): COMPLETED (100%, 4 crowns) — Lessons 1 & 2 Completed
        sp1 = UserSkillProgress(user_id=learner.id, skill_id=skill1.id, status="COMPLETED", crown_level=4, progress_percentage=100.0, completed_at=datetime.utcnow() - timedelta(days=2))
        lp1 = UserLessonProgress(user_id=learner.id, lesson_id=l1.id, is_completed=True, attempts_count=1, completed_at=datetime.utcnow() - timedelta(days=2))
        lp2 = UserLessonProgress(user_id=learner.id, lesson_id=l2.id, is_completed=True, attempts_count=1, completed_at=datetime.utcnow() - timedelta(days=2))

        # Skill 2 (Introductions): COMPLETED (100%, 4 crowns) — Lessons 3 & 4 Completed
        sp2 = UserSkillProgress(user_id=learner.id, skill_id=skill2.id, status="COMPLETED", crown_level=4, progress_percentage=100.0, completed_at=datetime.utcnow() - timedelta(days=1))
        lp3 = UserLessonProgress(user_id=learner.id, lesson_id=l3.id, is_completed=True, attempts_count=1, completed_at=datetime.utcnow() - timedelta(days=1))
        lp4 = UserLessonProgress(user_id=learner.id, lesson_id=l4.id, is_completed=True, attempts_count=1, completed_at=datetime.utcnow() - timedelta(days=1))

        # Skill 3 (Basic Words): AVAILABLE (0%, 0 crowns)
        sp3 = UserSkillProgress(user_id=learner.id, skill_id=skill3.id, status="AVAILABLE", crown_level=0, progress_percentage=0.0, unlocked_at=datetime.utcnow() - timedelta(days=1))
        lp5 = UserLessonProgress(user_id=learner.id, lesson_id=l5.id, is_completed=False, attempts_count=0)
        lp6 = UserLessonProgress(user_id=learner.id, lesson_id=l6.id, is_completed=False, attempts_count=0)

        # Skill 4 (Food & Drinks): LOCKED (0%, 0 crowns)
        sp4 = UserSkillProgress(user_id=learner.id, skill_id=skill4.id, status="LOCKED", crown_level=0, progress_percentage=0.0)
        lp7 = UserLessonProgress(user_id=learner.id, lesson_id=l7.id, is_completed=False, attempts_count=0)
        lp8 = UserLessonProgress(user_id=learner.id, lesson_id=l8.id, is_completed=False, attempts_count=0)

        # Skill 5 (Daily Activities): LOCKED (0%, 0 crowns)
        sp5 = UserSkillProgress(user_id=learner.id, skill_id=skill5.id, status="LOCKED", crown_level=0, progress_percentage=0.0)
        lp9 = UserLessonProgress(user_id=learner.id, lesson_id=l9.id, is_completed=False, attempts_count=0)
        lp10 = UserLessonProgress(user_id=learner.id, lesson_id=l10.id, is_completed=False, attempts_count=0)

        db.add_all([sp1, sp2, sp3, sp4, sp5])
        db.add_all([lp1, lp2, lp3, lp4, lp5, lp6, lp7, lp8, lp9, lp10])
        db.commit()

        # 5. Seed Achievements & User Achievements
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

        # 6. Seed Pronunciation Sound Categories & Sounds
        cat_vowels = SoundCategory(id=1, name="Vowels", slug="vowels", display_order=1)
        cat_consonants = SoundCategory(id=2, name="Consonants", slug="consonants", display_order=2)
        db.add_all([cat_vowels, cat_consonants])
        db.commit()

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

        # Seed initial sound progress for default learner (realistic progress visualization)
        initial_sound_progress = [
            UserSoundProgress(user_id=learner.id, sound_id=1, practice_count=1, correct_count=1, incorrect_count=0, progress_percent=20, mastered=False),
            UserSoundProgress(user_id=learner.id, sound_id=2, practice_count=2, correct_count=2, incorrect_count=0, progress_percent=40, mastered=False),
            UserSoundProgress(user_id=learner.id, sound_id=3, practice_count=1, correct_count=0, incorrect_count=1, progress_percent=10, mastered=False),
            UserSoundProgress(user_id=learner.id, sound_id=4, practice_count=2, correct_count=1, incorrect_count=1, progress_percent=30, mastered=False),
            UserSoundProgress(user_id=learner.id, sound_id=5, practice_count=0, correct_count=0, incorrect_count=0, progress_percent=0, mastered=False),
        ]
        db.add_all(initial_sound_progress)
        db.commit()

        print("Successfully seeded English Foundations course and Pronunciation Sounds (15 Vowels, 24 Consonants).")

    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_database()
