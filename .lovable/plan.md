

# Work Scheduler — Feature Expansion Plan

## Current State

The app already has: productivity dashboard cards, focus mode/pomodoro, scratchpad, screenshot mode, gamification (XP/levels/achievements), weekly challenges, anti-procrastination prompt, goal tracking, categories CRUD, dark mode, PDF/PNG export, and auth. The layout is desktop-first with a fixed sidebar.

## What's New to Build

### 1. Fully Responsive Layout
- **Mobile (< 768px):** Replace sidebar with bottom tab navigation (Tasks, Dashboard, Focus, Tools, Profile). Add a floating action button (FAB) for "Add Task". Stack all dashboard cards single-column.
- **Tablet (768–1024px):** 2-column grid layout, collapsible sidebar.
- **Desktop (> 1024px):** Keep current 3-panel layout.
- Refactor `Dashboard.tsx` and `Header.tsx` to use Tailwind responsive breakpoints. Create `MobileNav.tsx` bottom bar component.

### 2. AI Productivity Coach (Rule-Based)
- New component `AICoach.tsx` — a card in the dashboard showing rule-based insights.
- New hook `useProductivityInsights.ts` that analyzes completionMap patterns:
  - Morning vs evening completion rates → "You're most productive in the morning"
  - Missed task time patterns → "You missed 3 evening tasks. Reduce night workload."
  - Streak analysis → "Great streak! Keep it going."
  - Category imbalance → "You've been neglecting Health tasks."
- Display 2-3 insights as small cards with icons.

### 3. Smart Auto Scheduling
- New component `AutoScheduler.tsx` — a modal where users input tasks with deadlines and priorities.
- Logic distributes tasks across remaining days, balancing workload (max N tasks per day).
- Creates tasks in the existing task system with appropriate `scheduled_days`.
- Simple greedy algorithm: sort by deadline, assign to least-loaded day.

### 4. Brain Training Games
- New section in sidebar: "Brain Tools"
- Four mini-game components in `src/components/games/`:
  - `MemoryFlipGame.tsx` — 4x4 card matching grid
  - `ReactionTimeTest.tsx` — click when screen turns green
  - `MathSprint.tsx` — rapid arithmetic questions
  - `FocusTapGame.tsx` — tap targets as they appear
- Each game: 2-5 min, awards XP on completion, daily limit tracked in localStorage.
- New page/view toggled from sidebar or routed.

### 5. Time Blocking System
- New component `TimeBlockCalendar.tsx` — a day view with hourly slots (6am-midnight).
- New DB table `time_blocks` (id, user_id, task_id nullable, title, start_time, end_time, date, color).
- Drag-to-create blocks, click to assign a task.
- Hook `useTimeBlocks.ts` for CRUD.

### 6. Mood & Energy Tracking
- New DB table `mood_logs` (id, user_id, mood enum, energy enum, logged_at date, notes).
- New component `MoodTracker.tsx` — quick emoji selector shown once daily.
- Hook `useMoodLogs.ts`.
- Display mood/energy trends as a small chart in the dashboard.
- Rule-based suggestions: "Your energy dips on Wednesdays — schedule lighter tasks."

### 7. Failure Recovery System
- New component `FailureRecovery.tsx` — triggered when user has > 3 consecutive missed tasks.
- Suggests: reschedule to tomorrow, break into smaller tasks, reduce daily load.
- Integrates with existing task system to create sub-tasks or reschedule.

### 8. Heatmap Calendar
- New component `HeatmapCalendar.tsx` — GitHub-style yearly contribution grid.
- Green shades = productive days, red = missed, gray = no data.
- Placed in analytics panel or as a dashboard card.
- Uses existing completionMap data.

### 9. Smart Notifications (Enhanced)
- Extend `InactivityPrompt.tsx` with rotating motivational messages.
- Add a `MotivationalToast.tsx` that shows encouraging messages on task completion.
- Messages pool: "Start now. Just 5 minutes.", "Your future self will thank you.", etc.

### 10. Performance Optimization
- Lazy load heavy components: `FocusMode`, `Goals`, game components, `TimeBlockCalendar`.
- Wrap with `React.lazy()` + `Suspense`.
- Memoize expensive calculations in dashboard with `useMemo`.

## Database Migration

New tables needed:
- `time_blocks` — for time blocking calendar
- `mood_logs` — for mood/energy tracking

Both with RLS policies restricting to `auth.uid()`.

## File Structure

```
src/components/
├── games/
│   ├── MemoryFlipGame.tsx
│   ├── ReactionTimeTest.tsx
│   ├── MathSprint.tsx
│   └── FocusTapGame.tsx
├── AICoach.tsx
├── AutoScheduler.tsx
├── TimeBlockCalendar.tsx
├── MoodTracker.tsx
├── FailureRecovery.tsx
├── HeatmapCalendar.tsx
├── MobileNav.tsx
├── MotivationalToast.tsx
src/hooks/
├── useProductivityInsights.ts
├── useTimeBlocks.ts
├── useMoodLogs.ts
```

## Edited Files
- `Dashboard.tsx` — responsive layout, integrate new components
- `Header.tsx` — responsive, hide on mobile (replaced by MobileNav)
- `CategorySidebar.tsx` — add Brain Tools section, responsive collapse
- `AnalyticsPanel.tsx` — add HeatmapCalendar
- `App.tsx` — lazy loading wrappers
- `useHabitStore.ts` — add mobile nav state

## Implementation Order
1. DB migration (time_blocks, mood_logs)
2. Responsive layout (MobileNav, responsive Dashboard/Header)
3. Heatmap Calendar
4. AI Coach (rule-based insights)
5. Mood & Energy Tracker
6. Brain Training Games (4 mini-games)
7. Time Blocking Calendar
8. Auto Scheduler
9. Failure Recovery
10. Smart Notifications
11. Performance optimization (lazy loading)

