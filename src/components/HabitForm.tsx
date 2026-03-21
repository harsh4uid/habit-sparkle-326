import { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useUIStore, type Task, type Weekday } from '@/stores/useHabitStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const DAY_LABELS: { value: Weekday; short: string }[] = [
  { value: 0, short: 'Sun' }, { value: 1, short: 'Mon' }, { value: 2, short: 'Tue' },
  { value: 3, short: 'Wed' }, { value: 4, short: 'Thu' }, { value: 5, short: 'Fri' }, { value: 6, short: 'Sat' },
];

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  editingTask?: Task | null;
  onSubmit: (data: { name: string; category_id: string; frequency: string; scheduled_days: number[]; difficulty: string; time?: string }) => void;
}

export function HabitForm({ open, onClose, editingTask, onSubmit }: TaskFormProps) {
  const { categories } = useCategories();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [scheduledDays, setScheduledDays] = useState<Weekday[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [time, setTime] = useState('04:00');

  useEffect(() => {
    if (editingTask) {
      setName(editingTask.name);
      setCategoryId(editingTask.category_id);
      setFrequency(editingTask.frequency as 'daily' | 'weekly');
      setScheduledDays((editingTask.scheduled_days || []) as Weekday[]);
      setDifficulty((editingTask.difficulty as 'easy' | 'medium' | 'hard') || 'medium');
      setTime(useUIStore.getState().getTaskTime(editingTask.id));
    } else {
      setName('');
      setCategoryId(categories[0]?.id || '');
      setFrequency('daily');
      setScheduledDays([]);
      setDifficulty('medium');
      setTime('04:00');
    }
  }, [editingTask, open, categories]);

  const toggleDay = (day: Weekday) => {
    setScheduledDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    onSubmit({
      name: name.trim(),
      category_id: categoryId,
      frequency,
      scheduled_days: frequency === 'daily' ? scheduledDays : [],
      difficulty,
      time
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Task Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Morning Exercise" autoFocus />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as 'daily' | 'weekly')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as 'easy' | 'medium' | 'hard')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy (10 XP)</SelectItem>
                  <SelectItem value="medium">Medium (25 XP)</SelectItem>
                  <SelectItem value="hard">Hard (50 XP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="col-span-1"
              />
            </div>
          </div>

          {frequency === 'daily' && (
            <div className="space-y-2">
              <Label>Scheduled Days <span className="text-muted-foreground text-xs">(leave empty for every day)</span></Label>
              <div className="flex gap-1.5">
                {DAY_LABELS.map(({ value, short }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleDay(value)}
                    className={cn(
                      'flex-1 py-1.5 rounded-md text-xs font-medium transition-colors border',
                      scheduledDays.includes(value)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                    )}
                  >
                    {short}
                  </button>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{editingTask ? 'Save Changes' : 'Add Task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
