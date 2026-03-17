import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/hooks/useGamification';

export function FocusTapGame() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const { awardXP } = useGamification();

  const moveTarget = useCallback(() => {
    setTargetPos({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
    });
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setFinished(true);
          if (score >= 10) awardXP.mutate('easy');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, finished]);

  const handleTap = () => {
    setScore((s) => s + 1);
    moveTarget();
  };

  const reset = () => {
    setStarted(false);
    setFinished(false);
    setScore(0);
    setTimeLeft(30);
    moveTarget();
  };

  if (!started) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">🎯 Focus Tap</CardTitle></CardHeader>
        <CardContent className="text-center space-y-3">
          <p className="text-xs text-muted-foreground">Tap the targets as fast as you can!</p>
          <Button onClick={() => { setStarted(true); moveTarget(); }}>Start</Button>
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">🎯 Focus Tap</CardTitle></CardHeader>
        <CardContent className="text-center space-y-3">
          <p className="text-2xl font-bold text-foreground">{score} taps!</p>
          {score >= 10 && <p className="text-xs text-accent">+10 XP earned!</p>}
          <Button onClick={reset} size="sm">Play Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">🎯 Focus Tap</CardTitle>
          <span className="text-xs text-muted-foreground">{timeLeft}s | Score: {score}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 bg-muted/30 rounded-lg overflow-hidden">
          <button
            onClick={handleTap}
            className="absolute h-10 w-10 bg-primary rounded-full transition-all duration-100 hover:scale-110 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
