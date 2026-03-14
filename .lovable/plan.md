

# Pulse — Habit Tracker Dashboard

A precision-crafted habit tracking dashboard with the functional elegance of Linear and Raycast.

## Core Features

### 1. Habit Grid (Main View)
- Rows = habits, columns = days of the month (1–31, dynamic)
- Clickable cells with satisfying animations (Framer Motion tap/scale)
- Completed cells glow in sage green with subtle shadows
- Inline "Quick Add" row at bottom of grid for fast habit creation

### 2. Habit Management
- Add/Edit/Delete habits via a clean modal form
- Fields: name, category (health, productivity, learning, fitness, mindfulness), frequency (daily/weekly)
- Categories shown as subtle colored badges

### 3. Month/Year Selector
- Dropdown selectors at the top of the dashboard
- Grid dynamically adjusts columns to match days in selected month

### 4. Analytics Panel (Right Sidebar)
- **Overall Completion Rate** — circular progress ring showing total completion percentage
- **Weekly Progress** — 4 circular indicators (Week 1–4) with completion percentages
- **Daily Progress Chart** — Recharts line chart showing daily completion trend across the month

### 5. Weekly Habits Section
- Separate section below the grid for weekly-frequency habits
- Card-based layout with checkbox completion per week

### 6. State & Storage
- Zustand store with `persist` middleware (LocalStorage)
- Normalized state: `habits[]` + `completions { "YYYY-MM-DD": { habitId: true } }`
- Architecture ready for async API swap

### 7. Dark Mode
- Toggle in the header
- Full dark theme using CSS variables

### 8. Responsive Layout
- Desktop: sidebar + grid + analytics panel
- Tablet: stacked layout
- Mobile: single column with collapsible sections

## Design System (Pulse)
- **Font**: Instrument Sans (Google Fonts)
- **Surfaces**: Matte ceramic — soft shadows, no harsh borders
- **Palette**: Cool ceramic white, deep slate text, precision blue accent, sage green success
- **Interactions**: `cubic-bezier(0.2, 0, 0, 1)` transitions, Framer Motion tap animations, staggered row entrances

## Layout Structure
```
┌─────────────────────────────────────────────┐
│ Header: Logo + Month/Year + Dark Mode Toggle│
├────────┬────────────────────┬───────────────┤
│Sidebar │   Habit Grid       │  Analytics    │
│Filters │   (31-col matrix)  │  - Completion │
│& Nav   │   + Quick Add Row  │  - Weekly %   │
│        │                    │  - Line Chart │
├────────┴────────────────────┴───────────────┤
│ Weekly Habits Section (card grid)           │
└─────────────────────────────────────────────┘
```

## Components
- `Dashboard.tsx` — main layout orchestrator
- `HabitGrid.tsx` — the 31-day matrix with inline quick-add
- `HabitForm.tsx` — add/edit modal
- `ProgressChart.tsx` — Recharts line chart
- `WeeklyStats.tsx` — circular progress rings for weeks
- `CompletionRing.tsx` — overall completion donut
- `WeeklyHabits.tsx` — weekly habit cards
- `Sidebar.tsx` — navigation & category filters
- `Header.tsx` — month/year selector + dark mode toggle
- `useHabitStore.ts` — Zustand store with persist

## Dependencies to Add
- `zustand` (state management with persist)
- `framer-motion` (animations)

