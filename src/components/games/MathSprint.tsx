import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGamification } from '@/hooks/useGamification';

interface Problem {
  a: number;
  b: number;
  op: '+' | '-' | '×';
  answer: number;
}

function generateProblem(): Problem {
  const ops: ('+' | '-' | '×')[] = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * 3)];
  let a: number, b: number, answer: number;
  if (op === '×') {
    a = Math.floor(Math.random() * 12) + 2;
    b = Math.floor(Math.random() * 12) + 2;
    answer = a * b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * a);
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 50) + 5;
    b = Math.floor(Math.random() * 50) + 5;
    answer = a + b;
  }
  return { a, b, op, answer };
}

export function MathSprint() {
  const [started, setStarted] = useState(false);
  const [problem, setProblem] = useState<Problem>(generateProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { awardXP } = useGamification();

  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setFinished(true);
          if (score >= 5) awardXP.mutate('medium');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, finished]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(userAnswer) === problem.answer) {
      setScore((s) => s + 1);
    }
    setProblem(generateProblem());
    setUserAnswer('');
    inputRef.current?.focus();
  };

  const reset = () => {
    setStarted(false);
    setFinished(false);
    setScore(0);
    setTimeLeft(60);
    setProblem(generateProblem());
    setUserAnswer('');
  };

  if (!started) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">🔢 Math Sprint</CardTitle></CardHeader>
        <CardContent className="text-center space-y-3">
          <p className="text-xs text-muted-foreground">Solve as many problems as you can in 60 seconds!</p>
          <Button onClick={() => setStarted(true)}>Start</Button>
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">🔢 Math Sprint</CardTitle></CardHeader>
        <CardContent className="text-center space-y-3">
          <p className="text-2xl font-bold text-foreground">{score} correct!</p>
          {score >= 5 && <p className="text-xs text-accent">+25 XP earned!</p>}
          <Button onClick={reset} size="sm">Play Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">🔢 Math Sprint</CardTitle>
          <span className="text-xs text-muted-foreground">{timeLeft}s | Score: {score}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p className="text-3xl font-bold text-foreground">
            {problem.a} {problem.op} {problem.b} = ?
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
            <Input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-24 text-center"
              autoFocus
            />
            <Button type="submit" size="sm">→</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
