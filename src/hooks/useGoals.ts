import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_value: number;
  current_value: number;
  unit: string;
  created_at: string;
}

export function useGoals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: goals = [] } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as Goal[];
    },
    enabled: !!user,
  });

  const addGoal = useMutation({
    mutationFn: async (goal: { title: string; target_value: number; unit: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('goals').insert({ ...goal, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal added');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateGoal = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Goal> & { id: string }) => {
      const { error } = await supabase.from('goals').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
    onError: (err: any) => toast.error(err.message),
  });

  const deleteGoal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('goals').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal deleted');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const incrementGoal = useMutation({
    mutationFn: async ({ id, amount = 1 }: { id: string; amount?: number }) => {
      const goal = goals.find((g) => g.id === id);
      if (!goal) throw new Error('Goal not found');
      const newVal = Math.min(goal.current_value + amount, goal.target_value);
      const { error } = await supabase.from('goals').update({ current_value: newVal }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
    onError: (err: any) => toast.error(err.message),
  });

  return { goals, addGoal, updateGoal, deleteGoal, incrementGoal };
}
