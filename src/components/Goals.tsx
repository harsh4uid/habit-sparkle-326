import { useState } from 'react';
import { useGoals, type Goal } from '@/hooks/useGoals';
import { GoalForm } from './GoalForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

export function Goals() {
  const { goals, deleteGoal, incrementGoal } = useGoals();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Goals</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFormOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {goals.length === 0 && (
            <p className="text-xs text-muted-foreground">No goals yet. Add one to track your progress!</p>
          )}
          {goals.map((g) => {
            const pct = g.target_value > 0 ? Math.round((g.current_value / g.target_value) * 100) : 0;
            return (
              <div key={g.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground truncate flex-1">{g.title}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => incrementGoal.mutate({ id: g.id })}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-destructive"
                      onClick={() => deleteGoal.mutate(g.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Progress value={pct} className="h-1.5" />
                <span className="text-[10px] text-muted-foreground">
                  {g.current_value}/{g.target_value} {g.unit}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <GoalForm open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
