# Duolingo Web App — Backend API

Production-quality backend service for a Duolingo-style learning platform built with **Python**, **FastAPI**, **SQLite**, **SQLAlchemy ORM**, **Pydantic v2**, and **Uvicorn**.

---

## 🏗️ Architecture & Project Structure

The backend follows a modular, clean-layered architecture separating Data Access (Models), Data Transfer Objects (Schemas), Business Logic (Services), HTTP Endpoints (Routers), and Utilities.

```text
backend/
├── app/
│   ├── main.py              # FastAPI app initialization, CORS, exception handlers
│   ├── config.py            # Environment & app settings (Pydantic Settings)
│   ├── database.py          # SQLAlchemy SQLite engine & session setup
│   ├── models/              # SQLAlchemy ORM Database Models
│   │   ├── user.py          # User entity (xp, streak, hearts, gems, activity)
│   │   ├── course.py        # Course, Unit, Skill, Lesson, Exercise entities
│   │   ├── progress.py      # UserSkillProgress, UserLessonProgress, LessonAttempt
│   │   └── achievement.py   # Achievement, UserAchievement entities
│   ├── schemas/             # Pydantic Request & Response Schemas
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── lesson.py
│   │   ├── progress.py
│   │   ├── gamification.py
│   │   └── achievement.py
│   ├── routers/             # REST API Router Endpoints
│   │   ├── course.py        # /api/course, /api/units, /api/skills, /api/lessons
│   │   ├── user.py          # /api/user, /api/user/stats
│   │   ├── progress.py      # /api/progress, /api/progress/skills
│   │   ├── lesson.py        # /api/lessons/{id}/start, /answer, /complete
│   │   ├── gamification.py  # /api/stats, /api/leaderboard, /api/hearts/refill, /api/streak/check
│   │   └── achievement.py   # /api/achievements
│   ├── services/            # Core Gamification & Business Logic
│   │   ├── user_service.py
│   │   ├── course_service.py
│   │   ├── lesson_service.py
│   │   ├── progress_service.py
│   │   ├── gamification_service.py
│   │   └── achievement_service.py
│   ├── seed/                # Seed Data Initialization
│   │   └── seed_data.py     # Initial English course, 5 exercise types, default learner
│   └── utils/               # Utilities & Helpers
│       └── date_utils.py    # Testable date & streak calculation rules
├── tests/                   # Pytest Automated Test Suite
│   ├── conftest.py
│   ├── test_course.py
│   ├── test_lesson.py
│   ├── test_answer.py
│   ├── test_hearts.py
│   ├── test_xp.py
│   ├── test_streak.py
│   └── test_progress.py
├── .env.example             # Environment variable template
├── requirements.txt         # Python dependencies
└── README.md                # Project documentation
```

---

## ⚡ Core Features & Systems

### 1. Database & Seed Data
- **Engine**: SQLite with SQLAlchemy ORM.
- **Default Learner Profile**:
  - Username: `learner`
  - XP: `120`
  - Streak: `5` days
  - Hearts: `5`
  - Gems: `100`
- **Seeded English Course**:
  - **Unit 1: Basics** (Skills: *Greetings* [COMPLETED], *Introductions* [IN_PROGRESS], *Food* [AVAILABLE])
  - **Unit 2: Everyday Life** (Skills: *Family* [LOCKED], *Places* [LOCKED], *Daily Activities* [LOCKED])
- **Exercise Types Supported**:
  1. `MULTIPLE_CHOICE`
  2. `TRANSLATE`
  3. `MATCH_PAIRS`
  4. `FILL_BLANK`
  5. `TYPE_ANSWER`

### 2. Server-Side Answer Validation & XP System
- **Answer Validation**: Performed strictly on the backend (`POST /api/lessons/{lesson_id}/answer`). Supports text matching, multiple acceptable answers, and paired array matching.
- **XP Rewards**:
  - Correct Answer: `+1 XP`
  - Lesson Completion Bonus: `+10 XP` (idempotent; completion bonus cannot be claimed twice for the same lesson session).

### 3. Hearts System
- **Max Hearts**: `5`.
- **Deduction**: `-1 heart` on incorrect answer.
- **Depletion Prevention**: When hearts reach `0`, users cannot start or continue lessons (`400 Bad Request`).
- **Refill**: `POST /api/hearts/refill` restores hearts to 5.

### 4. Streak System & Testable Date Logic
- **Rules**:
  - **Same Day**: Streak unchanged.
  - **Next Consecutive Day**: `streak += 1`, updates `longest_streak`.
  - **Gap > 1 Day**: Resets streak to `1`.
- Implemented with an injectable date provider (`date_utils.py`), enabling deterministic unit testing without `datetime.now()` flakiness.

### 5. Skill Progression & Automatic Unlocking
- **Skill States**: `LOCKED`, `AVAILABLE`, `IN_PROGRESS`, `COMPLETED`.
- **Crown Calculations**:
  - `0%` -> 0 crowns
  - `25%` -> 1 crown
  - `50%` -> 2 crowns
  - `75%` -> 3 crowns
  - `100%` -> 4 crowns
- When a skill reaches `100%` completion, its status transitions to `COMPLETED`, and the next sequential skill in the course automatically transitions from `LOCKED` to `AVAILABLE`.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ installed.

### 1. Install Dependencies
```bash
cd backend
py -m pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Seed Database (Optional - Runs automatically on app start)
```bash
py -m app.seed.seed_data
```

### 4. Start the Server
```bash
py -m uvicorn app.main:app --reload --port 8000
```

The server will be running at: **`http://127.0.0.1:8000`**

---

## 📖 API Documentation & Swagger UI

FastAPI automatically generates Interactive API Documentation:

- **Swagger UI**: [`http://127.0.0.1:8000/docs`](http://127.0.0.1:8000/docs)
- **ReDoc**: [`http://127.0.0.1:8000/redoc`](http://127.0.0.1:8000/redoc)

---

## 🔌 Complete API Contract for Frontend Developers

### 📚 Course & Content Endpoints

#### `GET /api/course`
Returns active course with unit hierarchy, skill states, crown levels, and lesson summaries.

**Response `200 OK`**:
```json
{
  "id": 1,
  "title": "English Course",
  "description": "Master English from basics to everyday conversations.",
  "language_code": "en",
  "icon": "🇬🇧",
  "units": [
    {
      "id": 1,
      "course_id": 1,
      "title": "Unit 1: Basics",
      "order": 1,
      "skills": [
        {
          "id": 1,
          "title": "Greetings",
          "status": "COMPLETED",
          "crown_level": 4,
          "progress_percentage": 100.0,
          "lessons": [
            { "id": 1, "title": "Basic Greetings", "is_completed": true }
          ]
        },
        {
          "id": 2,
          "title": "Introductions",
          "status": "IN_PROGRESS",
          "crown_level": 2,
          "progress_percentage": 50.0,
          "lessons": [
            { "id": 3, "title": "Names & Titles", "is_completed": true },
            { "id": 4, "title": "Origins & Countries", "is_completed": false }
          ]
        },
        {
          "id": 3,
          "title": "Food",
          "status": "AVAILABLE",
          "crown_level": 0,
          "progress_percentage": 0.0,
          "lessons": []
        }
      ]
    }
  ]
}
```

#### `GET /api/skills/{skill_id}`
Returns details for a specific skill.

#### `GET /api/lessons/{lesson_id}`
Returns lesson details and exercise content.

---

### 👤 User & Profile Endpoints

#### `GET /api/user`
Returns default learner profile.

**Response `200 OK`**:
```json
{
  "id": 1,
  "username": "learner",
  "email": "learner@duolingo.clone",
  "xp": 120,
  "streak": 5,
  "longest_streak": 5,
  "hearts": 5,
  "gems": 100,
  "last_activity_date": "2026-10-05"
}
```

#### `GET /api/user/stats`
Returns aggregate statistics (skills finished, crowns earned, etc.).

---

### 🎯 Lesson Workflow Endpoints

#### `POST /api/lessons/{lesson_id}/start`
Starts a lesson session. Checks hearts > 0.

#### `POST /api/lessons/{lesson_id}/answer`
Submits an answer to an exercise.

**Request Body**:
```json
{
  "exercise_id": 1,
  "answer": "Hola"
}
```

**Response `200 OK` (Correct Answer)**:
```json
{
  "correct": true,
  "correct_answer": "Hola",
  "explanation": "'Hola' is the Spanish translation for 'Hello'.",
  "hearts": 5,
  "xp_earned": 1
}
```

**Response `200 OK` (Incorrect Answer)**:
```json
{
  "correct": false,
  "correct_answer": "Hola",
  "explanation": "'Hola' is the Spanish translation for 'Hello'.",
  "hearts": 4,
  "xp_earned": 0
}
```

#### `POST /api/lessons/{lesson_id}/complete`
Finalizes lesson completion. Awards +10 XP, updates skill progress %, unlocks next skill if 100% completed.

**Response `200 OK`**:
```json
{
  "completed": true,
  "xp_awarded": 10,
  "total_xp": 131,
  "skill_completed": true,
  "next_skill_unlocked": {
    "id": 3,
    "title": "Food",
    "status": "AVAILABLE"
  },
  "current_streak": 6
}
```

---

### 🏆 Gamification & Leaderboard Endpoints

#### `GET /api/leaderboard`
Returns XP leaderboard sorted descending with user ranks.

**Response `200 OK`**:
```json
[
  { "rank": 1, "user_id": 2, "username": "Orion", "xp": 1250, "is_current_user": false },
  { "rank": 2, "user_id": 3, "username": "Sarah", "xp": 980, "is_current_user": false },
  { "rank": 3, "user_id": 4, "username": "Rahul", "xp": 750, "is_current_user": false },
  { "rank": 4, "user_id": 1, "username": "learner", "xp": 120, "is_current_user": true }
]
```

#### `POST /api/hearts/refill`
Restores hearts to 5.

#### `POST /api/streak/check`
Recalculates streak status.

#### `GET /api/achievements`
Returns achievements and learner progress.

---

## 🧪 Running Automated Tests

Run the complete pytest test suite covering all core backend requirements:

```bash
cd backend
py -m pytest -v
```

---

## 🌐 CORS Configuration

Configured via environment variable `ALLOWED_ORIGINS` in `.env`:
```env
ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001"
```
Allows Next.js frontend calls during local development without CORS restriction issues.
