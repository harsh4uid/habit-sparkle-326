import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface MoodLog {
  id: string;
  user_id: string;
  mood: string;
  energy: string;
  notes: string | null;
  logged_at: string;
}

export function useMoodLogs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const todayStr = new Date().toISOString().slice(0, 10);

  const { data: recentLogs = [] } = useQuery({
    queryKey: ['mood_logs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data as MoodLog[];
    },
    enabled: !!user,
  });

  const todayLog = recentLogs.find((l) => l.logged_at === todayStr);

  const logMood = useMutation({
    mutationFn: async ({ mood, energy, notes }: { mood: string; energy: string; notes?: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('mood_logs').insert({
        user_id: user.id,
        mood,
        energy,
        notes: notes || '',
        logged_at: todayStr,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood_logs'] });
      toast.success('Mood logged!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  return { recentLogs, todayLog, logMood };
}
