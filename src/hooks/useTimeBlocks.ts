import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface TimeBlock {
  id: string;
  user_id: string;
  task_id: string | null;
  title: string;
  start_time: string;
  end_time: string;
  date: string;
  color: string;
}

export function useTimeBlocks(date: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: blocks = [] } = useQuery({
    queryKey: ['time_blocks', user?.id, date],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('time_blocks')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .order('start_time');
      if (error) throw error;
      return data as TimeBlock[];
    },
    enabled: !!user,
  });

  const addBlock = useMutation({
    mutationFn: async (block: { title: string; start_time: string; end_time: string; color?: string; task_id?: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('time_blocks').insert({
        user_id: user.id,
        date,
        title: block.title,
        start_time: block.start_time,
        end_time: block.end_time,
        color: block.color || '#3b82f6',
        task_id: block.task_id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['time_blocks'] }),
    onError: (err: any) => toast.error(err.message),
  });

  const deleteBlock = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('time_blocks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['time_blocks'] }),
    onError: (err: any) => toast.error(err.message),
  });

  return { blocks, addBlock, deleteBlock };
}
