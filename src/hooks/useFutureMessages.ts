import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface FutureMessage {
  id: string;
  message: string;
  trigger_after: string;
  shown: boolean;
  created_at: string;
}

export function useFutureMessages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['future_messages', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('future_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as FutureMessage[];
    },
    enabled: !!user,
  });

  const triggeredMessages = messages.filter(
    (m) => !m.shown && m.trigger_after <= new Date().toISOString().slice(0, 10)
  );

  const addMessage = useMutation({
    mutationFn: async ({ message, triggerAfter }: { message: string; triggerAfter: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('future_messages')
        .insert({ user_id: user.id, message, trigger_after: triggerAfter });
      if (error) throw error;
      toast.success('Message to your future self saved!');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['future_messages'] }),
  });

  const markShown = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('future_messages')
        .update({ shown: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['future_messages'] }),
  });

  return { messages, triggeredMessages, addMessage, markShown };
}
