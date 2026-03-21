import { useGamification, xpForLevel } from '@/hooks/useGamification';
import { useAuth } from '@/hooks/useAuth';
import { AchievementBadges } from './AchievementBadges';
import { Goals } from './Goals';
import { HardModeToggle } from './HardModeToggle';
import { LifeSimulation } from './LifeSimulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Zap, LogOut, Moon, Sun } from 'lucide-react';

interface Props {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function MobileProfileView({ darkMode, onToggleDarkMode }: Props) {
  const { totalXP, level, progress, nextLevelXP } = useGamification();
  const { signOut } = useAuth();

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" /> Level {level}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-foreground">{totalXP} <span className="text-xs font-normal text-muted-foreground">XP</span></div>
          <Progress value={progress} className="h-2" />
          <span className="text-[10px] text-muted-foreground">Next: {nextLevelXP} XP</span>
        </CardContent>
      </Card>

      <HardModeToggle />
      <LifeSimulation />
      <AchievementBadges />
      <Goals />

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 gap-2" onClick={onToggleDarkMode}>
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
        <Button variant="outline" className="gap-2 text-destructive" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
