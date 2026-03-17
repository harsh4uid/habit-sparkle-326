import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { Header } from './Header';
import { CategorySidebar } from './CategorySidebar';
import { HabitGrid } from './HabitGrid';
import { HabitForm } from './HabitForm';
import { AnalyticsPanel } from './AnalyticsPanel';
import { WeeklyHabits } from './WeeklyHabits';
import { CompletionRing } from './CompletionRing';
import { WeeklyStats } from './WeeklyStats';
import { ProgressChart } from './ProgressChart';
import { ProductivityDashboard } from './ProductivityDashboard';
import { FocusMode } from './FocusMode';
import { Scratchpad } from './Scratchpad';
import { WeeklyChallenges } from './WeeklyChallenges';
import { InactivityPrompt } from './InactivityPrompt';
import { MobileNav } from './MobileNav';
import { AICoach } from './AICoach';
import { MoodTracker } from './MoodTracker';
import { HeatmapCalendar } from './HeatmapCalendar';
import { FailureRecovery } from './FailureRecovery';
import { AutoScheduler } from './AutoScheduler';
import { BrainTools } from './BrainTools';
import { TimeBlockCalendar } from './TimeBlockCalendar';
import { MobileProfileView } from './MobileProfileView';
import { showMotivationalToast } from './MotivationalToast';
import { useUIStore, type Task } from '@/stores/useHabitStore';
import { useTasks } from '@/hooks/useTasks';
import { useCompletions } from '@/hooks/useCompletions';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { calculateCompletionRate, formatDate, isScheduledForDay } from '@/lib/habitUtils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function calculateStreak(tasks: Task[], completionMap: Record<string, Record<string, string>>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
    const scheduled = tasks.filter(
      (t) => t.frequency === 'daily' && isScheduledForDay(t, d.getFullYear(), d.getMonth(), d.getDate())
    );
    if (scheduled.length === 0) continue;
    const allDone = scheduled.every((t) => completionMap[dateStr]?.[t.id]);
    if (allDone) streak++;
    else break;
  }
  return streak;
}

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
  const {
    selectedMonth, selectedYear, weeklyPlanningEnabled, setWeeklyPlanningEnabled,
    screenshotMode, focusModeOpen, setFocusModeOpen, scratchpadOpen,
    mobileView, autoSchedulerOpen, setAutoSchedulerOpen
  } = useUIStore();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { completionMap, toggleCompletion } = useCompletions(selectedMonth, selectedYear);
  const { awardXP, unlockAchievement } = useGamification();

  const overallRate = calculateCompletionRate(tasks, completionMap, selectedMonth, selectedYear, 'daily');
  const streak = useMemo(() => calculateStreak(tasks, completionMap), [tasks, completionMap]);

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

  const handleSubmitTask = (data: { name: string; category_id: string; frequency: string; scheduled_days: number[]; difficulty: string }) => {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, ...data });
    } else {
      addTask.mutate(data);
    }
  };

  const handleToggle = (date: string, taskId: string) => {
    toggleCompletion.mutate({ date, taskId }, {
      onSuccess: () => {
        const task = tasks.find((t) => t.id === taskId);
        if (task && !completionMap[date]?.[taskId]) {
          awardXP.mutate(task.difficulty || 'medium');
          unlockAchievement.mutate('FIRST_TASK');
          showMotivationalToast();
        }
      },
    });
  };

  const handleStartFocus = (taskId?: string) => {
    setFocusModeOpen(true);
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

  // Mobile content renderer
  const renderMobileContent = () => {
    switch (mobileView) {
      case 'dashboard':
        return (
          <>
            <ProductivityDashboard tasks={tasks} completionMap={completionMap} streak={streak} />
            <MoodTracker />
            <AICoach tasks={tasks} completionMap={completionMap} streak={streak} />
            <WeeklyChallenges tasks={tasks} completionMap={completionMap} />
            <FailureRecovery tasks={tasks} completionMap={completionMap} />
          </>
        );
      case 'tasks':
        return (
          <>
            <div className="rounded-xl border border-border bg-card p-4 pulse-shadow">
              <h2 className="text-sm font-semibold text-foreground mb-3">Daily Tasks</h2>
              <HabitGrid
                tasks={tasks}
                completionMap={completionMap}
                onToggle={handleToggle}
                onEditTask={handleEditTask}
                onDeleteTask={(id) => deleteTask.mutate(id)}
              />
            </div>
            <TimeBlockCalendar tasks={tasks} />
            {weeklyPlanningEnabled && (
              <div className="rounded-xl border border-border bg-card p-4 pulse-shadow">
                <WeeklyHabits tasks={tasks} completionMap={completionMap} onToggle={handleToggle} />
              </div>
            )}
          </>
        );
      case 'tools':
        return <BrainTools />;
      case 'profile':
        return <MobileProfileView darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header - hidden on mobile */}
      <div className="hidden md:block">
        <Header
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onAddTask={() => setFormOpen(true)}
          onExportPDF={() => exportAs('pdf')}
          onExportPNG={() => exportAs('png')}
          onSignOut={signOut}
        />
      </div>

      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">WS</span>
          </div>
          <h1 className="text-lg font-bold text-foreground">Work Scheduler</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" ref={dashboardRef}>
        {/* Sidebar - desktop only */}
        {!screenshotMode && <div className="hidden lg:block"><CategorySidebar /></div>}

        {/* Main content - mobile */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 pb-24 md:pb-6">
          {/* Mobile view */}
          <div className="md:hidden">
            {scratchpadOpen ? <Scratchpad /> : renderMobileContent()}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block space-y-6">
            {scratchpadOpen ? (
              <Scratchpad />
            ) : (
              <>
                <ProductivityDashboard tasks={tasks} completionMap={completionMap} streak={streak} />

                {/* AI Coach + Mood row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <AICoach tasks={tasks} completionMap={completionMap} streak={streak} />
                  </div>
                  <MoodTracker />
                </div>

                <FailureRecovery tasks={tasks} completionMap={completionMap} />

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <WeeklyChallenges tasks={tasks} completionMap={completionMap} />
                  <TimeBlockCalendar tasks={tasks} />
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
                  <HeatmapCalendar tasks={tasks} completionMap={completionMap} />
                </div>

                {!screenshotMode && (
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
                )}

                {weeklyPlanningEnabled && (
                  <div className="rounded-xl border border-border bg-card p-5 pulse-shadow">
                    <WeeklyHabits tasks={tasks} completionMap={completionMap} onToggle={handleToggle} />
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Analytics panel - desktop only */}
        {!screenshotMode && <AnalyticsPanel tasks={tasks} completionMap={completionMap} />}
      </div>

      {/* Mobile bottom nav */}
      <MobileNav onAddTask={() => setFormOpen(true)} />

      <HabitForm open={formOpen} onClose={handleCloseForm} editingTask={editingTask} onSubmit={handleSubmitTask} />

      {focusModeOpen && <FocusMode tasks={tasks} onClose={() => setFocusModeOpen(false)} />}

      <AutoScheduler open={autoSchedulerOpen} onClose={() => setAutoSchedulerOpen(false)} />

      <InactivityPrompt tasks={tasks} completionMap={completionMap} onStartFocus={handleStartFocus} />
    </div>
  );
}
