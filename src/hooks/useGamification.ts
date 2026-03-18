import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

const XP_MAP: Record<string, number> = { easy: 10, medium: 25, hard: 50 };

function getHardMode(profile: any): boolean {
  return profile?.hard_mode === true;
}

export const ACHIEVEMENTS = [
  { key: '7_DAY_STREAK', label: '7 Day Streak', description: 'Complete all tasks for 7 consecutive days', icon: '🔥' },
  { key: '50_TASKS', label: '50 Tasks Done', description: 'Complete 50 total tasks', icon: '✅' },
  { key: '100_FOCUS_MINUTES', label: '100 Focus Minutes', description: 'Accumulate 100 minutes of focus time', icon: '🧠' },
  { key: 'DEEP_WORK_MASTER', label: 'Deep Work Master', description: 'Complete 10 focus sessions', icon: '💎' },
  { key: 'FIRST_TASK', label: 'First Step', description: 'Complete your first task', icon: '🎯' },
  { key: 'LEVEL_5', label: 'Level 5', description: 'Reach level 5', icon: '⭐' },
] as const;

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 100;
}

export function useGamification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('total_xp, level')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data as { total_xp: number; level: number };
    },
    enabled: !!user,
  });

  const { data: unlockedAchievements = [] } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return data as { id: string; achievement_key: string; unlocked_at: string }[];
    },
    enabled: !!user,
  });

  const awardXP = useMutation({
    mutationFn: async (difficulty: string) => {
      if (!user || !profile) throw new Error('Not ready');
      const xp = XP_MAP[difficulty] || 25;
      const newTotal = profile.total_xp + xp;
      const newLevel = calculateLevel(newTotal);
      const { error } = await supabase
        .from('profiles')
        .update({ total_xp: newTotal, level: newLevel })
        .eq('id', user.id);
      if (error) throw error;
      if (newLevel > profile.level) {
        toast.success(`🎉 Level Up! You're now level ${newLevel}!`);
      }
      return { xp, newTotal, newLevel };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  const unlockAchievement = useMutation({
    mutationFn: async (key: string) => {
      if (!user) throw new Error('Not authenticated');
      if (unlockedAchievements.some((a) => a.achievement_key === key)) return;
      const { error } = await supabase
        .from('achievements')
        .insert({ user_id: user.id, achievement_key: key });
      if (error && !error.message.includes('duplicate')) throw error;
      const ach = ACHIEVEMENTS.find((a) => a.key === key);
      if (ach) toast.success(`🏆 Achievement Unlocked: ${ach.label}!`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['achievements'] }),
  });

  const totalXP = profile?.total_xp || 0;
  const level = profile?.level || 1;
  const nextLevelXP = xpForLevel(level + 1);
  const currentLevelXP = xpForLevel(level);
  const progress = nextLevelXP > currentLevelXP ? ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 0;

  return {
    totalXP,
    level,
    progress,
    nextLevelXP,
    unlockedAchievements,
    awardXP,
    unlockAchievement,
  };
}
