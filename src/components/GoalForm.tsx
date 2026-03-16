import { useState } from 'react';
import { useGoals } from '@/hooks/useGoals';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function GoalForm({ open, onClose }: Props) {
  const { addGoal } = useGoals();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('100');
  const [unit, setUnit] = useState('times');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addGoal.mutate({ title: title.trim(), target_value: Number(target) || 100, unit: unit.trim() || 'times' });
    setTitle('');
    setTarget('100');
    setUnit('times');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Goal Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Solve 500 DSA problems" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Target</Label>
              <Input type="number" value={target} onChange={(e) => setTarget(e.target.value)} min="1" />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="hours, problems..." />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
