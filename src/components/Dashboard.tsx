import { useState, useEffect, useRef } from 'react';
import { Header } from './Header';
import { CategorySidebar } from './CategorySidebar';
import { HabitGrid } from './HabitGrid';
import { HabitForm } from './HabitForm';
import { AnalyticsPanel } from './AnalyticsPanel';
import { WeeklyHabits } from './WeeklyHabits';
import { CompletionRing } from './CompletionRing';
import { WeeklyStats } from './WeeklyStats';
import { ProgressChart } from './ProgressChart';
import { useUIStore, type Task } from '@/stores/useHabitStore';
import { useTasks } from '@/hooks/useTasks';
import { useCompletions } from '@/hooks/useCompletions';
import { useAuth } from '@/hooks/useAuth';
import { calculateCompletionRate } from '@/lib/habitUtils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ws-dark-mode') === 'true';
    }
    return false;
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const { signOut } = useAuth();
  const { selectedMonth, selectedYear, weeklyPlanningEnabled, setWeeklyPlanningEnabled } = useUIStore();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { completionMap, toggleCompletion } = useCompletions(selectedMonth, selectedYear);

  const overallRate = calculateCompletionRate(tasks, completionMap, selectedMonth, selectedYear, 'daily');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ws-dark-mode', String(darkMode));
  }, [darkMode]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = (data: { name: string; category_id: string; frequency: string; scheduled_days: number[] }) => {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, ...data });
    } else {
      addTask.mutate(data);
    }
  };

  const handleToggle = (date: string, taskId: string) => {
    toggleCompletion.mutate({ date, taskId });
  };

  const exportAs = async (type: 'pdf' | 'png') => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { scale: 2, useCORS: true, backgroundColor: null });
    if (type === 'png') {
      const link = document.createElement('a');
      link.download = `work-scheduler-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`work-scheduler-${new Date().toISOString().slice(0, 10)}.pdf`);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onAddTask={() => setFormOpen(true)}
        onExportPDF={() => exportAs('pdf')}
        onExportPNG={() => exportAs('png')}
        onSignOut={signOut}
      />

      <div className="flex flex-1 overflow-hidden" ref={dashboardRef}>
        <CategorySidebar />

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="rounded-xl border border-border bg-card p-5 pulse-shadow">
            <h2 className="text-sm font-semibold text-foreground mb-4">Daily Tasks</h2>
            <HabitGrid
              tasks={tasks}
              completionMap={completionMap}
              onToggle={handleToggle}
              onEditTask={handleEditTask}
              onDeleteTask={(id) => deleteTask.mutate(id)}
            />
          </div>

          {/* Mobile/Tablet Analytics */}
          <div className="xl:hidden space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 pulse-shadow">
              <h3 className="text-sm font-semibold text-foreground mb-4">Analytics</h3>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <CompletionRing percentage={overallRate} size={120} strokeWidth={8} label="Overall" />
                <div className="flex-1 w-full">
                  <WeeklyStats tasks={tasks} completionMap={completionMap} />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 pulse-shadow">
              <ProgressChart tasks={tasks} completionMap={completionMap} />
            </div>
          </div>

          {/* Weekly Planning Toggle */}
          <div className="flex items-center gap-3">
            <Switch
              id="weekly-toggle"
              checked={weeklyPlanningEnabled}
              onCheckedChange={setWeeklyPlanningEnabled}
            />
            <Label htmlFor="weekly-toggle" className="text-sm font-medium text-foreground cursor-pointer">
              Enable Weekly Planning
            </Label>
          </div>

          {/* Weekly Tasks */}
          <div className="rounded-xl border border-border bg-card p-5 pulse-shadow">
            <WeeklyHabits tasks={tasks} completionMap={completionMap} onToggle={handleToggle} />
          </div>
        </main>

        <AnalyticsPanel tasks={tasks} completionMap={completionMap} />
      </div>

      <HabitForm open={formOpen} onClose={handleCloseForm} editingTask={editingTask} onSubmit={handleSubmitTask} />
    </div>
  );
}
