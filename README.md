# 🦉 Duolingo Web App Clone — SDE Fullstack Assignment

A functional, pixel-perfect clone of the **Duolingo** web application built with **Next.js (TypeScript)** on the frontend, **Python (FastAPI)** on the backend, and **SQLite (SQLAlchemy ORM)** for database persistence.

This project replicates Duolingo's iconic dark-mode interface, serpentine learning path, interactive exercise player, audio pronunciation, and real-time gamification systems (XP, Streaks, Hearts, Gems, and Leaderboards).

---

## 📸 Visual UI & Design References

The application matches the original Duolingo Web UX across three primary views:
1. **Learning Path / Home View**: Serpentine unit path with circular skill nodes (`👋`, `🤝`, `📚`, `🍎`, `🏃`), crowns, locked states, unit headers, and an animated mascot riding along the path.
2. **Interactive Lesson Player**: Screen with audio text-to-speech (`🔊`), dotted pronunciation underlines, option cards (`[ 1 ]`, `[ 2 ]`, `[ 3 ]`), and signature bottom feedback bar (`SKIP` / `CHECK` / `CONTINUE`).
3. **Desktop & Mobile Navigation**: Fixed left sidebar, top stats bar (🔥 Streak, ⚡ XP, 💎 Gems, ❤️ Hearts), and right-side widgets (Super Duolingo promo & Amethyst League leaderboard card).

---

## 🛠️ Technology Stack

### **Frontend** (`/frontend`)
- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4, Custom 3D Tactile Buttons (`duo-button`), Dark Theme (`#131f24`)
- **Animations**: Framer Motion, Canvas Confetti
- **Icons**: Lucide React
- **Audio & Speech**: Web Audio API Sound Synthesizer (`lib/sound.ts`), Web Speech Synthesis API (`SpeakButton`), Web Speech Recognition API (`MicrophoneButton`)

### **Backend** (`/backend`)
- **Framework**: Python 3.10+ with FastAPI, Uvicorn
- **Database**: SQLite with SQLAlchemy ORM
- **Schemas**: Pydantic v2
- **Testing**: Pytest automated test suite (25 test cases passing)

---

## 🗄️ Database Schema & Relational Design

The backend implements a clean relational schema in SQLite via SQLAlchemy:

```text
+-------------------+       +-------------------+       +-------------------+
|      User         |       |      Course       |       |       Unit        |
+-------------------+       +-------------------+       +-------------------+
| id (PK)           |       | id (PK)           |       | id (PK)           |
| username          |       | title             |   +-->| course_id (FK)    |
| email             |       | description       |   |   | title             |
| xp                |       | language_code     |   |   | order             |
| streak            |       | icon              |   |   +-------------------+
| longest_streak    |       +-------------------+   |             |
| hearts            |                 |             |             v
| gems              |                 +-------------+   +-------------------+
| last_activity_date|                                   |       Skill       |
+-------------------+                                   +-------------------+
          |                                             | id (PK)           |
          |                                             | unit_id (FK)      |
          |                                             | title, icon, order|
          v                                             +-------------------+
+------------------------+                                        |
| UserSkillProgress      |                                        v
+------------------------+                              +-------------------+
| user_id (FK)           |                              |      Lesson       |
| skill_id (FK)          |                              +-------------------+
| status (COMPLETED/...) |                              | id (PK)           |
| crown_level            |                              | skill_id (FK)     |
| progress_percentage    |                              | title, order      |
+------------------------+                              +-------------------+
          |                                                       |
          v                                                       v
+------------------------+                              +-------------------+
| UserLessonProgress    |                              |     Exercise      |
+------------------------+                              +-------------------+
| user_id (FK)           |                              | id (PK)           |
| lesson_id (FK)         |                              | lesson_id (FK)    |
| is_completed           |                              | type (MC/TRANSL..)|
+------------------------+                              | content (JSON)    |
                                                        | correct_answer    |
                                                        +-------------------+
```

---

## ⚡ Key Core Features

### 1. Learning Path / Skill Tree (`/learn`)
- Serpentine vertical path rendering Units and Skills with lock/available/completed states.
- Progress percentage rings and crown badges per skill.
- Animated mascot avatar positioned on the active lesson node.
- Unit Guidebook modal (`GuidebookModal`) with grammar tips and audio phrase pronunciations.

### 2. Lesson Player (The Core Loop) (`/lesson/[id]`)
- Renders a sequence of exercises covering **5 Exercise Types**:
  1. `MULTIPLE_CHOICE`: Options with audio speaker button and keyboard shortcuts (`1`, `2`, `3`, `4`).
  2. `TRANSLATE`: Tap word bank chips to construct translated sentences.
  3. `MATCH_PAIRS`: 2-column interactive word pair matching with real-time feedback.
  4. `FILL_BLANK`: Sentence card with inline option tiles.
  5. `TYPE_ANSWER`: Spanish text input with character accent shortcuts (`á`, `é`, `í`, `ó`, `ú`, `ñ`) and speech recognition (`MicrophoneButton`).
- Signature bottom feedback bar (`SKIP` / `CHECK` / `CONTINUE`) with green/red result panels.
- Hands-free keyboard navigation (`Enter` key checks answer and advances to next exercise).

### 3. Server-Side Gamification & Security
- **Server-Side Answer Validation**: Evaluated via `POST /api/lessons/{id}/answer`.
- **Security (Req #15)**: Correct answer hidden from `GET /api/lessons/{id}` to prevent DevTools network tab cheating.
- **Heart Loss & Refill**: Deducts 1 heart on incorrect answer. Out of hearts modal triggers practice or gem refill (`POST /api/hearts/refill`).
- **Streak & XP Calculation**: Increments daily streak (`POST /api/streak/check`) and awards +10 XP completion bonus.

### 4. Secondary Navigation Views
- **`/profile`**: User avatar, aggregate stats, daily goal progress, achievements grid.
- **`/leaderboard`**: Top 3 Podium (🥇 🥈 🥉) and league list with current user highlight card.
- **`/sounds`**: Interactive Spanish phonetics chart with audio pronunciation samples.
- **`/practice`**: Mistakes review & targeted practice hub to earn back hearts.
- **`/quests`**: Daily challenges board with claimable gem chest rewards.
- **`/shop`**: Item store to buy Heart Refills, Streak Freezes, and Super Duolingo free trial.

---

## 🔌 API Endpoint Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/course` | Returns active course with unit hierarchy, skill states, and crown levels |
| `GET` | `/api/lessons/{id}` | Returns lesson details and exercise questions (correct answer hidden for security) |
| `POST` | `/api/lessons/{id}/start` | Starts a lesson session attempt (verifies hearts > 0) |
| `POST` | `/api/lessons/{id}/answer` | Submits exercise answer; returns correctness, hearts remaining, and XP earned |
| `POST` | `/api/lessons/{id}/complete` | Finalizes lesson completion, awards +10 XP bonus, updates skill progress & streak |
| `GET` | `/api/user` | Returns default learner profile (XP, streak, hearts, gems) |
| `POST` | `/api/hearts/refill` | Restores hearts to 5 in exchange for 100 gems |
| `POST` | `/api/streak/check` | Recalculates consecutive daily streak status |
| `GET` | `/api/leaderboard` | Returns sorted XP leaderboard with user rankings |
| `GET` | `/api/achievements` | Returns learner achievements progress list |

---

## 🚀 Quick Start & Local Setup Instructions

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+ & pip

### 1. Clone the Repository
```bash
git clone https://github.com/krishnachaitanyabalasa-del/Duolingo.git
cd Duolingo
```

### 2. Start the Backend API Server
```bash
cd backend
py -m pip install -r requirements.txt
py -m uvicorn app.main:app --reload --port 8000
```
- API Server: [`http://127.0.0.1:8000`](http://127.0.0.1:8000)
- Swagger Interactive Docs: [`http://127.0.0.1:8000/docs`](http://127.0.0.1:8000/docs)

### 3. Start the Next.js Frontend Server
In a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
- Web Application: [`http://localhost:3000`](http://localhost:3000)

---

## 🧪 Automated Testing

Run the backend pytest test suite covering all 25 core requirements:
```bash
cd backend
py -m pytest -v
```

---

## 🤖 AI Tools Usage Statement

AI development tools (Claude 3.6, Antigravity IDE, ChatGPT) were utilized during development to accelerate UI component generation, TypeScript type definitions, database seeding scripts, and automated test cases. All architecture decisions, data transformers, and business logic rules were verified, tested, and understood for presentation.
