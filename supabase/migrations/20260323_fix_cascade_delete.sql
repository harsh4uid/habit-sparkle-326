-- Fix: Allow task deletion to cascade delete completions
-- The prevent_past_delete trigger was preventing cascade deletes when tasks are deleted
-- We'll simply drop it to allow CASCADE DELETE to work properly
-- Anti-cheating will be handled through application logic instead

DROP TRIGGER IF EXISTS prevent_past_delete ON public.completions;

-- Keep the prevent_past_update trigger to prevent users from manually editing past completion records
-- But only prevent updates, not cascade deletes
DROP TRIGGER IF EXISTS prevent_past_update ON public.completions;

CREATE TRIGGER prevent_past_update
  BEFORE UPDATE ON public.completions
  FOR EACH ROW
  WHEN (OLD.completed_date < CURRENT_DATE)
  EXECUTE FUNCTION public.prevent_past_completion_changes();

