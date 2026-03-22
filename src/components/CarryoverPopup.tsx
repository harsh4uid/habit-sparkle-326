import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useUIStore, type Task } from '@/stores/useHabitStore';
import { getCurrentLogicalDate, formatDate, isScheduledForDay } from '@/lib/habitUtils';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
}

export function CarryoverPopup({ tasks, completionMap }: Props) {
  const [open, setOpen] = useState(false);
  const [candidates, setCandidates] = useState<Task[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const { setCarriedTasks, getCarriedTasks } = useUIStore();
  const { user } = useAuth();

  useEffect(() => {
    // Only run when we have loaded tasks and completions
    if (tasks.length === 0 || !user) return;

    const today = getCurrentLogicalDate();
    const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Check if prompted today
    const lastPrompt = localStorage.getItem('ws-last-carryover-prompt');
    if (lastPrompt === todayStr) return;

    // Skip carryover for new users (created today or very recently)
    const userCreatedAt = user.user_metadata?.created_at || user.created_at;
    if (userCreatedAt) {
      const createdDate = new Date(userCreatedAt);
      const daysSinceCreation = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      // Skip carryover for first 2 days after signup
      if (daysSinceCreation < 2) {
        localStorage.setItem('ws-last-carryover-prompt', todayStr);
        return;
      }
    }

    // Calculate yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = formatDate(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    const carriedToYesterday = getCarriedTasks(yesterdayStr);

    const missedYesterday = tasks.filter(t => {
      // Must be daily
      if (t.frequency !== 'daily') return false;
      
      // Was it scheduled for yesterday (or carried to yesterday)?
      const scheduledYesterday = isScheduledForDay(t, yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()) || carriedToYesterday.includes(t.id);
      if (!scheduledYesterday) return false;
      
      // Was it completed yesterday?
      const completedYesterday = !!completionMap[yesterdayStr]?.[t.id];
      if (completedYesterday) return false;

      // Anti-abuse: if it was carried to yesterday, it cannot be carried again today.
      if (carriedToYesterday.includes(t.id)) return false;

      return true;
    });

    if (missedYesterday.length > 0) {
      setCandidates(missedYesterday);
      setOpen(true);
    } else {
      localStorage.setItem('ws-last-carryover-prompt', todayStr);
    }
  }, [tasks, completionMap, getCarriedTasks, user]);

  const toggleSelect = (taskId: string) => {
    setSelected(prev => {
      if (prev.includes(taskId)) return prev.filter(id => id !== taskId);
      if (prev.length >= 2) return prev; // Max 2 tasks
      return [...prev, taskId];
    });
  };

  const handleConfirm = () => {
    const today = getCurrentLogicalDate();
    const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Save to carryover state for today
    if (selected.length > 0) {
      const existing = getCarriedTasks(todayStr);
      setCarriedTasks(todayStr, Array.from(new Set([...existing, ...selected])));
    }
    
    localStorage.setItem('ws-last-carryover-prompt', todayStr);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Carryover Unfinished Tasks</DialogTitle>
          <DialogDescription>
            You missed some tasks yesterday. Choose up to 2 tasks to carry forward to today.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 my-4">
          {candidates.map(task => (
            <div key={task.id} className="flex items-center space-x-3 border p-3 rounded-md">
              <Checkbox 
                id={task.id} 
                checked={selected.includes(task.id)}
                onCheckedChange={() => toggleSelect(task.id)}
                disabled={!selected.includes(task.id) && selected.length >= 2}
              />
              <label htmlFor={task.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {task.name}
              </label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleConfirm}>Skip</Button>
          <Button onClick={handleConfirm}>Confirm Carryover</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
