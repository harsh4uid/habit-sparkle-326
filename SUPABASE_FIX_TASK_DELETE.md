# Fix Task Deletion Error

## Problem
When deleting a task, you get: "Cannot modify or delete past completions"

## Solution
You need to run a SQL query on your Supabase database to remove the trigger that's blocking deletions.

## Steps to Fix:

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com
- Log into your account
- Select your project: **habit-sparkle-326** (Project ID: xhmrtukpmexguqdkrorf)

### 2. Open SQL Editor
- Click **"SQL Editor"** in the left sidebar
- Click **"New Query"** button

### 3. Copy and Run This SQL:
```sql
DROP TRIGGER IF EXISTS prevent_past_delete ON public.completions;
DROP TRIGGER IF EXISTS prevent_past_update ON public.completions;

CREATE TRIGGER prevent_past_update
  BEFORE UPDATE ON public.completions
  FOR EACH ROW
  WHEN (OLD.completed_date < CURRENT_DATE)
  EXECUTE FUNCTION public.prevent_past_completion_changes();
```

### 4. Execute
- Click the **"Run"** button or press **Ctrl + Enter**
- You should see: ✓ Query executed successfully

### 5. Test
- Go back to the TaskTitan app
- Try deleting a task
- It should work now! ✅

---

**What this does:**
- Removes the `prevent_past_delete` trigger that was blocking task deletion
- Keeps the `prevent_past_update` trigger to prevent manual editing of past completions
- Allows tasks to be deleted without errors
