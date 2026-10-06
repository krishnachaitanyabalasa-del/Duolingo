import re

new_exercises_code = '''        # 3. Seed 8 Exercises per Lesson (80 total exercises covering ALL 5 types in every lesson)
        if db.query(Exercise).count() == 0:
            print("Seeding 80 course exercises...")
            exercises = [
                # ==========================================
                # LESSON 1: Basic Greetings (Skill 1)
                # ==========================================
                Exercise(
                    id=1, lesson_id=1, type="MULTIPLE_CHOICE",
                    prompt="What does 'Hola' mean in English?",
                    content={"question": "What does 'Hola' mean in English?", "text": "Hola", "options": ["Goodbye", "Hi", "Thank you", "Please"], "speak_text": "Hello"},
                    correct_answer="Hi", explanation="'Hola' translates to 'Hi' or 'Hello'.", order=1
                ),
                Exercise(
                    id=2, lesson_id=1, type="TRANSLATE",
                    prompt="Translate to English: Hola",
                    content={"question": "Translate to English: Hola", "text": "Hola", "word_bank": ["Hello", "Goodbye", "Please", "Thanks"], "speak_text": "Hello"},
                    correct_answer=["Hello"], explanation="'Hola' translates to 'Hello'.", order=2
                ),
                Exercise(
                    id=3, lesson_id=1, type="FILL_BLANK",
                    prompt="Fill in the blank: Good _____!",
                    content={"question": "Fill in the blank", "sentence": "Good _____!", "options": ["name", "food", "morning", "book"], "speak_text": "Good morning!"},
                    correct_answer="morning", explanation="'Good morning!' is a standard morning greeting.", order=3
                ),
                Exercise(
                    id=4, lesson_id=1, type="TYPE_ANSWER",
                    prompt="Type the English word for 'Hola'.",
                    content={"question": "Type the English word for 'Hola'.", "text": "Hola", "speak_text": "Hello"},
                    correct_answer=["Hello", "Hi"], explanation="'Hola' translates to 'Hello' or 'Hi'.", order=4
                ),
                Exercise(
                    id=5, lesson_id=1, type="MATCH_PAIRS",
                    prompt="Match the greeting pairs",
                    content={"question": "Match the pairs", "pairs": [{"left": "Hello", "right": "Hola"}, {"left": "Goodbye", "right": "Adiós"}, {"left": "Thank you", "right": "Gracias"}, {"left": "Please", "right": "Por favor"}]},
                    correct_answer=[{"left": "Hello", "right": "Hola"}, {"left": "Goodbye", "right": "Adiós"}, {"left": "Thank you", "right": "Gracias"}, {"left": "Please", "right": "Por favor"}],
                    explanation="Matches English greetings with Spanish equivalents.", order=5
                ),
                Exercise(
                    id=6, lesson_id=1, type="MULTIPLE_CHOICE",
                    prompt="How do you say 'Buenas noches' in the evening?",
                    content={"question": "How do you say 'Buenas noches' in the evening?", "text": "Buenas noches", "options": ["Good morning", "Goodbye", "Good evening", "Good night"], "speak_text": "Good evening"},
                    correct_answer="Good evening", explanation="'Good evening' is used when greeting someone in the evening.", order=6
                ),
                Exercise(
                    id=7, lesson_id=1, type="TRANSLATE",
                    prompt="Translate to English: Gracias",
                    content={"question": "Translate to English: Gracias", "text": "Gracias", "word_bank": ["Thank", "you", "Hello", "Bye"], "speak_text": "Thank you"},
                    correct_answer=["Thank", "you"], explanation="'Gracias' translates to 'Thank you'.", order=7
                ),
                Exercise(
                    id=8, lesson_id=1, type="FILL_BLANK",
                    prompt="Fill in the blank: See you _____!",
                    content={"question": "Fill in the blank", "sentence": "See you _____!", "options": ["apple", "later", "night", "water"], "speak_text": "See you later!"},
                    correct_answer="later", explanation="'See you later!' is a common farewell phrase.", order=8
                ),

                # ==========================================
                # LESSON 2: Greeting Conversations (Skill 1)
                # ==========================================
                Exercise(
                    id=9, lesson_id=2, type="TRANSLATE",
                    prompt="Translate to English: ¡Buenos días! ¿Cómo estás?",
                    content={"question": "Translate to English: ¡Buenos días! ¿Cómo estás?", "text": "¡Buenos días! ¿Cómo estás?", "word_bank": ["Good", "morning", "How", "are", "you", "thanks"], "speak_text": "Good morning! How are you?"},
                    correct_answer=["Good", "morning", "How", "are", "you"], explanation="Standard polite morning greeting conversation.", order=1
                ),
                Exercise(
                    id=10, lesson_id=2, type="MULTIPLE_CHOICE",
                    prompt="What is the best response to 'How are you?'",
                    content={"question": "What is the best response to 'How are you?'", "text": "How are you?", "options": ["Good night.", "My name is John.", "I'm fine, thank you.", "Yes, please."], "speak_text": "I'm fine, thank you."},
                    correct_answer="I'm fine, thank you.", explanation="'I'm fine, thank you.' is the appropriate answer.", order=2
                ),
                Exercise(
                    id=11, lesson_id=2, type="FILL_BLANK",
                    prompt="Complete: I am fine, _____ you.",
                    content={"question": "Complete the sentence", "sentence": "I am fine, _____ you.", "options": ["hello", "thank", "please", "good"], "speak_text": "I am fine, thank you."},
                    correct_answer="thank", explanation="'thank' completes 'thank you'.", order=3
                ),
                Exercise(
                    id=12, lesson_id=2, type="MATCH_PAIRS",
                    prompt="Match conversation phrases",
                    content={"question": "Match the pairs", "pairs": [{"left": "How are you?", "right": "¿Cómo estás?"}, {"left": "I am fine.", "right": "Estoy bien."}, {"left": "See you tomorrow.", "right": "Hasta mañana."}, {"left": "Good night.", "right": "Buenas noches."}]},
                    correct_answer=[{"left": "How are you?", "right": "¿Cómo estás?"}, {"left": "I am fine.", "right": "Estoy bien."}, {"left": "See you tomorrow.", "right": "Hasta mañana."}, {"left": "Good night.", "right": "Buenas noches."}],
                    explanation="Matches common conversation expressions.", order=4
                ),
                Exercise(
                    id=13, lesson_id=2, type="TYPE_ANSWER",
                    prompt="Type the English response to '¿Cómo estás?'",
                    content={"question": "Type the response to '¿Cómo estás?'", "text": "Estoy bien", "speak_text": "I am fine"},
                    correct_answer=["I am fine", "I'm fine", "Fine"], explanation="'I am fine' or 'I'm fine' is the standard response.", order=5
                ),
                Exercise(
                    id=14, lesson_id=2, type="MULTIPLE_CHOICE",
                    prompt="What does 'See you tomorrow' mean in Spanish?",
                    content={"question": "What does 'See you tomorrow' mean?", "text": "See you tomorrow", "options": ["Hasta luego", "Hasta mañana", "Buenos días", "De nada"], "speak_text": "See you tomorrow"},
                    correct_answer="Hasta mañana", explanation="'See you tomorrow' translates to 'Hasta mañana'.", order=6
                ),
                Exercise(
                    id=15, lesson_id=2, type="TRANSLATE",
                    prompt="Translate to English: Hasta mañana",
                    content={"question": "Translate to English: Hasta mañana", "text": "Hasta mañana", "word_bank": ["See", "you", "tomorrow", "today", "yesterday"], "speak_text": "See you tomorrow"},
                    correct_answer=["See", "you", "tomorrow"], explanation="'Hasta mañana' translates to 'See you tomorrow'.", order=7
                ),
                Exercise(
                    id=16, lesson_id=2, type="FILL_BLANK",
                    prompt="Fill in the blank: _____ afternoon, everyone!",
                    content={"question": "Fill in the blank", "sentence": "_____ afternoon, everyone!", "options": ["Fine", "Nice", "Good", "Hello"], "speak_text": "Good afternoon, everyone!"},
                    correct_answer="Good", explanation="'Good afternoon' greets people in the afternoon.", order=8
                ),

                # ==========================================
                # LESSON 3: Personal Info (Skill 2)
                # ==========================================
                Exercise(
                    id=17, lesson_id=3, type="MULTIPLE_CHOICE",
                    prompt="What does 'Me llamo Sarah' mean in English?",
                    content={"question": "What does 'Me llamo Sarah' mean in English?", "text": "Me llamo Sarah", "options": ["I am Sarah's friend", "My name is Sarah", "Thanks Sarah", "Hello Sarah"], "speak_text": "My name is Sarah"},
                    correct_answer="My name is Sarah", explanation="'Me llamo Sarah' translates to 'My name is Sarah'.", order=1
                ),
                Exercise(
                    id=18, lesson_id=3, type="TRANSLATE",
                    prompt="Translate to English: Me llamo John.",
                    content={"question": "Translate to English: Me llamo John.", "text": "Me llamo John.", "word_bank": ["My", "name", "is", "John", "friend"], "speak_text": "My name is John."},
                    correct_answer=["My", "name", "is", "John"], explanation="Translates to 'My name is John'.", order=2
                ),
                Exercise(
                    id=19, lesson_id=3, type="FILL_BLANK",
                    prompt="Complete: My _____ is Alex.",
                    content={"question": "Complete the sentence", "sentence": "My _____ is Alex.", "options": ["is", "name", "friend", "from"], "speak_text": "My name is Alex."},
                    correct_answer="name", explanation="'name' fits after 'My'.", order=3
                ),
                Exercise(
                    id=20, lesson_id=3, type="TYPE_ANSWER",
                    prompt="Type the missing English word: 'What is your ____?'",
                    content={"question": "Complete: What is your ____?", "text": "What is your ____?", "speak_text": "name"},
                    correct_answer="name", explanation="'What is your name?' asks for a name.", order=4
                ),
                Exercise(
                    id=21, lesson_id=3, type="MATCH_PAIRS",
                    prompt="Match introduction phrases",
                    content={"question": "Match the pairs", "pairs": [{"left": "My name is...", "right": "Mi nombre es..."}, {"left": "What is your name?", "right": "¿Cómo te llamas?"}, {"left": "I am a student.", "right": "Soy estudiante."}, {"left": "I am from...", "right": "Soy de..."}]},
                    correct_answer=[{"left": "My name is...", "right": "Mi nombre es..."}, {"left": "What is your name?", "right": "¿Cómo te llamas?"}, {"left": "I am a student.", "right": "Soy estudiante."}, {"left": "I am from...", "right": "Soy de..."}],
                    explanation="Matches personal info expressions.", order=5
                ),
                Exercise(
                    id=22, lesson_id=3, type="MULTIPLE_CHOICE",
                    prompt="How do you ask someone's name in English?",
                    content={"question": "How do you ask someone's name in English?", "text": "¿Cómo te llamas?", "options": ["Where are you from?", "How are you?", "What is your name?", "Who is that?"], "speak_text": "What is your name?"},
                    correct_answer="What is your name?", explanation="'What is your name?' asks for someone's name.", order=6
                ),
                Exercise(
                    id=23, lesson_id=3, type="TRANSLATE",
                    prompt="Translate to English: Soy estudiante.",
                    content={"question": "Translate to English: Soy estudiante.", "text": "Soy estudiante.", "word_bank": ["I", "am", "a", "student", "teacher"], "speak_text": "I am a student."},
                    correct_answer=["I", "am", "a", "student"], explanation="Translates to 'I am a student'.", order=7
                ),
                Exercise(
                    id=24, lesson_id=3, type="FILL_BLANK",
                    prompt="Complete: I am _____ Spain.",
                    content={"question": "Complete the sentence", "sentence": "I am _____ Spain.", "options": ["is", "from", "name", "are"], "speak_text": "I am from Spain."},
                    correct_answer="from", explanation="'from' specifies country of origin.", order=8
                ),

                # ==========================================
                # LESSON 4: Meeting People (Skill 2)
                # ==========================================
                Exercise(
                    id=25, lesson_id=4, type="MULTIPLE_CHOICE",
                    prompt="What is the English translation for 'Mucho gusto'?",
                    content={"question": "What is the translation for 'Mucho gusto'?", "text": "Mucho gusto", "options": ["Good night.", "Nice to meet you.", "I'm hungry.", "See you tomorrow."], "speak_text": "Nice to meet you."},
                    correct_answer="Nice to meet you.", explanation="'Mucho gusto' translates to 'Nice to meet you.'", order=1
                ),
                Exercise(
                    id=26, lesson_id=4, type="TRANSLATE",
                    prompt="Translate to English: Mucho gusto",
                    content={"question": "Translate to English: Mucho gusto", "text": "Mucho gusto", "word_bank": ["Nice", "to", "meet", "you", "friend"], "speak_text": "Nice to meet you."},
                    correct_answer=["Nice", "to", "meet", "you"], explanation="Translates to 'Nice to meet you'.", order=2
                ),
                Exercise(
                    id=27, lesson_id=4, type="FILL_BLANK",
                    prompt="Fill in the blank: Nice to _____ you.",
                    content={"question": "Fill in the blank", "sentence": "Nice to _____ you.", "options": ["see", "say", "meet", "is"], "speak_text": "Nice to meet you."},
                    correct_answer="meet", explanation="'meet' fits in 'Nice to meet you'.", order=3
                ),
                Exercise(
                    id=28, lesson_id=4, type="TYPE_ANSWER",
                    prompt="Type the missing English word: 'This is my _____.'",
                    content={"question": "Complete: This is my ____.", "text": "Este es mi amigo", "speak_text": "friend"},
                    correct_answer="friend", explanation="'friend' completes 'This is my friend'.", order=4
                ),
                Exercise(
                    id=29, lesson_id=4, type="MATCH_PAIRS",
                    prompt="Match phrases for meeting people",
                    content={"question": "Match the pairs", "pairs": [{"left": "Nice to meet you.", "right": "Mucho gusto."}, {"left": "Where are you from?", "right": "¿De dónde eres?"}, {"left": "This is my friend.", "right": "Este es mi amigo."}, {"left": "I am from America.", "right": "Soy de Estados Unidos."}]},
                    correct_answer=[{"left": "Nice to meet you.", "right": "Mucho gusto."}, {"left": "Where are you from?", "right": "¿De dónde eres?"}, {"left": "This is my friend.", "right": "Este es mi amigo."}, {"left": "I am from America.", "right": "Soy de Estados Unidos."}],
                    explanation="Matches social introduction phrases.", order=5
                ),
                Exercise(
                    id=30, lesson_id=4, type="MULTIPLE_CHOICE",
                    prompt="How do you introduce a friend in English?",
                    content={"question": "How do you introduce a friend?", "text": "Este es mi amigo.", "options": ["Where is my friend?", "This is my friend.", "Good morning friend.", "Goodbye friend."], "speak_text": "This is my friend."},
                    correct_answer="This is my friend.", explanation="'This is my friend.' introduces a friend.", order=6
                ),
                Exercise(
                    id=31, lesson_id=4, type="TRANSLATE",
                    prompt="Translate to English: ¿De dónde eres?",
                    content={"question": "Translate to English: ¿De dónde eres?", "text": "¿De dónde eres?", "word_bank": ["Where", "are", "you", "from", "who"], "speak_text": "Where are you from?"},
                    correct_answer=["Where", "are", "you", "from"], explanation="Translates to 'Where are you from?'", order=7
                ),
                Exercise(
                    id=32, lesson_id=4, type="FILL_BLANK",
                    prompt="Fill in the blank: Where _____ you from?",
                    content={"question": "Fill in the blank", "sentence": "Where _____ you from?", "options": ["is", "am", "are", "be"], "speak_text": "Where are you from?"},
                    correct_answer="are", explanation="'are' agrees with 'you'.", order=8
                ),

                # ==========================================
                # LESSON 5: Essential Words (Skill 3)
                # ==========================================
                Exercise(
                    id=33, lesson_id=5, type="MULTIPLE_CHOICE",
                    prompt="What is the English word for 'Por favor'?",
                    content={"question": "What is the English word for 'Por favor'?", "text": "Por favor", "options": ["Thanks", "Please", "Sorry", "Yes"], "speak_text": "Please"},
                    correct_answer="Please", explanation="'Por favor' translates to 'Please'.", order=1
                ),
                Exercise(
                    id=34, lesson_id=5, type="TRANSLATE",
                    prompt="Translate to English: Sí, por favor.",
                    content={"question": "Translate to English: Sí, por favor.", "text": "Sí, por favor.", "word_bank": ["Yes", "please", "No", "sorry"], "speak_text": "Yes, please."},
                    correct_answer=["Yes", "please"], explanation="Translates to 'Yes, please.'", order=2
                ),
                Exercise(
                    id=35, lesson_id=5, type="FILL_BLANK",
                    prompt="Complete: No, _____ you.",
                    content={"question": "Complete the sentence", "sentence": "No, _____ you.", "options": ["please", "thank", "sorry", "yes"], "speak_text": "No, thank you."},
                    correct_answer="thank", explanation="'No, thank you.' is polite refusal.", order=3
                ),
                Exercise(
                    id=36, lesson_id=5, type="TYPE_ANSWER",
                    prompt="Type the English word for 'Lo siento'.",
                    content={"question": "Type the English word for 'Lo siento'.", "text": "Lo siento", "speak_text": "Sorry"},
                    correct_answer=["Sorry", "I am sorry", "I'm sorry"], explanation="'Lo siento' translates to 'Sorry'.", order=4
                ),
                Exercise(
                    id=37, lesson_id=5, type="MATCH_PAIRS",
                    prompt="Match basic essential words",
                    content={"question": "Match the pairs", "pairs": [{"left": "Yes", "right": "Sí"}, {"left": "No", "right": "No"}, {"left": "Sorry", "right": "Lo siento"}, {"left": "Thanks", "right": "Gracias"}]},
                    correct_answer=[{"left": "Yes", "right": "Sí"}, {"left": "No", "right": "No"}, {"left": "Sorry", "right": "Lo siento"}, {"left": "Thanks", "right": "Gracias"}],
                    explanation="Matches basic single-word vocabulary.", order=5
                ),
                Exercise(
                    id=38, lesson_id=5, type="MULTIPLE_CHOICE",
                    prompt="What does 'Lo siento' mean in English?",
                    content={"question": "What does 'Lo siento' mean in English?", "text": "Lo siento", "options": ["Thank you", "Please", "I am sorry", "You are welcome"], "speak_text": "I am sorry"},
                    correct_answer="I am sorry", explanation="'Lo siento' translates to 'I am sorry'.", order=6
                ),
                Exercise(
                    id=39, lesson_id=5, type="TRANSLATE",
                    prompt="Translate to English: Lo siento.",
                    content={"question": "Translate to English: Lo siento.", "text": "Lo siento.", "word_bank": ["I", "am", "sorry", "yes"], "speak_text": "I am sorry."},
                    correct_answer=["I", "am", "sorry"], explanation="Translates to 'I am sorry.'", order=7
                ),
                Exercise(
                    id=40, lesson_id=5, type="FILL_BLANK",
                    prompt="Fill in the blank: _____, I cannot come.",
                    content={"question": "Fill in the blank", "sentence": "_____, I cannot come.", "options": ["Yes", "Please", "Sorry", "Thanks"], "speak_text": "Sorry, I cannot come."},
                    correct_answer="Sorry", explanation="'Sorry' begins an apologetic response.", order=8
                ),

                # ==========================================
                # LESSON 6: Objects & Nouns (Skill 3)
                # ==========================================
                Exercise(
                    id=41, lesson_id=6, type="MULTIPLE_CHOICE",
                    prompt="What is the English word for 'Libro'?",
                    content={"question": "What is the English word for 'Libro'?", "text": "Libro", "options": ["House", "Water", "Book", "Teacher"], "speak_text": "Book"},
                    correct_answer="Book", explanation="'Libro' translates to 'Book'.", order=1
                ),
                Exercise(
                    id=42, lesson_id=6, type="TRANSLATE",
                    prompt="Translate to English: Este es un libro.",
                    content={"question": "Translate to English: Este es un libro.", "text": "Este es un libro.", "word_bank": ["This", "is", "a", "book", "house"], "speak_text": "This is a book."},
                    correct_answer=["This", "is", "a", "book"], explanation="Translates to 'This is a book.'", order=2
                ),
                Exercise(
                    id=43, lesson_id=6, type="FILL_BLANK",
                    prompt="Complete: I have a _____.",
                    content={"question": "Complete the sentence", "sentence": "I have a _____.", "options": ["yes", "house", "please", "sorry"], "speak_text": "I have a house."},
                    correct_answer="house", explanation="'house' is a noun fitting after 'a'.", order=3
                ),
                Exercise(
                    id=44, lesson_id=6, type="TYPE_ANSWER",
                    prompt="Type the English word for 'Agua'.",
                    content={"question": "Type the English word for 'Agua'.", "text": "Agua", "speak_text": "Water"},
                    correct_answer="Water", explanation="'Agua' translates to 'Water'.", order=4
                ),
                Exercise(
                    id=45, lesson_id=6, type="MATCH_PAIRS",
                    prompt="Match basic objects and nouns",
                    content={"question": "Match the pairs", "pairs": [{"left": "Book", "right": "Libro"}, {"left": "House", "right": "Casa"}, {"left": "Water", "right": "Agua"}, {"left": "Teacher", "right": "Profesor"}]},
                    correct_answer=[{"left": "Book", "right": "Libro"}, {"left": "House", "right": "Casa"}, {"left": "Water", "right": "Agua"}, {"left": "Teacher", "right": "Profesor"}],
                    explanation="Matches object vocabulary.", order=5
                ),
                Exercise(
                    id=46, lesson_id=6, type="MULTIPLE_CHOICE",
                    prompt="Who teaches students at school?",
                    content={"question": "Who teaches students at school?", "text": "Profesor", "options": ["Friend", "Teacher", "House", "Book"], "speak_text": "Teacher"},
                    correct_answer="Teacher", explanation="'Teacher' is a person who teaches.", order=6
                ),
                Exercise(
                    id=47, lesson_id=6, type="TRANSLATE",
                    prompt="Translate to English: Él es un profesor.",
                    content={"question": "Translate to English: Él es un profesor.", "text": "Él es un profesor.", "word_bank": ["He", "is", "a", "teacher", "student"], "speak_text": "He is a teacher."},
                    correct_answer=["He", "is", "a", "teacher"], explanation="Translates to 'He is a teacher.'", order=7
                ),
                Exercise(
                    id=48, lesson_id=6, type="FILL_BLANK",
                    prompt="Fill in the blank: Water and _____.",
                    content={"question": "Fill in the blank", "sentence": "Water and _____.", "options": ["sorry", "please", "food", "yes"], "speak_text": "Water and food."},
                    correct_answer="food", explanation="'food' pairs naturally with water.", order=8
                ),

                # ==========================================
                # LESSON 7: Food & Drinks (Skill 4)
                # ==========================================
                Exercise(
                    id=49, lesson_id=7, type="MULTIPLE_CHOICE",
                    prompt="Which item is a drink in English?",
                    content={"question": "Which item is a drink?", "text": "Drink", "options": ["Rice", "Bread", "Water", "Apple"], "speak_text": "Water"},
                    correct_answer="Water", explanation="'Water' is a drink.", order=1
                ),
                Exercise(
                    id=50, lesson_id=7, type="TRANSLATE",
                    prompt="Translate to English: Me gusta el café.",
                    content={"question": "Translate to English: Me gusta el café.", "text": "Me gusta el café.", "word_bank": ["I", "like", "coffee", "tea"], "speak_text": "I like coffee."},
                    correct_answer=["I", "like", "coffee"], explanation="Translates to 'I like coffee.'", order=2
                ),
                Exercise(
                    id=51, lesson_id=7, type="FILL_BLANK",
                    prompt="Complete: I drink _____.",
                    content={"question": "Complete the sentence", "sentence": "I drink _____.", "options": ["bread", "milk", "apple", "rice"], "speak_text": "I drink milk."},
                    correct_answer="milk", explanation="'milk' is drinkable.", order=3
                ),
                Exercise(
                    id=52, lesson_id=7, type="TYPE_ANSWER",
                    prompt="Type the English word for 'Manzana'.",
                    content={"question": "Type the English word for 'Manzana'.", "text": "Manzana", "speak_text": "Apple"},
                    correct_answer="Apple", explanation="'Manzana' translates to 'Apple'.", order=4
                ),
                Exercise(
                    id=53, lesson_id=7, type="MATCH_PAIRS",
                    prompt="Match food and drink terms",
                    content={"question": "Match the pairs", "pairs": [{"left": "Apple", "right": "Manzana"}, {"left": "Milk", "right": "Leche"}, {"left": "Bread", "right": "Pan"}, {"left": "Coffee", "right": "Café"}]},
                    correct_answer=[{"left": "Apple", "right": "Manzana"}, {"left": "Milk", "right": "Leche"}, {"left": "Bread", "right": "Pan"}, {"left": "Coffee", "right": "Café"}],
                    explanation="Matches food and drink vocabulary.", order=5
                ),
                Exercise(
                    id=54, lesson_id=7, type="MULTIPLE_CHOICE",
                    prompt="What is the English word for 'Café'?",
                    content={"question": "What is the English word for 'Café'?", "text": "Café", "options": ["Rice", "Banana", "Coffee", "Dinner"], "speak_text": "Coffee"},
                    correct_answer="Coffee", explanation="'Café' translates to 'Coffee'.", order=6
                ),
                Exercise(
                    id=55, lesson_id=7, type="TRANSLATE",
                    prompt="Translate to English: A ella le gustan las manzanas.",
                    content={"question": "Translate to English: A ella le gustan las manzanas.", "text": "A ella le gustan las manzanas.", "word_bank": ["She", "likes", "apples", "bananas"], "speak_text": "She likes apples."},
                    correct_answer=["She", "likes", "apples"], explanation="Translates to 'She likes apples.'", order=7
                ),
                Exercise(
                    id=56, lesson_id=7, type="FILL_BLANK",
                    prompt="Complete: Can I have some _____?",
                    content={"question": "Complete the sentence", "sentence": "Can I have some _____?", "options": ["sleep", "house", "water", "run"], "speak_text": "Can I have some water?"},
                    correct_answer="water", explanation="'water' fits request.", order=8
                ),

                # ==========================================
                # LESSON 8: Meals & Orders (Skill 4)
                # ==========================================
                Exercise(
                    id=57, lesson_id=8, type="MULTIPLE_CHOICE",
                    prompt="What is the English word for 'Desayuno'?",
                    content={"question": "What is the English word for 'Desayuno'?", "text": "Desayuno", "options": ["Lunch", "Breakfast", "Dinner", "Coffee"], "speak_text": "Breakfast"},
                    correct_answer="Breakfast", explanation="'Desayuno' translates to 'Breakfast'.", order=1
                ),
                Exercise(
                    id=58, lesson_id=8, type="TRANSLATE",
                    prompt="Translate to English: Como arroz para el almuerzo.",
                    content={"question": "Translate to English: Como arroz para el almuerzo.", "text": "Como arroz para el almuerzo.", "word_bank": ["I", "eat", "rice", "for", "lunch"], "speak_text": "I eat rice for lunch."},
                    correct_answer=["I", "eat", "rice", "for", "lunch"], explanation="Translates to 'I eat rice for lunch.'", order=2
                ),
                Exercise(
                    id=59, lesson_id=8, type="FILL_BLANK",
                    prompt="Complete: We eat _____ at a restaurant.",
                    content={"question": "Complete the sentence", "sentence": "We eat _____ at a restaurant.", "options": ["water", "milk", "dinner", "tea"], "speak_text": "We eat dinner at a restaurant."},
                    correct_answer="dinner", explanation="'dinner' is a meal.", order=3
                ),
                Exercise(
                    id=60, lesson_id=8, type="TYPE_ANSWER",
                    prompt="Type the English word for 'Restaurante'.",
                    content={"question": "Type the English word for 'Restaurante'.", "text": "Restaurante", "speak_text": "Restaurant"},
                    correct_answer="Restaurant", explanation="'Restaurante' translates to 'Restaurant'.", order=4
                ),
                Exercise(
                    id=61, lesson_id=8, type="MATCH_PAIRS",
                    prompt="Match meal vocabulary",
                    content={"question": "Match the pairs", "pairs": [{"left": "Breakfast", "right": "Desayuno"}, {"left": "Lunch", "right": "Almuerzo"}, {"left": "Dinner", "right": "Cena"}, {"left": "Restaurant", "right": "Restaurante"}]},
                    correct_answer=[{"left": "Breakfast", "right": "Desayuno"}, {"left": "Lunch", "right": "Almuerzo"}, {"left": "Dinner", "right": "Cena"}, {"left": "Restaurant", "right": "Restaurante"}],
                    explanation="Matches meal vocabulary.", order=5
                ),
                Exercise(
                    id=62, lesson_id=8, type="MULTIPLE_CHOICE",
                    prompt="Where do people order food in English?",
                    content={"question": "Where do people order food?", "text": "Restaurante", "options": ["House", "School", "Restaurant", "Bed"], "speak_text": "Restaurant"},
                    correct_answer="Restaurant", explanation="'Restaurant' is where you order food.", order=6
                ),
                Exercise(
                    id=63, lesson_id=8, type="TRANSLATE",
                    prompt="Translate to English: ¿Dónde está el restaurante?",
                    content={"question": "Translate to English: ¿Dónde está el restaurante?", "text": "¿Dónde está el restaurante?", "word_bank": ["Where", "is", "the", "restaurant", "food"], "speak_text": "Where is the restaurant?"},
                    correct_answer=["Where", "is", "the", "restaurant"], explanation="Translates to 'Where is the restaurant?'", order=7
                ),
                Exercise(
                    id=64, lesson_id=8, type="FILL_BLANK",
                    prompt="Fill in the blank: I want tea for _____.",
                    content={"question": "Fill in the blank", "sentence": "I want tea for _____.", "options": ["water", "breakfast", "apple", "bread"], "speak_text": "I want tea for breakfast."},
                    correct_answer="breakfast", explanation="'breakfast' fits meal context.", order=8
                ),

                # ==========================================
                # LESSON 9: Routines (Skill 5)
                # ==========================================
                Exercise(
                    id=65, lesson_id=9, type="MULTIPLE_CHOICE",
                    prompt="What is the English verb for 'Dormir'?",
                    content={"question": "What is the English verb for 'Dormir'?", "text": "Dormir", "options": ["Run", "Sleep", "Study", "Eat"], "speak_text": "Sleep"},
                    correct_answer="Sleep", explanation="'Dormir' translates to 'Sleep'.", order=1
                ),
                Exercise(
                    id=66, lesson_id=9, type="TRANSLATE",
                    prompt="Translate to English: Me despierto a las siete.",
                    content={"question": "Translate to English: Me despierto a las siete.", "text": "Me despierto a las siete.", "word_bank": ["I", "wake", "up", "at", "seven"], "speak_text": "I wake up at seven."},
                    correct_answer=["I", "wake", "up", "at", "seven"], explanation="Translates to 'I wake up at seven.'", order=2
                ),
                Exercise(
                    id=67, lesson_id=9, type="FILL_BLANK",
                    prompt="Complete: I _____ a book.",
                    content={"question": "Complete the sentence", "sentence": "I _____ a book.", "options": ["drink", "read", "sleep", "walk"], "speak_text": "I read a book."},
                    correct_answer="read", explanation="'read' fits with a book.", order=3
                ),
                Exercise(
                    id=68, lesson_id=9, type="TYPE_ANSWER",
                    prompt="Type the English verb for 'Estudiar'.",
                    content={"question": "Type the English verb for 'Estudiar'.", "text": "Estudiar", "speak_text": "Study"},
                    correct_answer="Study", explanation="'Estudiar' translates to 'Study'.", order=4
                ),
                Exercise(
                    id=69, lesson_id=9, type="MATCH_PAIRS",
                    prompt="Match routine actions",
                    content={"question": "Match the pairs", "pairs": [{"left": "Wake up", "right": "Despertarse"}, {"left": "Study", "right": "Estudiar"}, {"left": "Sleep", "right": "Dormir"}, {"left": "Read", "right": "Leer"}]},
                    correct_answer=[{"left": "Wake up", "right": "Despertarse"}, {"left": "Study", "right": "Estudiar"}, {"left": "Sleep", "right": "Dormir"}, {"left": "Read", "right": "Leer"}],
                    explanation="Matches daily routine actions.", order=5
                ),
                Exercise(
                    id=70, lesson_id=9, type="MULTIPLE_CHOICE",
                    prompt="What do students do at school?",
                    content={"question": "What do students do at school?", "text": "Estudiar", "options": ["Sleep", "Run", "Study", "Eat"], "speak_text": "Study"},
                    correct_answer="Study", explanation="Students study at school.", order=6
                ),
                Exercise(
                    id=71, lesson_id=9, type="TRANSLATE",
                    prompt="Translate to English: Estudio inglés.",
                    content={"question": "Translate to English: Estudio inglés.", "text": "Estudio inglés.", "word_bank": ["I", "study", "English", "Spanish"], "speak_text": "I study English."},
                    correct_answer=["I", "study", "English"], explanation="Translates to 'I study English.'", order=7
                ),
                Exercise(
                    id=72, lesson_id=9, type="FILL_BLANK",
                    prompt="Fill in the blank: I _____ to school.",
                    content={"question": "Fill in the blank", "sentence": "I _____ to school.", "options": ["sleep", "go", "eat", "read"], "speak_text": "I go to school."},
                    correct_answer="go", explanation="'go' fits direction to school.", order=8
                ),

                # ==========================================
                # LESSON 10: Daily Actions (Skill 5)
                # ==========================================
                Exercise(
                    id=73, lesson_id=10, type="MULTIPLE_CHOICE",
                    prompt="What is the English verb for 'Correr'?",
                    content={"question": "What is the English verb for 'Correr'?", "text": "Correr", "options": ["Sleep", "Read", "Run", "Write"], "speak_text": "Run"},
                    correct_answer="Run", explanation="'Correr' translates to 'Run'.", order=1
                ),
                Exercise(
                    id=74, lesson_id=10, type="TRANSLATE",
                    prompt="Translate to English: Escribo una carta.",
                    content={"question": "Translate to English: Escribo una carta.", "text": "Escribo una carta.", "word_bank": ["I", "write", "a", "letter", "book"], "speak_text": "I write a letter."},
                    correct_answer=["I", "write", "a", "letter"], explanation="Translates to 'I write a letter.'", order=2
                ),
                Exercise(
                    id=75, lesson_id=10, type="FILL_BLANK",
                    prompt="Complete: I _____ water every day.",
                    content={"question": "Complete the sentence", "sentence": "I _____ water every day.", "options": ["walk", "drink", "sleep", "write"], "speak_text": "I drink water every day."},
                    correct_answer="drink", explanation="'drink' fits with water.", order=3
                ),
                Exercise(
                    id=76, lesson_id=10, type="TYPE_ANSWER",
                    prompt="Type the English verb for 'Trabajar'.",
                    content={"question": "Type the English verb for 'Trabajar'.", "text": "Trabajar", "speak_text": "Work"},
                    correct_answer="Work", explanation="'Trabajar' translates to 'Work'.", order=4
                ),
                Exercise(
                    id=77, lesson_id=10, type="MATCH_PAIRS",
                    prompt="Match daily action verbs",
                    content={"question": "Match the pairs", "pairs": [{"left": "Work", "right": "Trabajar"}, {"left": "Walk", "right": "Caminar"}, {"left": "Run", "right": "Correr"}, {"left": "Write", "right": "Escribir"}]},
                    correct_answer=[{"left": "Work", "right": "Trabajar"}, {"left": "Walk", "right": "Caminar"}, {"left": "Run", "right": "Correr"}, {"left": "Write", "right": "Escribir"}],
                    explanation="Matches action verbs.", order=5
                ),
                Exercise(
                    id=78, lesson_id=10, type="MULTIPLE_CHOICE",
                    prompt="What do people do at an office?",
                    content={"question": "What do people do at an office?", "text": "Trabajar", "options": ["Sleep", "Work", "Run", "Eat"], "speak_text": "Work"},
                    correct_answer="Work", explanation="People work at an office.", order=6
                ),
                Exercise(
                    id=79, lesson_id=10, type="TRANSLATE",
                    prompt="Translate to English: Camino en el parque.",
                    content={"question": "Translate to English: Camino en el parque.", "text": "Camino en el parque.", "word_bank": ["I", "walk", "in", "the", "park"], "speak_text": "I walk in the park."},
                    correct_answer=["I", "walk", "in", "the", "park"], explanation="Translates to 'I walk in the park.'", order=7
                ),
                Exercise(
                    id=80, lesson_id=10, type="FILL_BLANK",
                    prompt="Fill in the blank: Please _____ here.",
                    content={"question": "Fill in the blank", "sentence": "Please _____ here.", "options": ["sleep", "drink", "come", "eat"], "speak_text": "Please come here."},
                    correct_answer="come", explanation="'come' fits request.", order=8
                ),
            ]
            db.add_all(exercises)
            db.commit()'''

with open('app/seed/seed_data.py', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '        # 3. Seed 8 Exercises per Lesson'
end_marker = '        # 4. Seed Learner Initial Skill & Lesson Progress'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_content = content[:start_idx] + new_exercises_code + '\n\n' + content[end_idx:]

with open('app/seed/seed_data.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Updated seed_data.py successfully!')
