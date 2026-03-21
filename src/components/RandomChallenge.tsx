import { useRandomChallenge } from '@/hooks/useRandomChallenge';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dice5, CheckCircle2, Sparkles } from 'lucide-react';

export function RandomChallenge() {
  const { challenge, completeChallenge } = useRandomChallenge();
  const { awardXP } = useGamification();

  if (!challenge) return null;

  const handleComplete = () => {
    completeChallenge.mutate(undefined, {
      onSuccess: () => {
        awardXP.mutate('medium'); // Award XP via gamification system too
      },
    });
  };

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Dice5 className="h-4 w-4 text-primary" /> Daily Challenge
          <span className="ml-auto text-[10px] text-muted-foreground">+{challenge.xp_reward} XP</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-foreground font-medium">{challenge.challenge_text}</p>
        {challenge.completed ? (
          <div className="flex items-center gap-2 text-accent text-xs">
            <CheckCircle2 className="h-4 w-4" /> Completed! Well done.
          </div>
        ) : (
          <Button size="sm" variant="outline" className="w-full text-xs gap-1" onClick={handleComplete}>
            <Sparkles className="h-3 w-3" /> Mark Complete
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
