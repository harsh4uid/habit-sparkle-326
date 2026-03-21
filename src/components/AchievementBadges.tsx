import { useGamification, ACHIEVEMENTS } from '@/hooks/useGamification';
import { cn } from '@/lib/utils';

export function AchievementBadges() {
  const { unlockedAchievements } = useGamification();
  const unlockedKeys = new Set(unlockedAchievements.map((a) => a.achievement_key));

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Achievements</h3>
      <div className="grid grid-cols-2 gap-2">
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = unlockedKeys.has(ach.key);
          return (
            <div
              key={ach.key}
              className={cn(
                'rounded-lg border p-2 text-center transition-all',
                unlocked
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-muted/30 opacity-40'
              )}
            >
              <div className="text-xl">{ach.icon}</div>
              <p className="text-[10px] font-medium text-foreground mt-1">{ach.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
