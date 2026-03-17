import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface PendingTask {
  name: string;
  category_id: string;
  difficulty: string;
  deadline: string;
  priority: number; // 1=high, 3=low
}

export function AutoScheduler({ open, onClose }: Props) {
  const { addTask } = useTasks();
  const { categories } = useCategories();
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([
    { name: '', category_id: '', difficulty: 'medium', deadline: '', priority: 2 },
  ]);

  const addRow = () => {
    setPendingTasks([...pendingTasks, { name: '', category_id: '', difficulty: 'medium', deadline: '', priority: 2 }]);
  };

  const updateRow = (index: number, field: keyof PendingTask, value: string | number) => {
    const updated = [...pendingTasks];
    (updated[index] as any)[field] = value;
    setPendingTasks(updated);
  };

  const removeRow = (index: number) => {
    setPendingTasks(pendingTasks.filter((_, i) => i !== index));
  };

  const handleSchedule = () => {
    const valid = pendingTasks.filter((t) => t.name.trim() && t.category_id);
    if (valid.length === 0) {
      toast.error('Add at least one task with a name and category');
      return;
    }

    // Sort by priority then deadline
    const sorted = [...valid].sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return (a.deadline || '9999') < (b.deadline || '9999') ? -1 : 1;
    });

    // Distribute across days (simple round-robin, max 5 per day)
    const today = new Date();
    const daySlots: Record<number, number> = {};

    for (const task of sorted) {
      let dayOffset = 0;
      while ((daySlots[dayOffset] || 0) >= 5) dayOffset++;
      daySlots[dayOffset] = (daySlots[dayOffset] || 0) + 1;

      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + dayOffset);
      const dayOfWeek = targetDate.getDay();

      addTask.mutate({
        name: task.name,
        category_id: task.category_id,
        difficulty: task.difficulty,
        frequency: 'daily',
        scheduled_days: [dayOfWeek],
      });
    }

    toast.success(`Scheduled ${sorted.length} tasks across ${Object.keys(daySlots).length} days`);
    onClose();
    setPendingTasks([{ name: '', category_id: '', difficulty: 'medium', deadline: '', priority: 2 }]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Auto Schedule Tasks</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {pendingTasks.map((task, i) => (
            <div key={i} className="grid grid-cols-[1fr_120px_100px_100px_auto] gap-2 items-end">
              <div>
                {i === 0 && <label className="text-xs text-muted-foreground">Task</label>}
                <Input
                  placeholder="Task name"
                  value={task.name}
                  onChange={(e) => updateRow(i, 'name', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                {i === 0 && <label className="text-xs text-muted-foreground">Category</label>}
                <Select value={task.category_id} onValueChange={(v) => updateRow(i, 'category_id', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                {i === 0 && <label className="text-xs text-muted-foreground">Difficulty</label>}
                <Select value={task.difficulty} onValueChange={(v) => updateRow(i, 'difficulty', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                {i === 0 && <label className="text-xs text-muted-foreground">Priority</label>}
                <Select value={String(task.priority)} onValueChange={(v) => updateRow(i, 'priority', Number(v))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">High</SelectItem>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="3">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeRow(i)} disabled={pendingTasks.length === 1}>
                ✕
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addRow}>+ Add Task</Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSchedule}>Auto Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
