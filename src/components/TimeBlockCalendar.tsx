import { useState } from 'react';
import { useTimeBlocks } from '@/hooks/useTimeBlocks';
import type { Task } from '@/stores/useHabitStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { CATEGORY_COLORS } from '@/lib/habitUtils';

interface Props {
  tasks: Task[];
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6am to 11pm

export function TimeBlockCalendar({ tasks }: Props) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const { blocks, addBlock, deleteBlock } = useTimeBlocks(todayStr);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBlock, setNewBlock] = useState({ title: '', start: '09:00', end: '10:00', color: '#3b82f6', taskId: '' });

  const handleAdd = () => {
    if (!newBlock.title && !newBlock.taskId) return;
    const task = tasks.find((t) => t.id === newBlock.taskId);
    addBlock.mutate({
      title: task?.name || newBlock.title,
      start_time: newBlock.start,
      end_time: newBlock.end,
      color: newBlock.color,
      task_id: newBlock.taskId || undefined,
    });
    setDialogOpen(false);
    setNewBlock({ title: '', start: '09:00', end: '10:00', color: '#3b82f6', taskId: '' });
  };

  const getBlockPosition = (startTime: string, endTime: string) => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const startMin = (sh - 6) * 60 + sm;
    const endMin = (eh - 6) * 60 + em;
    return { top: `${(startMin / (18 * 60)) * 100}%`, height: `${((endMin - startMin) / (18 * 60)) * 100}%` };
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" /> Time Blocks
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)} className="gap-1 h-7 text-xs">
            <Plus className="h-3 w-3" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] overflow-y-auto">
          {/* Hour lines */}
          {HOURS.map((h) => (
            <div
              key={h}
              className="absolute left-0 right-0 border-t border-border/50"
              style={{ top: `${((h - 6) / 18) * 100}%` }}
            >
              <span className="text-[9px] text-muted-foreground absolute -top-2 left-0">
                {h === 0 ? '12am' : h <= 12 ? `${h}am` : `${h - 12}pm`}
              </span>
            </div>
          ))}

          {/* Blocks */}
          {blocks.map((block) => {
            const pos = getBlockPosition(block.start_time, block.end_time);
            return (
              <div
                key={block.id}
                className="absolute left-10 right-2 rounded-md px-2 py-1 text-xs text-white group cursor-pointer"
                style={{ top: pos.top, height: pos.height, backgroundColor: block.color, minHeight: '20px' }}
              >
                <span className="font-medium truncate block">{block.title}</span>
                <span className="text-[9px] opacity-75">{block.start_time} – {block.end_time}</span>
                <button
                  onClick={() => deleteBlock.mutate(block.id)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Time Block</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={newBlock.taskId} onValueChange={(v) => setNewBlock({ ...newBlock, taskId: v })}>
              <SelectTrigger><SelectValue placeholder="Link to task (optional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No task</SelectItem>
                {tasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!newBlock.taskId && (
              <Input
                placeholder="Block title"
                value={newBlock.title}
                onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
              />
            )}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Start</label>
                <Input type="time" value={newBlock.start} onChange={(e) => setNewBlock({ ...newBlock, start: e.target.value })} />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">End</label>
                <Input type="time" value={newBlock.end} onChange={(e) => setNewBlock({ ...newBlock, end: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-1">
              {CATEGORY_COLORS.slice(0, 6).map((c) => (
                <button
                  key={c}
                  onClick={() => setNewBlock({ ...newBlock, color: c })}
                  className={`h-6 w-6 rounded-full border-2 ${newBlock.color === c ? 'border-foreground' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Block</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
