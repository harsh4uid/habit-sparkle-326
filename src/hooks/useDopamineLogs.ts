import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface DopamineLog {
  id: string;
  activity: string;
  type: string;
  duration_minutes: number;
  logged_at: string;
}

export function useDopamineLogs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: logs = [] } = useQuery({
    queryKey: ['dopamine_logs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data, error } = await supabase
        .from('dopamine_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', sevenDaysAgo.toISOString().slice(0, 10))
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DopamineLog[];
    },
    enabled: !!user,
  });

  const addLog = useMutation({
    mutationFn: async (log: { activity: string; type: string; duration_minutes: number }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('dopamine_logs')
        .insert({ user_id: user.id, ...log });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dopamine_logs'] });
      toast.success('Activity logged!');
    },
  });

  const productiveMinutes = logs.filter((l) => l.type === 'productive').reduce((s, l) => s + l.duration_minutes, 0);
  const distractingMinutes = logs.filter((l) => l.type === 'distracting').reduce((s, l) => s + l.duration_minutes, 0);
  const totalMinutes = productiveMinutes + distractingMinutes;
  const balanceScore = totalMinutes > 0 ? Math.round(((productiveMinutes - distractingMinutes) / totalMinutes) * 100) : 0;

  return { logs, addLog, productiveMinutes, distractingMinutes, balanceScore };
}
