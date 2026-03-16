import { useState, useRef, useCallback, useEffect } from 'react';

type TimerStatus = 'idle' | 'running' | 'paused' | 'break' | 'completed';

export function useFocusTimer(defaultMinutes = 25, breakMinutes = 5) {
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  const tick = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        clearTimer();
        setStatus((s) => {
          if (s === 'running') {
            // Start break
            setTimeout(() => {
              setSecondsLeft(breakMinutes * 60);
              setStatus('break');
            }, 0);
            return 'break';
          }
          return 'completed';
        });
        return 0;
      }
      if (status === 'running') setTotalElapsed((e) => e + 1);
      return prev - 1;
    });
  }, [breakMinutes, status]);

  useEffect(() => {
    if (status === 'running' || status === 'break') {
      clearTimer();
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [status, tick]);

  const start = (minutes?: number) => {
    setSecondsLeft((minutes || defaultMinutes) * 60);
    setTotalElapsed(0);
    setStatus('running');
  };

  const pause = () => setStatus('paused');
  const resume = () => setStatus('running');
  const stop = () => {
    clearTimer();
    setStatus('completed');
  };
  const reset = () => {
    clearTimer();
    setSecondsLeft(defaultMinutes * 60);
    setTotalElapsed(0);
    setStatus('idle');
  };

  const startBreak = () => {
    setSecondsLeft(breakMinutes * 60);
    setStatus('break');
  };

  return { status, secondsLeft, totalElapsed, start, pause, resume, stop, reset, startBreak };
}
