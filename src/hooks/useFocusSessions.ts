import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface FocusSession {
  id: string;
  user_id: string;
  task_id: string | null;
  duration_seconds: number;
  started_at: string;
  completed_at: string | null;
}

export function useFocusSessions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const todayStr = new Date().toISOString().slice(0, 10);

  const { data: sessions = [] } = useQuery({
    queryKey: ['focus_sessions', user?.id, todayStr],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('started_at', `${todayStr}T00:00:00`)
        .order('started_at', { ascending: false });
      if (error) throw error;
      return data as FocusSession[];
    },
    enabled: !!user,
  });

  const totalFocusMinutesToday = sessions.reduce((sum, s) => sum + s.duration_seconds, 0) / 60;

  const addSession = useMutation({
    mutationFn: async (session: { task_id?: string; duration_seconds: number }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('focus_sessions').insert({
        user_id: user.id,
        task_id: session.task_id || null,
        duration_seconds: session.duration_seconds,
        completed_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['focus_sessions'] }),
  });

  return { sessions, totalFocusMinutesToday, addSession };
}
