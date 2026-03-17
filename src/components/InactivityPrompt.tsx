import { useState, useEffect, useCallback } from 'react';
import type { Task } from '@/stores/useHabitStore';
import { getTodayString, isScheduledForDay } from '@/lib/habitUtils';
import { getRandomInactivityMessage } from './MotivationalToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface Props {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
  onStartFocus: (taskId?: string) => void;
}

const INACTIVITY_MS = 3 * 60 * 60 * 1000;

export function InactivityPrompt({ tasks, completionMap, onStartFocus }: Props) {
  const [show, setShow] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [message, setMessage] = useState('');

  const resetTimer = useCallback(() => {
    setLastInteraction(Date.now());
    setShow(false);
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, resetTimer));
  }, [resetTimer]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction > INACTIVITY_MS) {
        const today = new Date();
        const todayStr = getTodayString();
        const pending = tasks.filter(
          (t) =>
            t.frequency === 'daily' &&
            isScheduledForDay(t, today.getFullYear(), today.getMonth(), today.getDate()) &&
            !completionMap[todayStr]?.[t.id]
        );
        if (pending.length > 0) {
          setMessage(getRandomInactivityMessage());
          setShow(true);
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [lastInteraction, tasks, completionMap]);

  const handleDoItNow = () => {
    const today = new Date();
    const todayStr = getTodayString();
    const pending = tasks.filter(
      (t) =>
        t.frequency === 'daily' &&
        isScheduledForDay(t, today.getFullYear(), today.getMonth(), today.getDate()) &&
        !completionMap[todayStr]?.[t.id]
    );
    const random = pending[Math.floor(Math.random() * pending.length)];
    setShow(false);
    onStartFocus(random?.id);
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-chart-4" />
            Time to get back on track
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {message || "You have been inactive for a while. Start with a small task — momentum builds motivation!"}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShow(false)}>Dismiss</Button>
          <Button onClick={handleDoItNow} className="gap-2">
            <Zap className="h-4 w-4" /> Do It Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
