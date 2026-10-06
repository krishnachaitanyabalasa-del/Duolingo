# 🦉 Duolingo Web App Frontend

A highly polished, gamified, modern **Duolingo-inspired web application** built with **Next.js**, **TypeScript**, **React**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌟 Key Highlights & Design System

- **Duolingo Aesthetics**: Vibrant color system (`#58cc02` Feather Green, Sky Blue, Rose, Gold), tactile 3D pushable buttons (`border-b-4 active:translate-y-1`), rounded cards, progress rings, and playful micro-animations.
- **5 Exercise Types**:
  1. `MULTIPLE_CHOICE`: 4 options with audio playback button and keyboard shortcuts (1, 2, 3, 4).
  2. `TRANSLATE`: Interactive word bank chips to assemble translated sentences.
  3. `MATCH_PAIRS`: 2-column interactive word pair matching with real-time match/mismatch feedback.
  4. `FILL_BLANK`: Sentence card with interactive inline word selection tiles.
  5. `TYPE_ANSWER`: Spanish text input with quick character accent shortcuts (`á`, `é`, `í`, `ó`, `ú`, `ñ`, `¿`, `¡`).
- **Gamification Mechanics**: Persistent top bar tracking **🔥 Streak**, **⚡ XP**, **💎 Gems**, and **❤️ Hearts** with out-of-hearts refill flow.
- **Web Audio Sound Effects Engine**: Built-in sound synthesis for correct chimes, incorrect buzzes, button taps, and celebratory lesson fanfare.
- **Celebration Screen**: Confetti explosion on lesson complete with XP reward summary and streak increment counter.
- **Dual Operating Mode**: Seamless fallback mock data engine for standalone offline execution + REST API integration layer ready to connect with FastAPI.

---

## 📁 Repository Structure

```
duolingo-clone/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with fonts & AppLayoutClient
│   │   ├── globals.css        # Duolingo 3D button utility classes & color tokens
│   │   ├── page.tsx           # Entry page
│   │   ├── learn/             # Vertical snake learning path page
│   │   ├── lesson/[id]/       # Dynamic full-screen lesson player session
│   │   ├── profile/           # User stats, achievements grid, and profile card
│   │   ├── leaderboard/       # Weekly podium (1st, 2nd, 3rd) and league list
│   │   └── settings/          # User preferences, sound toggle, daily goal, dark mode
│   ├── components/
│   │   ├── layout/            # TopBar, Sidebar, MobileNav, AppLayoutClient
│   │   ├── gamification/      # StreakDisplay, XPDisplay, HeartsDisplay, GemsDisplay
│   │   ├── learn/             # UnitHeader, SkillNode, SkillPath, LessonModal
│   │   ├── lesson/            # LessonPlayer, LessonHeader, LessonProgress, ExerciseRenderer,
│   │   │                      # MultipleChoice, TranslateExercise, MatchPairs, FillBlank,
│   │   │                      # TypeAnswer, AnswerFeedback, LessonComplete, OutOfHearts
│   │   ├── profile/           # UserCard, StatsCard, AchievementsGrid
│   │   └── leaderboard/       # Podium, LeaderboardList
│   ├── hooks/                 # useUser, useCourse, useLesson, useLeaderboard
│   ├── lib/
│   │   ├── api/               # Centralized REST API layer (client, course, lesson, user, leaderboard)
│   │   ├── mockData.ts        # Comprehensive mock data store
│   │   └── sound.ts           # Web Audio API synthesizer for sound effects
│   ├── types/                 # TypeScript type definitions
│   └── package.json
└── backend/                   # Python / FastAPI backend (developed independently)
```

---

## 🚀 Getting Started

### 1. Install Dependencies
Navigate into the `frontend` directory and install dependencies:

```bash
cd frontend
npm install
```

### 2. Run Locally in Development Mode
Start the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🔌 API Integration & Switching from Mock Data to FastAPI

The frontend communicates with the backend via a centralized API layer inside `lib/api/`.

### Environment Variables
Create a `.env.local` file inside `frontend/` to configure the API:

```env
# URL of the FastAPI backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Set to 'false' to connect directly to live FastAPI endpoints.
# Set to 'true' (or omit) to use the mock data engine for offline development.
NEXT_PUBLIC_USE_MOCK=false
```

### Expected REST Endpoints Covered:
- `GET /api/course` – Returns course units and skill node paths.
- `GET /api/user` – Returns user profile details, streak, XP, hearts, and gems.
- `GET /api/achievements` – Returns achievements progress list.
- `GET /api/lessons/{lesson_id}` – Returns lesson details and exercise questions.
- `POST /api/lessons/{lesson_id}/start` – Starts a lesson session.
- `POST /api/lessons/{lesson_id}/answer` – Evaluates user answer submission.
- `POST /api/lessons/{lesson_id}/complete` – Marks lesson as finished and computes rewards.
- `POST /api/hearts/refill` – Refills hearts using gems.
- `GET /api/leaderboard` – Returns weekly league rankings.

---

## 🛠️ Verification Commands

To verify TypeScript types and production build integrity:

```bash
npm run build
```
