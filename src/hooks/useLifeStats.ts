import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface LifeStats {
  discipline: number;
  focus: number;
  knowledge: number;
  health: number;
}

export function useLifeStats() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['life_stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('life_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error) {
        // Create if not exists
        if (error.code === 'PGRST116') {
          const { data: newData, error: insertErr } = await supabase
            .from('life_stats')
            .insert({ user_id: user.id })
            .select()
            .single();
          if (insertErr) throw insertErr;
          return newData as LifeStats;
        }
        throw error;
      }
      return data as LifeStats;
    },
    enabled: !!user,
  });

  const updateStats = useMutation({
    mutationFn: async (changes: Partial<LifeStats>) => {
      if (!user || !stats) throw new Error('Not ready');
      const updated: LifeStats = {
        discipline: Math.max(0, Math.min(100, (stats.discipline || 50) + (changes.discipline || 0))),
        focus: Math.max(0, Math.min(100, (stats.focus || 50) + (changes.focus || 0))),
        knowledge: Math.max(0, Math.min(100, (stats.knowledge || 50) + (changes.knowledge || 0))),
        health: Math.max(0, Math.min(100, (stats.health || 50) + (changes.health || 0))),
      };
      const { error } = await supabase
        .from('life_stats')
        .update({ ...updated, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
      if (error) throw error;
      return updated;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['life_stats'] }),
  });

  return {
    stats: stats || { discipline: 50, focus: 50, knowledge: 50, health: 50 },
    updateStats,
  };
}
