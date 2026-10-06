# Duolingo Web App

A full-stack Duolingo clone built with **Next.js, TypeScript, Tailwind CSS, FastAPI, and SQLite**. The application recreates the core Duolingo learning experience with an interactive learning path, lessons, exercises, XP, streaks, hearts, rewards, achievements, and a learner profile.

## 🔗 Live Links

| Link                    | URL                   |
| ----------------------- | --------------------- |
| 🚀 Live Application     | `https://duolingo-cbdd2.web.app`   |
| 📁 GitHub Repository    | `https://github.com/krishnachaitanyabalasa-del/Duolingo`     |

## 🛠 Tech Stack

| Technology              | Purpose                           |
| ----------------------- | --------------------------------- |
| Next.js 16 (App Router) | Application framework and routing |
| React 19                | Interactive UI                    |
| TypeScript              | Type-safe development             |
| Tailwind CSS            | UI styling and responsive design  |
| Framer Motion           | Animations and transitions        |
| Lucide React            | UI icons                          |
| Canvas Confetti         | Reward and completion effects     |
| FastAPI                 | Backend REST API                  |
| Python                  | Backend development               |
| SQLAlchemy              | Database ORM                      |
| SQLite                  | Relational database               |
| Firebase Authentication | User authentication               |

## ✨ Features

### 1. Learning Path

A Duolingo-style learning path with units, skills, lessons, and progression.

- Locked, available, and completed lesson states
- Skill progress indicators
- XP, streak, hearts, and gems
- Sequential lesson unlocking
- Reward/gift nodes
- Persistent learner progress

```text
Unit
  ↓
Skill
  ↓
Lesson
  ↓
Exercises
  ↓
Complete
  ↓
XP + Progress
  ↓
Next Lesson Unlocked
```

### 2. Lesson Player

The lesson player is the core learning experience and supports multiple exercise types:

- Multiple Choice
- Translation
- Word Bank / Tap the Words
- Match Pairs
- Fill in the Blank
- Type the Answer

Each lesson includes:

- Progress bar
- Immediate correct/incorrect feedback
- Heart deduction for incorrect answers
- Lesson completion state
- XP rewards
- Skill progress updates

### 3. Gamification

The application implements the main Duolingo-style game mechanics.

| Feature         | Description                          |
| --------------- | ------------------------------------ |
| 🔥 Streak       | Tracks consecutive learning activity |
| ⚡ XP            | Earned by completing lessons         |
| ❤️ Hearts       | Reduced when answers are incorrect   |
| 💎 Gems         | Used for mocked rewards              |
| 🎯 Daily Goal   | Tracks daily XP progress             |
| 🏆 Leaderboard  | Displays seeded learner rankings     |
| 🎁 Rewards      | Unlockable reward chests             |
| 🏅 Achievements | Progress-based learner achievements  |

### 4. Reward Chest System

Reward chests are connected to learning path progression.

- Locked rewards cannot be claimed early
- Rewards unlock after completing prerequisites
- XP and gems can be awarded
- Reward state is persisted
- Animated reward modal

The reward modal uses React `createPortal()` to render outside the learning-path hierarchy, preventing parent transforms and path styling from affecting the modal.

### 5. Learner Profile

A complete Duolingo-style profile page is available at `/profile`.

Features include:

- Custom cartoon learner avatars
- Display name and username
- Bio and join date
- XP and streak statistics
- League information
- Achievement progress
- Followers and following
- Add Friends search
- Course badges
- Profile editing

The application includes **8 custom SVG learner avatars** with different hairstyles, accessories, glasses, headphones, and clothing.

### 6. Social Features

The profile includes lightweight social functionality:

- Followers / Following lists
- Follow and unfollow actions
- User search
- Add Friends panel
- Profile invite/share interaction

These features are exposed through the FastAPI backend.

## 🏗 Architecture

```text
                    Browser
                       │
                       ▼
              ┌─────────────────┐
              │   Next.js 16    │
              │ React + TS      │
              └────────┬────────┘
                       │
                    REST API
                       │
                       ▼
              ┌─────────────────┐
              │     FastAPI     │
              │     Python      │
              └────────┬────────┘
                       │
                   SQLAlchemy
                       │
                       ▼
                    SQLite
```

### Frontend Structure

```text
frontend/
├── app/
│   ├── layout.tsx
│   ├── learn/page.tsx
│   ├── profile/page.tsx
│   └── lesson/[id]/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── AppLayoutClient.tsx
│   ├── lesson/
│   │   └── RewardNode.tsx
│   └── profile/
│       ├── Avatars.tsx
│       ├── EditProfileModal.tsx
│       └── ...
│
└── lib/
    └── mockData.ts
```

### Backend Structure

```text
backend/
├── main.py
├── models.py
└── routers/
    ├── auth.py
    ├── courses.py
    ├── profile.py
    └── user.py
```

## 🗄 Database Design

SQLite is used as the application database with SQLAlchemy.

Core relationships:

```text
User
 │
 ├── User Progress
 ├── Achievements
 ├── Followers / Following
 │
 └── Course
       │
       └── Unit
            │
            └── Skill
                 │
                 └── Lesson
                      │
                      └── Exercise
```

### Main Entities

| Entity              | Purpose                      |
| ------------------- | ---------------------------- |
| User                | Learner account and profile  |
| Course              | Language course              |
| Unit                | Course section               |
| Skill               | Learning skill               |
| Lesson              | Individual lesson            |
| Exercise            | Question within a lesson     |
| User Progress       | Learner-specific progression |
| Achievement         | Achievement tracking         |
| Follow Relationship | Social connections           |

Course content is seeded so the application is immediately usable after setup.

## 🧠 State Management

React Context is used for global application state.

| Data                 | State               |
| -------------------- | ------------------- |
| User                 | UserContext         |
| Theme                | ThemeContext        |
| Lesson answers       | Local React state   |
| Exercise progress    | Local React state   |
| UI / Modal state     | Local React state   |
| XP / Streak / Hearts | Backend persistence |
| Skill completion     | Backend persistence |

No external state-management library was required because React Context and component state are sufficient for the application's scope.

## 🔄 Lesson Flow

```text
Start Lesson
     ↓
Load Exercises
     ↓
Answer Exercise
     ↓
Correct / Incorrect
     ↓
Update Hearts
     ↓
Next Exercise
     ↓
Lesson Complete
     ↓
Award XP
     ↓
Update Skill Progress
     ↓
Unlock Next Content
```

## 🔐 Backend APIs

The FastAPI backend is divided into feature-specific routers.

| Router       | Responsibility                     |
| ------------ | ---------------------------------- |
| `auth.py`    | Authentication                     |
| `courses.py` | Courses, units, skills and lessons |
| `profile.py` | Profile and social features        |
| `user.py`    | User progression, XP and hearts    |

Example profile APIs:

```text
GET  /api/profile
PUT  /api/profile
```

Additional endpoints handle user search and follow/unfollow operations.

## 🎨 Duolingo Experience

The UI was designed to closely follow the original Duolingo visual and interaction patterns:

- Playful and colorful interface
- Rounded cards and buttons
- Learning path with curved progression
- Animated lesson feedback
- Progress indicators
- Reward celebrations
- Toast notifications
- Hearts and XP indicators
- Duolingo-style profile
- Responsive desktop and mobile layouts

## 🛠 Important Implementation Details

### Reward Locking

Reward nodes check their `isUnlocked` state before allowing interaction. Locked rewards display a feedback message instead of allowing users to claim them.

### Modal Portaling

Reward modals use React's `createPortal()` and are rendered into `document.body`. This prevents CSS transforms and positioning from the learning path from distorting the modal.

### Custom Avatars

The learner avatars are implemented as SVG components rather than external images, keeping them lightweight and avoiding broken image dependencies.

###

## 🚀 Getting Started

### Backend

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

### Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

## 📌 Scope & Assumptions

The assignment requires only a small seeded course, so the implementation focuses on the core learning and gamification experience.

The following are mocked or simplified where appropriate:

- One language/course
- Seeded leaderboard users
- Gems and rewards
- Social functionality
- Subscription/purchases
- Speech/pronunciation exercises

## 👤 Author

**Balasa Krishna Chaitanya**
