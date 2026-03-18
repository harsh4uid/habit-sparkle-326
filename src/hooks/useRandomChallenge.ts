import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

const CHALLENGE_POOL = [
  { text: 'No phone for 2 hours', xp: 30 },
  { text: 'Complete your hardest task first', xp: 40 },
  { text: 'Double your usual productivity', xp: 50 },
  { text: 'Take a 15-minute walk before working', xp: 20 },
  { text: 'No social media until all tasks are done', xp: 35 },
  { text: 'Complete 3 tasks before noon', xp: 30 },
  { text: 'Do a 45-minute deep focus session', xp: 35 },
  { text: 'Write down 3 things you are grateful for', xp: 15 },
  { text: 'Teach someone something you learned today', xp: 25 },
  { text: 'Start your day with 10 minutes of planning', xp: 20 },
  { text: 'Drink 8 glasses of water today', xp: 15 },
  { text: 'No multitasking — single-task everything', xp: 30 },
  { text: 'Complete all easy tasks within 1 hour', xp: 25 },
  { text: 'Read for 30 minutes', xp: 20 },
  { text: 'End your day by reviewing what you accomplished', xp: 15 },
];

export function useRandomChallenge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: challenge } = useQuery({
    queryKey: ['daily_challenge', user?.id, today],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();
      if (error) throw error;
      if (data) return data as { id: string; challenge_text: string; xp_reward: number; completed: boolean; date: string };
      // Generate one
      const pick = CHALLENGE_POOL[Math.floor(Math.random() * CHALLENGE_POOL.length)];
      const { data: newChallenge, error: insertErr } = await supabase
        .from('daily_challenges')
        .insert({ user_id: user.id, challenge_text: pick.text, xp_reward: pick.xp, date: today })
        .select()
        .single();
      if (insertErr) throw insertErr;
      return newChallenge as { id: string; challenge_text: string; xp_reward: number; completed: boolean; date: string };
    },
    enabled: !!user,
  });

  const completeChallenge = useMutation({
    mutationFn: async () => {
      if (!challenge) throw new Error('No challenge');
      const { error } = await supabase
        .from('daily_challenges')
        .update({ completed: true })
        .eq('id', challenge.id);
      if (error) throw error;
      toast.success(`Challenge completed! +${challenge.xp_reward} XP 🎉`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['daily_challenge'] }),
  });

  return { challenge, completeChallenge };
}
