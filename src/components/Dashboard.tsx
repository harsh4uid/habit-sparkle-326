import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
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
import { FutureSelfMessages } from './FutureSelfMessages';
import { LifeSimulation } from './LifeSimulation';
import { DopamineTracker } from './DopamineTracker';
import { TimeTravelSimulation } from './TimeTravelSimulation';
import { RandomChallenge } from './RandomChallenge';
import { BurnoutDetector } from './BurnoutDetector';
import { ProofOfWork } from './ProofOfWork';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useUIStore, type Task } from '@/stores/useHabitStore';
import { useTasks } from '@/hooks/useTasks';
import { useCompletions } from '@/hooks/useCompletions';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { useProfile } from '@/hooks/useProfile';
import { useLifeStats } from '@/hooks/useLifeStats';
import { calculateCompletionRate, formatDate, isScheduledForDay, getCurrentLogicalDate, getCurrentTimeString, getTodayString, getTaskStatus, isLateNight } from '@/lib/habitUtils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function calculateStreak(tasks: Task[], completionMap: Record<string, Record<string, string>>, startDate?: string): number {
  let streak = 0;
  const today = getCurrentLogicalDate();
  const startD = startDate ? new Date(startDate + 'T00:00:00') : null;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (startD && d < startD) break;
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
      const saved = localStorage.getItem('ws-dark-mode');
      return saved === null ? true : saved === 'true'; // dark mode default
    }
    return true;
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [proofTask, setProofTask] = useState<Task | null>(null);
  const [deleteConfirmTask, setDeleteConfirmTask] = useState<Task | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const { signOut } = useAuth();
  const { startDate, hardMode } = useProfile();
  const { updateStats } = useLifeStats();
  const {
    selectedMonth, selectedYear, weeklyPlanningEnabled, setWeeklyPlanningEnabled,
    screenshotMode, focusModeOpen, setFocusModeOpen, scratchpadOpen, setScratchpadOpen,
    mobileView, autoSchedulerOpen, setAutoSchedulerOpen,
    dayEndsAt, brainToolsOpen
  } = useUIStore();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { completionMap, toggleCompletion } = useCompletions(selectedMonth, selectedYear);
  const { awardXP, unlockAchievement } = useGamification();

  const logicalToday = getCurrentLogicalDate();
  const todayStr = getTodayString();
  const currentTime = getCurrentTimeString();
  const lateNightMode = isLateNight();
  const carriedToday = useUIStore.getState().getCarriedTasks(todayStr);

  const todayTasks = tasks
    .filter((t) => t.frequency === 'daily' && (isScheduledForDay(t, logicalToday) || carriedToday.includes(t.id)))
    .map((t) => ({ ...t, time: useUIStore.getState().getTaskTime(t.id) }))
    .sort((a, b) => a.time.localeCompare(b.time));

  const overallRate = calculateCompletionRate(tasks, completionMap, selectedMonth, selectedYear, 'daily');
  const streak = useMemo(() => calculateStreak(tasks, completionMap, startDate), [tasks, completionMap, startDate]);

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

  const handleDeleteTask = (task: Task) => {
    setDeleteConfirmTask(task);
  };

  const confirmDeleteTask = () => {
    if (deleteConfirmTask) {
      deleteTask.mutate(deleteConfirmTask.id);
      setDeleteConfirmTask(null);
    }
  };

  const handleSubmitTask = (data: { name: string; category_id: string; frequency: string; scheduled_days: number[]; difficulty: string; time?: string }) => {
    const { time, ...taskData } = data;
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, ...taskData });
      if (time) useUIStore.getState().setTaskTime(editingTask.id, time);
    } else {
      addTask.mutate(taskData, {
        onSuccess: (newTask) => {
          if (time && newTask) useUIStore.getState().setTaskTime(newTask.id, time);
        }
      });
    }
  };

  const handleToggle = (date: string, taskId: string) => {
    toggleCompletion.mutate({ date, taskId }, {
      onSuccess: () => {
        const task = tasks.find((t) => t.id === taskId);
        if (task && !completionMap[date]?.[taskId]) {
          // Award XP (2x in hard mode handled in useGamification)
          awardXP.mutate(task.difficulty || 'medium');
          unlockAchievement.mutate('FIRST_TASK');
          showMotivationalToast();
          // Update life stats
          updateStats.mutate({ discipline: 1, focus: 1, knowledge: 1 });
          // Show proof of work for hard tasks
          if (task.difficulty === 'hard') {
            setProofTask(task);
          }
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
            <FutureSelfMessages />
            <ProductivityDashboard tasks={tasks} completionMap={completionMap} streak={streak} />
            <RandomChallenge />
            <MoodTracker />
            <AICoach tasks={tasks} completionMap={completionMap} streak={streak} startDate={startDate} />
            <WeeklyChallenges tasks={tasks} completionMap={completionMap} />
            <BurnoutDetector tasks={tasks} completionMap={completionMap} />
            <FailureRecovery tasks={tasks} completionMap={completionMap} startDate={startDate} />
          </>
        );
      case 'tasks':
        return (
          <>
            <div className="rounded-xl border border-border bg-card p-4 glass-card">
              <h2 className="text-sm font-semibold text-foreground mb-3">Daily Tasks</h2>
              <HabitGrid
                tasks={tasks}
                completionMap={completionMap}
                onToggle={handleToggle}
                onEditTask={handleEditTask}
                onDeleteTask={(id) => {
                  const task = tasks.find(t => t.id === id);
                  if (task) handleDeleteTask(task);
                }}
              />
            </div>
            <TimeBlockCalendar tasks={tasks} />
            {weeklyPlanningEnabled && (
              <div className="rounded-xl border border-border bg-card p-4 glass-card">
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
      <header className="md:hidden flex items-center justify-between px-3 py-2 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 min-w-0">
          {scratchpadOpen && (
            <button
              onClick={() => setScratchpadOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          )}
          {!scratchpadOpen && (
            <>
              <img src="/tasktitan-logo.png" alt="TaskTitan" className="h-5 w-5 shrink-0" />
              <h1 className="text-base font-bold text-foreground truncate">TaskTitan</h1>
            </>
          )}
        </div>
        {!scratchpadOpen && (
          <button
            onClick={() => setScratchpadOpen(true)}
            className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors"
            title="Open scratchpad"
          >
            Notepad
          </button>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden" ref={dashboardRef}>
        {/* Sidebar - desktop only */}
        {!screenshotMode && <div className="hidden lg:block"><CategorySidebar /></div>}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 pb-24 md:pb-6">
          {new Date().getDate() !== getCurrentLogicalDate().getDate() && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 p-3.5 rounded-xl text-sm flex items-center gap-3 backdrop-blur-sm shadow-sm"
            >
              <span className="text-lg">🌙</span>
              <div>
                <span className="font-bold">Late Night Mode</span>
                <span className="opacity-80 ml-2">— Stay focused, you're doing great!</span>
              </div>
            </motion.div>
          )}

          <div className="rounded-lg border border-border bg-card p-2 sm:p-3 flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs sm:text-sm font-medium line-clamp-1">Today: {logicalToday.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">Ends: {dayEndsAt} • {currentTime}</p>
            </div>
            <div className="text-xs sm:text-sm font-medium whitespace-nowrap">
              {lateNightMode ? '🌙' : '☀️'}
            </div>
          </div>
        </div>

        {todayTasks.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-2 sm:p-3 glass-card">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2">Today Tasks</h3>
            <div className="space-y-1.5 sm:space-y-2">
              {todayTasks.map((task) => {
                const isCompleted = !!completionMap[todayStr]?.[task.id];
                return (
                  <div key={task.id} className="flex items-center justify-between gap-2 p-1.5 sm:p-2 rounded-md border border-border/50 bg-muted/10 text-xs sm:text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{task.time} — {task.name}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{task.frequency === 'daily' ? 'Daily' : 'Weekly'}</p>
                    </div>
                    <span className={"text-[10px] sm:text-xs font-semibold whitespace-nowrap ml-1 " + (isCompleted ? 'text-emerald-500' : 'text-muted-foreground')}>{isCompleted ? 'DONE' : 'TODO'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile view */}
          <div className="md:hidden">
            {scratchpadOpen ? <Scratchpad /> : renderMobileContent()}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block space-y-6">
            {scratchpadOpen ? (
              <Scratchpad />
            ) : brainToolsOpen ? (
              <BrainTools />
            ) : (
              <>
                <FutureSelfMessages />

                <ProductivityDashboard tasks={tasks} completionMap={completionMap} streak={streak} />

                {/* AI Coach + Mood + Challenge row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <AICoach tasks={tasks} completionMap={completionMap} streak={streak} startDate={startDate} />
                  </div>
                  <MoodTracker />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <RandomChallenge />
                  <TimeTravelSimulation tasks={tasks} completionMap={completionMap} />
                </div>

                <BurnoutDetector tasks={tasks} completionMap={completionMap} />
                <FailureRecovery tasks={tasks} completionMap={completionMap} startDate={startDate} />

                <div className="rounded-xl border border-border bg-card p-5 glass-card">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Daily Tasks</h2>
                  <HabitGrid
                    tasks={tasks}
                    completionMap={completionMap}
                    onToggle={handleToggle}
                    onEditTask={handleEditTask}
                    onDeleteTask={(id) => {
                      const task = tasks.find(t => t.id === id);
                      if (task) handleDeleteTask(task);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <WeeklyChallenges tasks={tasks} completionMap={completionMap} />
                  <TimeBlockCalendar tasks={tasks} />
                </div>

                {/* Mobile/Tablet Analytics */}
                <div className="xl:hidden space-y-6">
                  <div className="rounded-xl border border-border bg-card p-5 glass-card">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Analytics</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                      <CompletionRing percentage={overallRate} size={120} strokeWidth={8} label="Overall" />
                      <div className="flex-1 w-full">
                        <WeeklyStats tasks={tasks} completionMap={completionMap} />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-5 glass-card">
                    <ProgressChart tasks={tasks} completionMap={completionMap} />
                  </div>
                  <HeatmapCalendar tasks={tasks} completionMap={completionMap} startDate={startDate} />
                </div>

                {!screenshotMode && (
                  <div className="flex flex-col gap-4">
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
                    <div className="flex items-center gap-3">
                      <Label htmlFor="day-ends-at" className="text-sm font-medium text-foreground">
                        Day Ends At
                      </Label>
                      <input
                        id='day-ends-at-profile'
                        type="time"
                        value={dayEndsAt}
                        onChange={(e) => useUIStore.getState().setDayEndsAt(e.target.value)}
                        className="border border-border bg-background rounded-md px-2 py-1 text-sm h-9"
                        title="Day ends at time"
                      />
                    </div>
                  </div>
                )}

                {weeklyPlanningEnabled && (
                  <div className="rounded-xl border border-border bg-card p-5 glass-card">
                    <WeeklyHabits tasks={tasks} completionMap={completionMap} onToggle={handleToggle} />
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Analytics panel - desktop only */}
        {!screenshotMode && <AnalyticsPanel tasks={tasks} completionMap={completionMap} startDate={startDate} />}
      </div>

      {/* Mobile bottom nav */}
      <MobileNav onAddTask={() => setFormOpen(true)} />

      <HabitForm open={formOpen} onClose={handleCloseForm} editingTask={editingTask} onSubmit={handleSubmitTask} />

      {focusModeOpen && <FocusMode tasks={tasks} onClose={() => setFocusModeOpen(false)} />}

      <AutoScheduler open={autoSchedulerOpen} onClose={() => setAutoSchedulerOpen(false)} />

      <InactivityPrompt tasks={tasks} completionMap={completionMap} onStartFocus={handleStartFocus} />

      {proofTask && (
        <ProofOfWork
          open={!!proofTask}
          onClose={() => setProofTask(null)}
          taskId={proofTask.id}
          taskName={proofTask.name}
        />
      )}

      <AlertDialog open={!!deleteConfirmTask} onOpenChange={(open) => !open && setDeleteConfirmTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "<strong>{deleteConfirmTask?.name}</strong>"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Attribution Footer */}
      <div className="fixed bottom-0 right-6 mb-2 text-xs text-muted-foreground opacity-60 hover:opacity-100 transition-opacity z-10 hidden md:block">
        TaskTitan - Made by Braniac Technology
      </div>
    </div>
  );
}
