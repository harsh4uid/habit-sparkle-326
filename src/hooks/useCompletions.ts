import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useCompletions(month: number, year: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch completions for the selected month
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDay = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

  const { data: completions = [], isLoading } = useQuery({
    queryKey: ['completions', user?.id, month, year],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_date', startDate)
        .lte('completed_date', endDate);
      if (error) throw error;
      return data as { id: string; task_id: string; completed_date: string; user_id: string }[];
    },
    enabled: !!user,
  });

  // Build a lookup: { "YYYY-MM-DD": { taskId: completionId } }
  const completionMap: Record<string, Record<string, string>> = {};
  for (const c of completions) {
    if (!completionMap[c.completed_date]) completionMap[c.completed_date] = {};
    completionMap[c.completed_date][c.task_id] = c.id;
  }

  const toggleCompletion = useMutation({
    mutationFn: async ({ date, taskId }: { date: string; taskId: string }) => {
      if (!user) throw new Error('Not authenticated');
      const existing = completionMap[date]?.[taskId];
      if (existing) {
        const { error } = await supabase.from('completions').delete().eq('id', existing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('completions').insert({
          user_id: user.id,
          task_id: taskId,
          completed_date: date,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completions'] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  return { completions, completionMap, isLoading, toggleCompletion };
}
