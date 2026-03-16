import { useState } from 'react';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { useFocusSessions } from '@/hooks/useFocusSessions';
import { useGamification } from '@/hooks/useGamification';
import type { Task } from '@/stores/useHabitStore';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Play, Pause, Square, RotateCcw } from 'lucide-react';

interface Props {
  tasks: Task[];
  onClose: () => void;
}

export function FocusMode({ tasks, onClose }: Props) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('freestyle');
  const { status, secondsLeft, totalElapsed, start, pause, resume, stop, reset } = useFocusTimer(25, 5);
  const { addSession } = useFocusSessions();
  const { awardXP, unlockAchievement } = useGamification();

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleComplete = () => {
    stop();
    if (totalElapsed > 0) {
      addSession.mutate({
        task_id: selectedTaskId !== 'freestyle' ? selectedTaskId : undefined,
        duration_seconds: totalElapsed,
      });
      awardXP.mutate('hard');
      unlockAchievement.mutate('100_FOCUS_MINUTES');
      unlockAchievement.mutate('DEEP_WORK_MASTER');
    }
  };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8">
      <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>

      <h2 className="text-2xl font-bold text-foreground">
        {status === 'break' ? '☕ Break Time' : '🎯 Focus Mode'}
      </h2>

      {status === 'idle' && (
        <div className="w-64">
          <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
            <SelectTrigger><SelectValue placeholder="Select a task" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="freestyle">Freestyle Focus</SelectItem>
              {tasks.filter((t) => t.frequency === 'daily').map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {status !== 'idle' && selectedTask && (
        <p className="text-muted-foreground text-sm">Working on: {selectedTask.name}</p>
      )}

      <div className="text-8xl font-mono font-bold text-foreground tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex gap-3">
        {status === 'idle' && (
          <Button size="lg" onClick={() => start()} className="gap-2">
            <Play className="h-5 w-5" /> Start 25 min
          </Button>
        )}
        {status === 'running' && (
          <>
            <Button size="lg" variant="outline" onClick={pause} className="gap-2">
              <Pause className="h-5 w-5" /> Pause
            </Button>
            <Button size="lg" variant="destructive" onClick={handleComplete} className="gap-2">
              <Square className="h-5 w-5" /> Stop
            </Button>
          </>
        )}
        {status === 'paused' && (
          <>
            <Button size="lg" onClick={resume} className="gap-2">
              <Play className="h-5 w-5" /> Resume
            </Button>
            <Button size="lg" variant="destructive" onClick={handleComplete} className="gap-2">
              <Square className="h-5 w-5" /> Stop
            </Button>
          </>
        )}
        {status === 'break' && (
          <Button size="lg" onClick={() => start()} className="gap-2">
            <Play className="h-5 w-5" /> Start Next Session
          </Button>
        )}
        {status === 'completed' && (
          <>
            <Button size="lg" onClick={reset} className="gap-2">
              <RotateCcw className="h-5 w-5" /> Reset
            </Button>
            <Button size="lg" variant="outline" onClick={onClose}>Done</Button>
          </>
        )}
      </div>

      {totalElapsed > 0 && (
        <p className="text-xs text-muted-foreground">
          Total focused: {Math.floor(totalElapsed / 60)}m {totalElapsed % 60}s
        </p>
      )}
    </div>
  );
}
