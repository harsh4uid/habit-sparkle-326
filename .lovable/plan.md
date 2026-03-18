

# Work Scheduler — Premium Feature Expansion Plan

## Critical Bug Fix

**Problem:** The heatmap, streak calculator, AI coach, and failure recovery all loop back 365/14/7 days regardless of when the user started. This creates false "missed" data before the user existed.

**Fix:** Add a `start_date` column to `profiles` table (default `CURRENT_DATE`, set on profile creation). Then pass `startDate` through a React context/hook and clamp all date-range loops to not go before it. Affected files:
- `src/lib/habitUtils.ts` — add `isAfterStartDate(date, startDate)` utility
- `src/components/HeatmapCalendar.tsx` — skip days before startDate (show gray)
- `src/components/Dashboard.tsx` — pass startDate to streak calculator
- `src/components/AICoach.tsx` — clamp analysis window
- `src/components/FailureRecovery.tsx` — clamp lookback
- `src/components/ProductivityDashboard.tsx` — clamp weekly data
- `src/hooks/useGamification.ts` — fetch startDate from profile

## Database Migration

Add to `profiles`:
- `start_date` date DEFAULT CURRENT_DATE

New tables:
- **`future_messages`** — `id`, `user_id`, `message` (text), `trigger_after` (date), `shown` (bool), `created_at`
- **`life_stats`** — `id`, `user_id`, `discipline` (int default 50), `focus` (int default 50), `knowledge` (int default 50), `health` (int default 50), `updated_at`
- **`dopamine_logs`** — `id`, `user_id`, `activity` (text), `type` (text: productive/distracting), `duration_minutes` (int), `logged_at` (date)
- **`proof_of_work`** — `id`, `user_id`, `task_id`, `note` (text), `image_url` (text nullable), `created_at`
- **`daily_challenges`** — `id`, `user_id`, `challenge_text` (text), `xp_reward` (int), `completed` (bool), `date` (date)

Storage bucket: `proof-images` (public) for proof-of-work image uploads.

All tables with RLS: `auth.uid() = user_id`.

## New Features (12 components + 8 hooks)

### 1. Future Self System
- **`FutureSelfMessages.tsx`** — Card to write messages + display triggered ones
- **`useFutureMessages.ts`** — CRUD hook; on dashboard load, check for messages where `trigger_after <= today AND shown = false`, show as a banner

### 2. Life Simulation (Virtual Character)
- **`LifeSimulation.tsx`** — Visual card showing 4 attribute bars (Discipline, Focus, Knowledge, Health)
- **`useLifeStats.ts`** — On task completion: +2 to relevant attributes. On missed day: -1. Capped 0-100.
- Display in analytics panel sidebar

### 3. Hard Mode Toggle
- Add `hard_mode` boolean to `profiles`
- **`HardModeToggle.tsx`** — Switch in profile/settings area
- When on: XP multiplied by 2, missed tasks cause XP loss (-10), no streak protection
- Modify `useGamification.ts` to check hard mode flag

### 4. Dopamine Tracker
- **`DopamineTracker.tsx`** — Log productive vs distracting activities with duration
- **`useDopamineLogs.ts`** — CRUD + calculate balance score
- Balance = (productive_minutes - distracting_minutes) / total_minutes * 100
- Show insights when balance is negative

### 5. Time Travel Simulation
- **`TimeTravelSimulation.tsx`** — Card showing "If you continue for 30 days..." projections
- Uses current completion rate to extrapolate tasks completed, XP gained, level reached
- Also shows negative scenario if rate drops to 0

### 6. Proof of Work
- **`ProofOfWork.tsx`** — Modal after completing important (hard) tasks asking for optional proof
- Image upload to `proof-images` storage bucket
- Text notes stored in `proof_of_work` table
- **`useProofOfWork.ts`** — CRUD hook

### 7. Random Challenge Generator
- **`RandomChallenge.tsx`** — Daily challenge card with refresh
- Challenge pool of 15+ templates (no phone 2hrs, hardest task first, etc.)
- One challenge per day, stored in `daily_challenges` table
- XP reward on self-reported completion

### 8. Burnout Detection
- **`BurnoutDetector.tsx`** — Analyzes: >8 tasks/day, <30% completion for 3+ days, >3hrs focus without break
- Shows warning card with suggestions to reduce load
- Rule-based, computed from existing data

### 9. Enhanced AI Coach
- Extend existing `AICoach.tsx` with new insight rules:
  - Burnout risk patterns
  - Dopamine balance warnings
  - Life stat trends
  - Hard mode encouragement

## Premium UI Upgrades

### Visual Polish
- Update `src/index.css` with glassmorphism card variant: `backdrop-blur-xl bg-card/80 border-white/10`
- Add subtle hover scale transforms on cards: `hover:scale-[1.01] transition-transform`
- Improve typography spacing and hierarchy across dashboard cards
- Add gradient accent backgrounds to key metric cards (score, XP, streak)
- Smooth progress bar animations via CSS transitions

### Micro-Interactions
- Task completion: brief scale + checkmark animation via CSS keyframes
- XP gain: floating "+25 XP" text animation
- Level up: pulsing glow effect on level card
- Add `@keyframes` in index.css for these

### Dark Mode as Default
- Set dark mode default to `true` in Dashboard state initialization

## Implementation Order

1. DB migration (profiles.start_date, profiles.hard_mode, 5 new tables, storage bucket)
2. Start date bug fix across all components
3. Life Simulation + Life Stats hook
4. Hard Mode toggle + XP modifier
5. Future Self messages
6. Dopamine Tracker
7. Time Travel Simulation
8. Proof of Work (with storage)
9. Random Challenge Generator
10. Burnout Detection
11. UI polish (glassmorphism, animations, micro-interactions)
12. Enhanced AI Coach insights

## Files Created
| File | Purpose |
|------|---------|
| `src/components/FutureSelfMessages.tsx` | Write/view future self messages |
| `src/components/LifeSimulation.tsx` | Virtual character attributes |
| `src/components/HardModeToggle.tsx` | Hard mode switch |
| `src/components/DopamineTracker.tsx` | Log productive/distracting activities |
| `src/components/TimeTravelSimulation.tsx` | 30-day projection |
| `src/components/ProofOfWork.tsx` | Post-completion proof modal |
| `src/components/RandomChallenge.tsx` | Daily random challenge |
| `src/components/BurnoutDetector.tsx` | Overwork warning |
| `src/hooks/useFutureMessages.ts` | Future messages CRUD |
| `src/hooks/useLifeStats.ts` | Life simulation CRUD |
| `src/hooks/useDopamineLogs.ts` | Dopamine tracking |
| `src/hooks/useProofOfWork.ts` | Proof of work CRUD |
| `src/hooks/useRandomChallenge.ts` | Daily challenge logic |

## Files Modified
- `src/components/Dashboard.tsx` — integrate new components, pass startDate
- `src/components/AnalyticsPanel.tsx` — add LifeSimulation, DopamineTracker
- `src/components/HeatmapCalendar.tsx` — clamp to startDate
- `src/components/AICoach.tsx` — add new insight rules
- `src/components/FailureRecovery.tsx` — clamp to startDate
- `src/components/ProductivityDashboard.tsx` — clamp to startDate, add gradient cards
- `src/components/MobileProfileView.tsx` — add HardMode toggle
- `src/hooks/useGamification.ts` — hard mode XP modifier, fetch startDate
- `src/lib/habitUtils.ts` — add startDate utility
- `src/index.css` — glassmorphism classes, keyframe animations
- `src/stores/useHabitStore.ts` — add hardMode to UI state

