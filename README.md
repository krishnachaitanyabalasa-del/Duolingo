# Duolingo Web App

A full-stack **Duolingo clone** built for the SDE Fullstack Assignment. The application recreates the core Duolingo learning experience with a gamified learning path, interactive lessons, progress tracking, XP, streaks, hearts, rewards, achievements, and a learner profile.

## Live Links

| Resource | Link |
|---|---|
| Live Application | `https://duolingo-cbdd2.web.app` |
| GitHub Repository | `https://github.com/krishnachaitanyabalasa-del/Duolingo` |

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | Frontend framework and App Router |
| **React 19** | Interactive UI components |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Styling and responsive design |
| **Framer Motion** | UI animations and transitions |
| **Lucide React** | Icons |
| **Canvas Confetti** | Lesson/reward celebrations |
| **FastAPI** | Backend REST API |
| **Python** | Backend development |
| **SQLAlchemy** | Database ORM |
| **SQLite** | Relational database |
| **Firebase Authentication** | User authentication |

## Features

### 1. Learning Path

A Duolingo-style learning path allows learners to progress through units, skills, and lessons.

- Locked, available, and completed lessons
- Sequential progression
- Skill progress indicators
- XP and streak display
- Hearts and gems
- Reward/gift nodes
- Persistent progress

```text
Unit
  ↓
Skill
  ↓
Lesson
  ↓
Exercises
  ↓
Lesson Complete
  ↓
XP + Progress
  ↓
Next Content Unlocked
```

### 2. Interactive Lesson Player

The lesson player is the core learning experience and supports multiple exercise types:

- Multiple Choice
- Translation
- Word Bank / Tap the Words
- Match Pairs
- Fill in the Blank
- Type the Answer

Each exercise provides:

- Progress tracking
- Immediate correct/incorrect feedback
- Heart deduction for incorrect answers
- Correct answer feedback
- Lesson completion state
- XP rewards
- Skill progress updates

### Lesson Flow

```text
Start Lesson
     ↓
Load Exercise
     ↓
Submit Answer
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
Update Progress
```

### 3. Gamification

The application implements the main Duolingo-style gamification mechanics.

| Feature | Description |
|---|---|
| Streak | Tracks consecutive learning activity |
| XP | Earned through lesson completion |
| Hearts | Lost when an exercise is answered incorrectly |
| Gems | Used as an in-app reward currency |
| Daily Goal | Tracks learner XP progress |
| Leaderboard | Displays learner rankings |
| Rewards | Unlockable reward chests |
| Achievements | Progress-based achievements |

### 4. Reward Chest System

Reward chests are integrated into the learning path.

- Rewards remain locked until prerequisites are completed
- Locked rewards cannot be claimed
- XP and gems can be awarded
- Reward state is persisted
- Animated reward modal
- Confetti celebration for rewards

The reward modal uses React `createPortal()` and is rendered directly into `document.body`, preventing the learning-path layout and transforms from affecting its positioning.

### 5. Learner Profile

A complete Duolingo-style profile is available at:

```text
/profile
```

The profile includes:

- Custom cartoon learner avatar
- Display name
- Username
- Bio
- Join date
- Total XP
- Day streak
- Current league
- Top 3 finishes
- Course badges
- Achievement progress
- Followers
- Following
- Add Friends
- Profile editing

### Custom Avatars

The application includes **8 custom SVG learner avatars** with different:

- Hairstyles
- Accessories
- Glasses
- Headphones
- Clothing styles

The avatars are implemented locally without external image dependencies.

### 6. Social Features

The profile includes lightweight social functionality:

- Followers / Following
- Follow and unfollow
- User search
- Add Friends
- Profile sharing/invites

These operations are handled through FastAPI APIs.

## Architecture

```text
                         Browser
                            │
                            ▼
                  ┌──────────────────┐
                  │    Next.js 16    │
                  │ React + TypeScript│
                  └────────┬─────────┘
                           │
                        REST API
                           │
                           ▼
                  ┌──────────────────┐
                  │     FastAPI      │
                  │      Python      │
                  └────────┬─────────┘
                           │
                       SQLAlchemy
                           │
                           ▼
                         SQLite
```

## Project Structure

### Frontend

```text
frontend/
├── app/
│   ├── layout.tsx
│   ├── learn/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   └── lesson/
│       └── [id]/
│           └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── AppLayoutClient.tsx
│   │
│   ├── lesson/
│   │   └── RewardNode.tsx
│   │
│   └── profile/
│       ├── Avatars.tsx
│       ├── EditProfileModal.tsx
│       └── ...
│
└── lib/
    └── mockData.ts
```

### Backend

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

## Database Design

The application uses **SQLite with SQLAlchemy**.

The database separates course content from learner-specific progress.

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

| Entity | Purpose |
|---|---|
| User | Learner profile and account |
| Course | Language course |
| Unit | Course section |
| Skill | Learning skill |
| Lesson | Individual lesson |
| Exercise | Lesson question |
| User Progress | Learner-specific progress |
| Achievement | Achievement tracking |
| Follow Relationship | Social connections |

Course content is seeded so the application can be used immediately.

## State Management

React Context is used for application-wide state.

| Data | Storage |
|---|---|
| User information | UserContext |
| Theme | ThemeContext |
| Exercise answers | React state |
| Lesson UI state | React state |
| Modal state | React state |
| XP | Backend / Database |
| Streak | Backend / Database |
| Hearts | Backend / Database |
| Skill progress | Backend / Database |

No external state-management library was required.

## Backend API

The FastAPI backend is organized into feature-specific routers.

| Router | Responsibility |
|---|---|
| `auth.py` | Authentication |
| `courses.py` | Courses, units, skills and lessons |
| `profile.py` | Profile and social features |
| `user.py` | User progression, XP and hearts |

### Example APIs

```text
GET  /api/profile
PUT  /api/profile
```

Additional endpoints handle course data, learner progression, user search, and follow/unfollow operations.

## UI / UX

The application is designed to closely reproduce the Duolingo visual experience.

Key UI elements include:

- Playful gamified interface
- Rounded cards and buttons
- Curved learning path
- Progress indicators
- Animated feedback
- Reward celebrations
- Toast notifications
- Hearts and XP indicators
- Profile statistics
- Responsive layouts
- Custom mascot-style visuals

## Getting Started

### Backend

```bash
cd backend

python -m venv venv
```

For Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

### Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Assumptions / Mocked Data / Notes

- The application uses a seeded language course with a limited set of units, skills, lessons, and exercises as allowed by the assignment.
- Firebase Authentication is used for user authentication.
- Leaderboard and social users are seeded for demonstration purposes.
- Gems, rewards, and heart refill mechanics are implemented with simplified game-economy rules.
- Course content is seeded and designed to demonstrate the complete learning flow rather than represent a full production language curriculum.
- Speech/pronunciation-related recommendations are included as part of the learning experience.
- The primary focus is on reproducing the Duolingo-style UI/UX, lesson flow, progression, gamification, and persistent learner data.

## Author

**Balasa Krishna Chaitanya**

Computer Science Engineering  
VIT-AP University
