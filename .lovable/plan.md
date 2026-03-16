

# Work Scheduler — Major Feature Expansion Plan

This is a large set of features. To keep the codebase maintainable, I'll implement them in logical groups across new components and hooks, extending the existing architecture.

## What Already Exists
- Task grid with daily/weekly frequency, category sidebar, analytics panel
- Supabase backend with `tasks`, `completions`, `categories`, `profiles` tables
- Auth (email/password + Google OAuth), dark mode, PDF/PNG export
- Anti-cheating: DB trigger blocks non-today completions, grid locks past cells

## Implementation Plan

### 1. Database Migration — New Tables

Add tables for the new features (all with RLS):

- **`scratchpad_notes`** — `id`, `user_id`, `content` (text), `updated_at` — stores the user's scratchpad
- **`focus_sessions`** — `id`, `user_id`, `task_id` (nullable), `duration_seconds`, `started_at`, `completed_at` — tracks deep work/pomodoro sessions
- **`goals`** — `id`, `user_id`, `title`, `target_value` (int), `current_value` (int), `unit` (text), `created_at` — long-term goal tracking
- **`achievements`** — `id`, `user_id`, `achievement_key` (text), `unlocked_at` — tracks earned badges

Add columns to `tasks` table:
- **`difficulty`** — `text` default `'medium'` (easy/medium/hard) — for XP calculation

Add columns to `profiles` table:
- **`total_xp`** — `integer` default `0`
- **`level`** — `integer` default `1`

### 2. Productivity Dashboard (New Main View)

Create **`ProductivityDashboard.tsx`** — a card-based overview that becomes the landing page above the task grid.

Cards include:
- **Today's Summary** — tasks completed / total scheduled today, missed count
- **Productivity Score** — calculated from completions, focus time, streaks (color-coded: Elite/Good/Average/Weak)
- **Focus Time** — total focus minutes today
- **XP & Level** — current XP, level, progress to next level
- **Streak Tracker** — current consecutive days with 100% completion
- **Priority Tasks** — upcoming uncompleted tasks for today
- **Weekly Chart** — Recharts bar chart of daily completion rates for current week

All data derived from existing `completionMap`, `tasks`, and new `focus_sessions` query.

### 3. Scratchpad / Notebook

Create **`Scratchpad.tsx`** — a textarea panel accessible from the sidebar.

- Store content in `scratchpad_notes` table (one row per user, upsert)
- Auto-save with `useEffect` + debounce (2 second delay)
- Add a "Scratchpad" button in `CategorySidebar.tsx`
- Simple plain text editor (markdown rendering optional via basic formatting)
- Hook: **`useScratchpad.ts`**

### 4. Screenshot Mode

Add a `screenshotMode` boolean to `useUIStore`.

When active:
- Hide `CategorySidebar`, `Header` nav controls, `AnalyticsPanel`
- Show only the task grid and productivity dashboard
- Add a floating "Exit Screenshot Mode" button
- Triggered from Header via a camera icon button

### 5. Gamification System (XP, Levels, Achievements)

**`useGamification.ts`** hook:
- Calculate XP on task completion based on `difficulty` field (10/25/50)
- Update `profiles.total_xp` and `profiles.level` (level = floor(sqrt(total_xp / 100)) + 1)
- Check achievement conditions after each completion

**`AchievementBadges.tsx`** component:
- Display unlocked badges in the dashboard
- Achievement definitions: `7_DAY_STREAK`, `50_TASKS`, `100_FOCUS_MINUTES`, `DEEP_WORK_MASTER`
- Toast notification on unlock

**Task difficulty**: Add difficulty selector to `HabitForm.tsx` (Easy/Medium/Hard).

### 6. Focus Mode (Deep Work / Pomodoro)

Create **`FocusMode.tsx`** — a full-screen overlay component.

- Select a task to focus on (or freestyle)
- Countdown timer (default 25 min, configurable)
- Pomodoro cycle: 25 min work → 5 min break
- On completion: log a `focus_sessions` row, award XP
- Minimal UI: task name, timer, pause/stop buttons
- Hook: **`useFocusTimer.ts`** (manages timer state with `useRef` interval)
- Accessible from Header and from individual task rows

### 7. Productivity Score

**`useProductivityScore.ts`** hook:
- Formula: `(completionRate * 0.4) + (focusScore * 0.3) + (streakScore * 0.3)`
  - `completionRate`: today's completed/scheduled
  - `focusScore`: min(focusMinutesToday / 120, 1) * 100
  - `streakScore`: min(currentStreak / 7, 1) * 100
- Returns score + tier label + color

### 8. Weekly Challenges

**`WeeklyChallenges.tsx`** component:
- Hardcoded challenge templates that rotate/reset weekly:
  - "Complete 30 tasks this week"
  - "Maintain all habits for 7 days"  
  - "Focus for 10 hours"
- Progress calculated from completions and focus_sessions data
- XP reward on challenge completion
- Displayed as cards in the productivity dashboard

### 9. Anti-Procrastination System

**`InactivityPrompt.tsx`** component:
- Track last interaction timestamp in `useUIStore`
- `useEffect` with interval checks every 60 seconds
- If inactive > 3 hours and there are pending tasks today, show modal
- "Do It Now" button picks a random uncompleted today-task and opens Focus Mode

### 10. Goal Progress Tracking

**`Goals.tsx`** component + **`useGoals.ts`** hook:
- CRUD goals in `goals` table
- Display as progress bars in the dashboard
- Manual increment or auto-link to task completions
- Section in the sidebar or below the dashboard cards

### 11. UI/Layout Changes

**Dashboard.tsx restructure:**
```
┌─────────────────────────────────────────────────┐
│ Header (with Screenshot Mode + Focus Mode btns) │
├──────────┬──────────────────────┬───────────────┤
│ Sidebar  │ Main Content         │ Analytics     │
│ - Cats   │ - ProductivityDash   │ (existing)    │
│ - Scratch│ - Task Grid          │ + XP/Level    │
│ - Goals  │ - Weekly Challenges  │ + Achievements│
│          │ - Weekly Tasks       │               │
└──────────┴──────────────────────┴───────────────┘
```

### New Files Summary
| File | Purpose |
|------|---------|
| `src/components/ProductivityDashboard.tsx` | Card-based daily overview |
| `src/components/Scratchpad.tsx` | Quick notes panel |
| `src/components/FocusMode.tsx` | Deep work / pomodoro overlay |
| `src/components/AchievementBadges.tsx` | Gamification badges display |
| `src/components/WeeklyChallenges.tsx` | Challenge cards |
| `src/components/InactivityPrompt.tsx` | Anti-procrastination modal |
| `src/components/Goals.tsx` | Goal progress tracking |
| `src/components/GoalForm.tsx` | Add/edit goal modal |
| `src/hooks/useGamification.ts` | XP/level/achievement logic |
| `src/hooks/useFocusTimer.ts` | Pomodoro timer state |
| `src/hooks/useProductivityScore.ts` | Score calculation |
| `src/hooks/useScratchpad.ts` | Auto-saving notes |
| `src/hooks/useGoals.ts` | Goals CRUD |
| `src/hooks/useFocusSessions.ts` | Focus session queries |

### Edited Files
- `src/stores/useHabitStore.ts` — add `screenshotMode`, `lastInteraction` to UI store
- `src/components/Dashboard.tsx` — integrate all new components
- `src/components/Header.tsx` — add Screenshot Mode + Focus Mode buttons
- `src/components/CategorySidebar.tsx` — add Scratchpad + Goals nav items
- `src/components/HabitForm.tsx` — add difficulty selector
- `src/components/AnalyticsPanel.tsx` — add XP/level display, achievements
- DB migration for new tables + columns

### Implementation Order
1. DB migration (tables + columns)
2. Task difficulty in form
3. Gamification hook + XP tracking
4. Productivity Dashboard cards
5. Focus Mode + Pomodoro
6. Scratchpad
7. Goals
8. Screenshot Mode
9. Weekly Challenges
10. Anti-Procrastination prompt
11. Achievement badges + notifications

