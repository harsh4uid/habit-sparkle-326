# TaskTitan - Complete Application Documentation

**Version:** 1.0.0  
**Last Updated:** March 23, 2026  
**Created by:** Braniac Technology

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Architecture & Design](#architecture--design)
7. [Component Guide](#component-guide)
8. [Hooks Reference](#hooks-reference)
9. [Database Schema](#database-schema)
10. [Gamification System](#gamification-system)
11. [Mobile & Responsive Design](#mobile--responsive-design)
12. [Development Guide](#development-guide)
13. [API Integration](#api-integration)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What is TaskTitan?

**TaskTitan** is a comprehensive habit-tracking and productivity application powered by gamification, AI-driven insights, and psychological behavior patterns. It combines daily task management with advanced features like Pomodoro focus sessions, mood tracking, burnout detection, and real-time productivity scoring.

**Core Philosophy:** Build sustainable habits through consistent reinforcement, streak tracking, and achievable micro-rewards while preventing burnout through intelligent workload assessment.

### Key Benefits

- 🎯 **Scientific Habit Tracking**: Use completion rates, streaks, and consistency metrics
- 🧠 **AI-Powered Coaching**: Get personalized insights based on your productivity patterns
- 🔥 **Streak Motivation**: Maintain consecutive daily completion chains
- 💎 **Gamification**: Earn XP, unlock achievements, level up like an RPG
- ⚙️ **Smart Scheduling**: AI-assisted time blocking and task distribution
- 📊 **Real-time Analytics**: Visualize productivity with heatmaps and charts
- 🛡️ **Burnout Prevention**: Automated alerts when workload becomes unsustainable
- 📱 **Mobile-First Design**: Full functionality on phones and tablets
- 🌙 **Dark Mode**: Easy on the eyes with persistent theme preference
- 🔒 **Secure & Private**: End-to-end encryption with row-level database security

---

## Features

### Core Features

#### 1. **Daily Habit Management**
- Create daily and weekly tasks
- Assign difficulty levels (easy/medium/hard) for XP calculation
- Organize tasks by custom categories
- Filter by category via sidebar
- Completion status tracking with visual indicators

#### 2. **Gamification System**
- **XP Earning**: Easy (10) → Medium (25) → Hard (50) XP per task
- **Hard Mode**: 2x XP multiplier for challenge seekers
- **Leveling**: Dynamic level progression (Level = floor(sqrt(XP/100)) + 1)
- **6 Achievements**: First Step, 50 Tasks, 7-Day Streak, 100 Focus Minutes, 10 Focus Sessions, Level 5
- **Weekly Challenges**: 30 tasks/week (+100 XP), 10 hours focus (+150 XP)
- **Daily Random Challenges**: Micro-tasks generating random XP rewards

#### 3. **Focus & Productivity**
- **Pomodoro Timer**: 25-minute work sessions + 5-minute breaks
- **Full-Screen Focus Mode**: Immersive, distraction-free environment
- **Time Blocking Calendar**: Visual daily schedule with drag-and-drop creation
- **Focus Session Tracking**: Records duration and associates with tasks
- **Proof of Work**: Document completion with notes + photos

#### 4. **Analytics & Insights**
- **Completion Ring**: Visual progress indicator for daily completion rate
- **Heatmap Calendar**: GitHub-style activity visualization
- **Progress Charts**: Track trends over time
- **Productivity Score**: Real-time tier (Elite/Good/Average/Weak) based on:
  - Completion rate (40%)
  - Focus minutes (30%)
  - Streak length (30%)
- **Weekly Statistics**: Aggregate metrics and patterns

#### 5. **AI Coach & Behavioral Insights**
- **14-Day Pattern Analysis**: Identifies your peak productivity hours
- **Workload Warnings**: Alerts for overloading (8+ tasks)
- **Category Neglect Detection**: Suggests underutilized categories
- **Streak Encouragement**: Celebrates milestones and progress
- **Personalized Recommendations**: Optimal task scheduling suggestions

#### 6. **Burnout Prevention**
- **Automated Risk Assessment**: Monitors for:
  - Overloaded schedules (8+ tasks)
  - Low completion rates (<30% for 2+ days)
  - Excessive focus time (180+ minutes without break)
- **Recovery Mode**: Motivational messages when streaks break
- **Sustainability Suggestions**: Recommends healthy workload (5-6 tasks/day)

#### 7. **Mood & Energy Tracking**
- **Daily Mood Logging**: 5 emoji options (Great/Good/Neutral/Low/Stressed)
- **Energy Level**: Visual tracking of physical/mental energy
- **7-Day History**: Visual mood trend analysis
- **Correlation Analysis**: Links mood to productivity patterns

#### 8. **Dopamine Awareness**
- **Activity Logging**: Track productive vs distracting activities
- **Duration Tracking**: Minutes spent on each activity
- **Balance Score**: Positive = more productive, Negative = more distracting
- **Alerts**: Suggests replacing low-value dopamine hits

#### 9. **Life Simulation RPG**
- **Four Stats**: Discipline, Focus, Knowledge, Health (0-100 each)
- **Character-Based Progression**: Visual representation of stats
- **Dynamic Updates**: Stats improve with habits and focus sessions
- **Immersive Gamification**: Game-like feel to habit tracking

#### 10. **Advanced Features**
- **Future Self Messages**: Leave notes to your future self, triggered on specific dates
- **Goal Setting**: Long-term objectives with progress tracking
- **Scratchpad Notes**: Quick note-taking during focus sessions
- **Brain Tools**: Mini-games for breaks (Math Sprint, Memory Flip, Reaction Time, Focus Tap)
- **Time Travel Simulation**: Visualize impact of current habits on future self
- **Weekly Planning**: Multi-week calendar view with planning mode toggle

---

## Technology Stack

### Frontend
```
React 18 + TypeScript      - UI framework with type safety
Vite 5.4                   - Lightning-fast build tool
Tailwind CSS               - Utility-first styling
shadcn/ui                  - Component library (40+ components)
Framer Motion              - Smooth animations
```

### State Management
```
Zustand                    - Global UI state (lightweight)
TanStack React Query       - Server state & caching
```

### Backend & Data
```
Supabase                   - Backend-as-a-Service
PostgreSQL                 - Database with RLS policies
Supabase Auth              - Authentication (email + OAuth)
```

### Utilities
```
html2canvas                - Screenshot generation
jsPDF                      - PDF export
Sonner                     - Toast notifications
Lovable Cloud Auth         - OAuth integration
```

### Testing & Dev
```
Vitest                     - Unit test framework
Playwright                 - E2E testing
```

---

## Getting Started

### Prerequisites

- Node.js 18+ with npm
- Git
- Supabase account (free tier available)
- Modern web browser

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/harsh4uid/habit-sparkle-326.git
cd habit-sparkle-326
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Setup
Create `.env` file in root directory:
```env
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
```

Get these values from Supabase Dashboard → Settings → API

#### 4. Database Setup
```bash
# Pull down existing migrations
supabase db pull

# Or manually run migrations in Supabase SQL Editor
# See supabase/migrations/ directory
```

**Important Database Fix:** For task deletion to work, run this SQL in Supabase SQL Editor:
```sql
DROP TRIGGER IF EXISTS prevent_past_delete ON public.completions;
DROP TRIGGER IF EXISTS prevent_past_update ON public.completions;

CREATE TRIGGER prevent_past_update
  BEFORE UPDATE ON public.completions
  FOR EACH ROW
  WHEN (OLD.completed_date < CURRENT_DATE)
  EXECUTE FUNCTION public.prevent_past_completion_changes();
```

#### 5. Start Development Server
```bash
npm run dev
```
Server runs on `http://localhost:8082`

#### 6. Build for Production
```bash
npm run build
```
Output in `dist/` directory (~1.8MB total, ~538KB gzipped)

---

## Project Structure

```
habit-sparkle-326/
├── src/
│   ├── components/                 # React components (30+)
│   │   ├── ui/                     # shadcn/ui components (40+)
│   │   ├── Dashboard.tsx           # Main hub (orchestrates features)
│   │   ├── Header.tsx              # Top navigation
│   │   ├── CategorySidebar.tsx     # Category filters
│   │   ├── HabitGrid.tsx           # Task grid display
│   │   ├── HabitForm.tsx           # Create/edit modal
│   │   ├── GamePanel.tsx           # Brain tools
│   │   ├── FocusMode.tsx           # Pomodoro timer
│   │   ├── TimeBlockCalendar.tsx   # Schedule builder
│   │   ├── AICoach.tsx             # Pattern insights
│   │   ├── BurnoutDetector.tsx     # Workload warnings
│   │   ├── MoodTracker.tsx         # Emotion logging
│   │   ├── DopamineTracker.tsx     # Activity balance
│   │   ├── LifeSimulation.tsx      # RPG stats display
│   │   ├── AchievementBadges.tsx   # Achievements
│   │   ├── AnalyticsPanel.tsx      # Metrics dashboard
│   │   ├── games/                  # Mini-games
│   │   └── ...                     # 15+ more components
│   │
│   ├── hooks/                      # Custom React hooks (20+)
│   │   ├── useAuth.ts              # Authentication
│   │   ├── useTasks.ts             # Task CRUD
│   │   ├── useCompletions.ts       # Task toggles
│   │   ├── useGamification.ts      # XP & achievements
│   │   ├── useLifeStats.ts         # RPG stats
│   │   ├── useFocusTimer.ts        # Pomodoro logic
│   │   ├── useMoodLogs.ts          # Mood tracking
│   │   ├── useDopamineLogs.ts      # Activity logging
│   │   ├── useTimeBlocks.ts        # Schedule data
│   │   └── ...                     # 12+ more hooks
│   │
│   ├── lib/
│   │   ├── habitUtils.ts           # Utility functions
│   │   └── utils.ts                # Helper functions
│   │
│   ├── stores/
│   │   └── useHabitStore.ts        # Zustand global state
│   │
│   ├── integrations/
│   │   ├── supabase/               # Supabase client setup
│   │   └── lovable/                # OAuth integration
│   │
│   ├── pages/
│   │   ├── Auth.tsx                # Login/signup page
│   │   └── ResetPassword.tsx       # Password recovery
│   │
│   ├── App.tsx                     # Root component
│   ├── main.tsx                    # Entry point
│   ├── App.css                     # Global styles
│   └── index.css                   # Base styles
│
├── supabase/
│   ├── config.toml                 # Supabase config
│   └── migrations/                 # Database migrations
│       ├── 20260315050828_initial.sql
│       ├── 20260318152707_extended.sql
│       └── 20260323_fix_cascade_delete.sql
│
├── public/
│   ├── tasktitan-logo.png          # App logo
│   └── robots.txt                  # SEO config
│
├── package.json                    # Dependencies
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript config
├── tailwind.config.ts              # Tailwind config
├── playwright.config.ts            # E2E test config
├── vitest.config.ts                # Unit test config
├── netlify.toml                    # Deployment config
└── README.md
```

---

## Architecture & Design

### Component Hierarchy

```
App
  ├── Auth (if not logged in)
  │
  └── Dashboard (main container)
      ├── Header
      ├── Sidebar (CategorySidebar)
      ├── Main Content Area
      │   ├── FutureSelfMessages
      │   ├── ProductivityDashboard
      │   ├── AICoach
      │   ├── MoodTracker
      │   ├── HabitGrid
      │   ├── TimeBlockCalendar
      │   ├── AnalyticsPanel
      │   ├── WeeklyChallenges
      │   ├── BurnoutDetector
      │   └── FailureRecovery
      ├── MobileNav (mobile only)
      ├── FocusMode (modal)
      ├── BrainTools (modal)
      ├── HabitForm (modal)
      ├── ProofOfWork (modal)
      └── AutoScheduler (modal)
```

### State Management Architecture

#### Zustand Store (useHabitStore.ts)
Manages UI state:
```typescript
{
  // Date & Time
  selectedMonth, selectedYear
  dayEndsAt: "4am" (default)
  
  // UI State
  mobileView: 'dashboard' | 'tasks' | 'focus' | 'tools' | 'profile'
  scratchpadOpen: boolean
  focusModeOpen: boolean
  autoSchedulerOpen: boolean
  brainToolsOpen: boolean
  screenshotMode: boolean
  
  // Planning
  weeklyPlanningEnabled: boolean
  
  // Data Getters
  getCarriedTasks(date)  // Tasks carried from missed day
  getTaskTime(taskId)    // Task scheduled time
  setTaskTime(taskId, time)
}
```

#### React Query (useX.ts Hooks)
Manages server state:
- Queries: `['tasks']`, `['profile']`, `['achievements']`, etc.
- Mutations: `addTask.mutate()`, `deleteTask.mutate()`, etc.
- Auto-caching and invalidation

### Data Flow

```
User Action
  ↓
Component Event Handler
  ↓
Hook Mutation (useTasks, useCompletions, etc.)
  ↓
React Query + Supabase Client
  ↓
Database (PostgreSQL)
  ↓
RLS Policies (verify user ownership)
  ↓
Return Result
  ↓
React Query Cache Invalidation
  ↓
Component Re-render with New Data
  ↓
Zustand Store Update (if UI state changed)
  ↓
Toast Notification (success/error)
```

### Authentication Flow

```
1. AUTH.tsx Page
   ├─ Sign Up (email + password)
   ├─ Sign In (email + password)
   └─ Google OAuth

2. Supabase Auth Trigger
   └─ handle_new_user() function
      ├─ Creates profiles row
      └─ Creates life_stats row

3. Dashboard Loads
   ├─ useAuth() checks session
   ├─ useProfile() loads profile data
   ├─ useTasks() fetches user's tasks
   └─ RLS policies ensure data isolation
```

---

## Component Guide

### Core Components (Most Important)

#### **Dashboard.tsx** (Main Hub)
- **Purpose**: Orchestrates all features, manages main state
- **Key Props**: None (uses hooks directly)
- **Features**: 
  - Renders mobile vs desktop layouts
  - Manages modals (form, focus, scheduler)
  - Handles task completion toggling
  - Manages deletion confirmation
- **Key Functions**:
  ```typescript
  handleToggle(date, taskId)       // Complete/uncomplete task
  handleEditTask(task)              // Open edit modal
  handleDeleteTask(task)            // Show delete confirmation
  handleStartFocus(task)            // Launch focus mode
  ```

#### **HabitGrid.tsx** (Task Display)
- **Purpose**: Render tasks in grid with calendar view
- **Props**: 
  ```typescript
  tasks: Task[]
  completionMap: Record<string, Record<string, string>>
  onToggle: (date, taskId) => void
  onEditTask: (task) => void
  onDeleteTask: (taskId) => void
  ```
- **Features**: 
  - 7-column week view
  - Status indicators (completed/missed/future)
  - Hover-to-reveal edit/delete buttons
  - Tooltip with task metadata

#### **FocusMode.tsx** (Pomodoro)
- **Purpose**: Immersive focus session timer
- **Props**: 
  ```typescript
  open: boolean
  onClose: () => void
  preSelectedTask?: Task
  ```
- **Features**:
  - 25-min focus + 5-min break
  - Full screen with minimal UI
  - Task selection dropdown
  - Automatic break starting
  - Session save to database

#### **AICoach.tsx** (Insights)
- **Purpose**: Display AI-generated productivity patterns
- **Analysis Includes**:
  - Peak productivity hours
  - Category usage patterns
  - Recommended optimal schedule
  - Workload sustainability

#### **MoodTracker.tsx** (Emotion Log)
- **Purpose**: Daily mood + energy capture
- **Moods**: Great/Good/Neutral/Low/Stressed
- **Energy**: High/Medium/Low
- **Display**: 7-day emoji history

---

## Hooks Reference

### Authentication Hooks

#### **useAuth()**
```typescript
const { user, isLoading, signOut } = useAuth();

// Returns
{
  user: User | null                    // Supabase auth user
  isLoading: boolean
  signOut: () => Promise<void>
}
```

#### **useProfile()**
```typescript
const { profile, startDate, hardMode } = useProfile();

// Returns
{
  profile: { total_xp, level, hard_mode, start_date } | null
  startDate: string
  hardMode: boolean
}
```

### Task Management Hooks

#### **useTasks()**
```typescript
const { tasks, isLoading, addTask, updateTask, deleteTask } = useTasks();

// Mutations
addTask.mutate({ name, category_id, frequency, scheduled_days, difficulty })
updateTask.mutate({ id, ...updates })
deleteTask.mutate(taskId)
```

#### **useCompletions(month, year)**
```typescript
const { completionMap, toggleCompletion } = useCompletions(3, 2026);

// completionMap Structure
{
  "2026-03-23": {
    "task-id-1": "2026-03-23",
    "task-id-2": "2026-03-23"
  }
}

// Toggle completion
toggleCompletion.mutate({ date: "2026-03-23", taskId: "task-id-1" })
```

#### **useTimeBlocks(dateString)**
```typescript
const { blocks, addBlock, updateBlock, deleteBlock } = useTimeBlocks("2026-03-23");

// Returns
{
  blocks: [{ id, title, start_time, end_time, color, task_id }, ...]
  addBlock: Mutation
  updateBlock: Mutation
  deleteBlock: Mutation
}
```

### Gamification Hooks

#### **useGamification()**
```typescript
const { totalXP, level, nextLevelXP, progress, awardXP, unlockAchievement } 
  = useGamification();

// Award XP
awardXP.mutate("easy" | "medium" | "hard")

// Unlock achievement
unlockAchievement.mutate("7_DAY_STREAK")
```

#### **useLifeStats()**
```typescript
const { stats, updateStats } = useLifeStats();

// Returns
stats: { discipline, focus, knowledge, health } (each 0-100)

// Update stats
updateStats.mutate({ discipline: 1, focus: 1, knowledge: 1 })
```

### Tracking Hooks

#### **useMoodLogs()**
```typescript
const { moodLog, saveMoodLog } = useMoodLogs();

saveMoodLog.mutate({ 
  mood: "great" | "good" | "neutral" | "low" | "stressed",
  energy: "high" | "medium" | "low",
  notes: string
})
```

#### **useDopamineLogs()**
```typescript
const { logs, addLog } = useDopamineLogs();

addLog.mutate({
  activity: string,
  type: "productive" | "distracting",
  duration_minutes: number
})
```

#### **useFocusTimer()**
```typescript
const { isRunning, timeLeft, isBreak, start, pause, reset } = useFocusTimer();
```

### UI Hooks

#### **use-mobile()**
```typescript
const isMobile = useIsMobile();  // true if viewport < 768px (md breakpoint)
```

#### **use-toast()**
```typescript
const { toast } = useToast();

toast({
  title: "Success",
  description: "Task created",
  variant: "default" | "destructive"
})
```

---

## Database Schema

### Core Tables

#### **profiles**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text,
  total_xp integer DEFAULT 0,
  level integer DEFAULT 1,
  hard_mode boolean DEFAULT false,
  start_date date DEFAULT CURRENT_DATE,
  weekly_planning_enabled boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- RLS Policy: Users manage own profile
```

#### **tasks**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category_id UUID REFERENCES categories(id),
  frequency text DEFAULT 'daily',          -- 'daily' or 'weekly'
  scheduled_days int[] DEFAULT '{}',       -- [0-6] (0=Sun, 6=Sat)
  difficulty text DEFAULT 'medium',        -- 'easy', 'medium', 'hard'
  created_at timestamp DEFAULT now()
);

-- RLS Policy: Users manage own tasks
-- Foreign Key: ON DELETE CASCADE
```

#### **completions**
```sql
CREATE TABLE completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  completed_date date NOT NULL,
  created_at timestamp DEFAULT now(),
  UNIQUE(task_id, completed_date)
);

-- RLS Policy: Users manage own completions
-- Triggers: 
--   - validate_completion_date(): Prevents backdated entries
--   - prevent_past_completion_changes(): Locks historical data
```

#### **categories**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text DEFAULT '#3b82f6',
  position int DEFAULT 0,
  created_at timestamp DEFAULT now()
);
```

### Extended Tables

#### **achievements**
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key text NOT NULL,
  unlocked_at timestamp DEFAULT now(),
  UNIQUE(user_id, achievement_key)
);
```

#### **focus_sessions**
```sql
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  task_id UUID REFERENCES tasks(id),
  duration_seconds integer,
  completed_at timestamp DEFAULT now()
);
```

#### **mood_logs**
```sql
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  mood text,                              -- 'great', 'good', 'neutral', 'low', 'stressed'
  energy text,                            -- 'high', 'medium', 'low'
  notes text,
  logged_at date DEFAULT CURRENT_DATE,
  created_at timestamp DEFAULT now(),
  UNIQUE(user_id, logged_at)
);
```

#### **dopamine_logs**
```sql
CREATE TABLE dopamine_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  activity text,
  type text,                              -- 'productive' or 'distracting'
  duration_minutes integer DEFAULT 0,
  logged_at date DEFAULT CURRENT_DATE,
  created_at timestamp DEFAULT now()
);
```

#### **time_blocks**
```sql
CREATE TABLE time_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  task_id UUID REFERENCES tasks(id),
  title text,
  start_time text,                        -- "14:30" format
  end_time text,                          -- "15:30" format
  date date,
  color text DEFAULT '#3b82f6',
  created_at timestamp DEFAULT now()
);
```

#### **life_stats**
```sql
CREATE TABLE life_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id),
  discipline integer DEFAULT 50,          -- 0-100
  focus integer DEFAULT 50,
  knowledge integer DEFAULT 50,
  health integer DEFAULT 50,
  updated_at timestamp DEFAULT now()
);
```

#### **future_messages**
```sql
CREATE TABLE future_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  message text,
  trigger_after date,
  shown boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);
```

### Row-Level Security (RLS)

All tables have RLS enabled with policies:
```sql
-- Example: Tasks
CREATE POLICY "Users manage own tasks" 
  ON tasks FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);
```

---

## Gamification System

### XP Formula

```typescript
const XP_MAP = {
  'easy': 10,
  'medium': 25,
  'hard': 50
};

function calculateXP(difficulty, hardMode) {
  const base = XP_MAP[difficulty] || 25;
  return hardMode ? base * 2 : base;
}

// Examples:
// Easy task, normal: 10 XP
// Medium task, normal: 25 XP
// Hard task, hard mode: 100 XP
```

### Leveling System

```typescript
function calculateLevel(xp) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Level breakpoints
Level 1: 0 XP
Level 2: 100 XP
Level 3: 400 XP
Level 4: 900 XP
Level 5: 1600 XP
Level 10: 10000 XP
```

### Achievements

| Key | Label | Requirement |
|-----|-------|-------------|
| FIRST_TASK | First Step 🎯 | Complete any task |
| 50_TASKS | 50 Tasks Done ✅ | Reach 50 total completions |
| 7_DAY_STREAK | 7 Day Streak 🔥 | Complete all tasks 7 days in a row |
| 100_FOCUS_MINUTES | 100 Focus Minutes 🧠 | Accumulate 100 minutes total focus time |
| DEEP_WORK_MASTER | Deep Work Master 💎 | Complete 10 focus sessions |
| LEVEL_5 | Level 5 ⭐ | Reach accumulated XP for level 5 |

### Productivity Score

```typescript
function calculateProductivityScore(completionRate, focusMinutes, streakLength) {
  return (
    (completionRate × 0.40) +              // 40% weight
    (Math.min(focusMinutes, 120) / 120 × 0.30) +  // 30% weight (capped at 120)
    ((streakLength / 7) × 0.30)            // 30% weight (normalized to week)
  ) × 100;
}

// Score tiers
90+  → Elite ⭐
70-89 → Good ✓
50-69 → Average -
<50  → Weak ✗
```

### Weekly Challenges

1. **Challenge 1**: Complete 30 tasks this week → +100 XP
2. **Challenge 2**: Focus 10 hours total → +150 XP

---

## Mobile & Responsive Design

### Responsive Breakpoints

Using Tailwind CSS breakpoints:
- **Mobile**: < 640px (sm) - Primary mobile view
- **Tablet**: 640px - 1024px (md) - Tablet/landscape
- **Desktop**: 1024px - 1280px (lg) - Desktop
- **Large Desktop**: 1280px+ (xl) - Wide screens

### Mobile-First Design

#### Bottom Navigation (sm devices)

5 Tabs:
1. **Dashboard** ▢ - Overview, daily stats
2. **Tasks** ✓ - Habit grid, time blocks
3. **Focus** ⏱ - Pomodoro timer
4. **Tools** 🎮 - Brain tools/mini-games
5. **Profile** 👤 - Settings, achievements

#### Floating Action Button (FAB)
- **Position**: Fixed bottom-right
- **Action**: Quick add task
- **Size**: Adaptive (sm: 48px, md: 56px)

#### Responsive Components

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Header | Compact, logo only | Full with menu |
| Sidebar | Hidden | Visible left side |
| HabitGrid | Stacked cards | Grid layout |
| Modal | Full screen | Centered popup |
| Charts | Simplified | Full detail |

### Dark Mode

- **Default**: On (prefers-color-scheme: dark)
- **Toggle**: Header toggle button on desktop, settings on mobile
- **Persistence**: Saved to localStorage as 'ws-dark-mode'
- **CSS**: TailwindCSS dark: class selector

---

## Development Guide

### Local Development

```bash
# Start dev server
npm run dev
# → http://localhost:8082 with HMR enabled

# Build for production
npm run build
# → Outputs to dist/

# Preview production build
npm run preview

# Run tests
npm run test            # Unit tests with Vitest
npm run test:e2e       # E2E tests with Playwright

# Linting
npm run lint            # ESLint check
npm run format          # Prettier formatting
```

### Code Style

#### TypeScript
- Strict mode enabled
- Type all function signatures
- Use `type` over `interface` for simple types

#### React
- Functional components only
- Custom hooks for logic reuse
- Avoid unnecessary re-renders with useMemo/useCallback

#### Naming Conventions
```
Components:   PascalCase (HabitGrid.tsx)
Hooks:        camelCase starting with 'use' (useTasks.ts)
Utils:        camelCase (habitUtils.ts)
Constants:    UPPER_SNAKE_CASE (XP_MAP, ACHIEVEMENTS)
Boolean var:  is*/has* prefix (isLoading, hasError)
```

### Adding New Features

#### Step 1: Create data model in database
```sql
-- Add migration file in supabase/migrations/
-- Follow naming: YYYYMMDDHHMMSS_description.sql
```

#### Step 2: Create hook for data fetching
```typescript
// src/hooks/useNewFeature.ts
export function useNewFeature() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['newFeature', user?.id],
    queryFn: async () => {
      // Fetch from Supabase
    }
  });

  return { data };
}
```

#### Step 3: Create component
```typescript
// src/components/NewFeature.tsx
import { useNewFeature } from '@/hooks/useNewFeature';

export function NewFeature() {
  const { data } = useNewFeature();
  
  return (
    // Component JSX
  );
}
```

#### Step 4: Integrate into Dashboard
```typescript
// Dashboard.tsx
import { NewFeature } from './NewFeature';

// Add to render:
{newFeatureEnabled && <NewFeature />}
```

### Common Patterns

#### Handling Async Data
```typescript
const { data, isLoading, error } = useQuery({...});

if (isLoading) return <Skeleton />;
if (error) return <Error message={error.message} />;

return <div>{/* render data */}</div>;
```

#### Creating Mutations
```typescript
const mutation = useMutation({
  mutationFn: async (input) => {
    const { data, error } = await supabase.from('table').insert(input);
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['table'] });
    toast.success('Success!');
  },
  onError: (err) => toast.error(err.message)
});

// Usage
mutation.mutate(input);
```

#### Zustand Store Access
```typescript
import { useUIStore } from '@/stores/useHabitStore';

function MyComponent() {
  const { mobileView, setMobileView } = useUIStore();
  
  return <button onClick={() => setMobileView('tasks')}>Go to Tasks</button>;
}
```

---

## API Integration

### Supabase Client Setup

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
);
```

### Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Sign out
await supabase.auth.signOut();

// Get current session
const { data: { session } } = await supabase.auth.getSession();
```

### Database Operations

```typescript
// Select
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId);

// Insert
const { data, error } = await supabase
  .from('tasks')
  .insert({ name: 'New Task', user_id: userId })
  .select();

// Update
const { error } = await supabase
  .from('tasks')
  .update({ name: 'Updated' })
  .eq('id', taskId);

// Delete
const { error } = await supabase
  .from('tasks')
  .delete()
  .eq('id', taskId);
```

---

## Deployment

### Netlify Deployment (Recommended)

#### Prerequisites
- GitHub account with repo
- Netlify account

#### Steps

1. **Push code to GitHub**
```bash
git add -A
git commit -m "Feature: Description"
git push origin main
```

2. **Connect to Netlify**
   - Go to netlify.com → "New site from Git"
   - Select your GitHub repo
   - Choose main branch

3. **Set Environment Variables**
   - Netlify Dashboard → Site settings → Build & deploy → Environment
   - Add:
     ```
     VITE_SUPABASE_PROJECT_ID
     VITE_SUPABASE_PUBLISHABLE_KEY
     VITE_SUPABASE_URL
     ```

4. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (These are auto-detected from netlify.toml)

5. **Deploy**
   - Site automatically deploys on every push to main
   - Automatic preview deployments for pull requests

#### Vercel Deployment (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Self-Hosted Deployment

```bash
# Build production bundle
npm run build

# Serve dist folder with any static host:
# - Nginx
# - Apache
# - Express
# - Caddy
# - etc.

# Example with Express:
npm install express serve-static

# Create server.js:
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(3000);
```

---

## Troubleshooting

### Common Issues

#### Build Errors

**Error**: "Cannot find module '@/components/ui/...'"
- **Cause**: Missing shadcn component
- **Fix**: `npx shadcn-ui@latest add [component-name]`

**Error**: "Supabase API key missing"
- **Cause**: Missing .env file or incorrect credentials
- **Fix**: Verify `.env` file exists with correct Supabase keys

#### Runtime Errors

**Error**: "Cannot modify or delete past completions"
- **Cause**: Database trigger preventing cascade deletes
- **Fix**: Run the SQL migration from `SUPABASE_FIX_TASK_DELETE.md`

**Error**: "User not authenticated"
- **Cause**: Session expired or not logged in
- **Fix**: Clear localStorage and login again

#### Mobile Issues

**Problem**: UI cut off on mobile
- **Cause**: Viewport meta tag missing
- **Fix**: Verify index.html has `<meta name="viewport" content="width=device-width, initial-scale=1" />`

**Problem**: Bottom nav not appearing
- **Cause**: CSS media query issue
- **Fix**: Check `MobileNav.tsx` - should render only on md:hidden

### Performance Optimization

#### Code Splitting
- Lazy load modals with React.lazy()
- Split route components
- Use dynamic imports for games

#### Caching
- React Query auto-caches server state
- localStorage for UI preferences
- Service Workers for offline support (future)

#### Bundle Size
- Currently: 1.8MB total, 538KB gzipped
- Consider: Tree-shaking unused components
- Audit: `npm run build -- --analyze`

### Getting Help

1. **Check migration files** in `supabase/migrations/`
2. **Review component docs** at top of each component file
3. **Consult Supabase docs**: https://supabase.com/docs
4. **React Query docs**: https://tanstack.com/query/latest
5. **Tailwind docs**: https://tailwindcss.com/docs

---

## Contributing

### Reporting Bugs

Create GitHub issue with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/device info

### Submitting Features

1. Fork repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am "Add my feature"`
4. Push branch: `git push origin feature/my-feature`
5. Submit pull request with description

---

## License & Attribution

**TaskTitan** - Made by Braniac Technology  
Built with ❤️ using React, Supabase, and Tailwind CSS

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Mar 23, 2026 | Initial release with all core features |

---

**Last Updated**: March 23, 2026  
**Maintainer**: Braniac Technology  
**GitHub**: https://github.com/harsh4uid/habit-sparkle-326
