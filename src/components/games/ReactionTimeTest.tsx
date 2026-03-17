import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/hooks/useGamification';

type Phase = 'idle' | 'waiting' | 'ready' | 'result';

export function ReactionTimeTest() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [reactionTime, setReactionTime] = useState(0);
  const [bestTime, setBestTime] = useState(Infinity);
  const [attempts, setAttempts] = useState(0);
  const timerRef = useRef<number>(0);
  const startRef = useRef(0);
  const { awardXP } = useGamification();

  const startRound = useCallback(() => {
    setPhase('waiting');
    const delay = 1000 + Math.random() * 4000;
    timerRef.current = window.setTimeout(() => {
      startRef.current = Date.now();
      setPhase('ready');
    }, delay);
  }, []);

  const handleClick = () => {
    if (phase === 'waiting') {
      clearTimeout(timerRef.current);
      setPhase('idle');
    } else if (phase === 'ready') {
      const time = Date.now() - startRef.current;
      setReactionTime(time);
      setPhase('result');
      setAttempts((a) => a + 1);
      if (time < bestTime) setBestTime(time);
      if (attempts >= 4) awardXP.mutate('easy');
    } else if (phase === 'result') {
      startRound();
    } else {
      startRound();
    }
  };

  const bgColors: Record<Phase, string> = {
    idle: 'bg-muted',
    waiting: 'bg-destructive/20',
    ready: 'bg-accent/30',
    result: 'bg-primary/10',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">⚡ Reaction Time</CardTitle>
      </CardHeader>
      <CardContent>
        <button
          onClick={handleClick}
          className={`w-full h-40 rounded-lg flex flex-col items-center justify-center transition-colors ${bgColors[phase]}`}
        >
          {phase === 'idle' && <span className="text-sm text-muted-foreground">Click to start</span>}
          {phase === 'waiting' && <span className="text-sm text-destructive">Wait for green...</span>}
          {phase === 'ready' && <span className="text-lg font-bold text-accent">CLICK NOW!</span>}
          {phase === 'result' && (
            <>
              <span className="text-3xl font-bold text-foreground">{reactionTime}ms</span>
              <span className="text-xs text-muted-foreground mt-1">
                Best: {bestTime === Infinity ? '-' : `${bestTime}ms`} | Round {attempts}/5
              </span>
              <span className="text-xs text-muted-foreground mt-1">Click to continue</span>
            </>
          )}
        </button>
        {attempts >= 5 && (
          <div className="text-center mt-3">
            <p className="text-xs text-accent">+10 XP earned!</p>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => { setAttempts(0); setBestTime(Infinity); }}>
              Reset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
