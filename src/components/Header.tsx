import { useState, useEffect } from 'react';
import { Moon, Sun, Plus, Download, LogOut, Camera, Timer, X, CalendarClock } from 'lucide-react';
import { useUIStore } from '@/stores/useHabitStore';
import { months } from '@/lib/habitUtils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onAddTask: () => void;
  onExportPDF: () => void;
  onExportPNG: () => void;
  onSignOut: () => void;
}

export function Header({ darkMode, onToggleDarkMode, onAddTask, onExportPDF, onExportPNG, onSignOut }: HeaderProps) {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear, screenshotMode, setScreenshotMode, setFocusModeOpen, setAutoSchedulerOpen, dayEndsAt } = useUIStore();
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (screenshotMode) {
    return (
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <h1 className="text-xl font-bold text-foreground">Work Scheduler</h1>
        <Button size="sm" variant="outline" onClick={() => setScreenshotMode(false)} className="gap-1.5">
          <X className="h-4 w-4" /> Exit Screenshot
        </Button>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">WS</span>
        </div>
        <div className="hidden lg:flex flex-col">
          <h1 className="text-xl font-bold text-foreground tracking-tight leading-tight">Work Scheduler</h1>
          <div className="text-xs text-muted-foreground font-medium flex items-center gap-2 mt-0.5">
            <span>Today (ends at {dayEndsAt})</span>
            <span className="opacity-40">|</span>
            <span>Current Time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
          <SelectTrigger className="w-[110px] lg:w-[130px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {months.map((m, i) => (
              <SelectItem key={i} value={String(i)}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
          <SelectTrigger className="w-[80px] lg:w-[90px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="sm" onClick={onAddTask} className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden lg:inline">Add Task</span>
        </Button>

        <Button size="sm" variant="outline" onClick={() => setAutoSchedulerOpen(true)} className="gap-1.5">
          <CalendarClock className="h-4 w-4" />
          <span className="hidden lg:inline">Auto Schedule</span>
        </Button>

        <Button size="sm" variant="outline" onClick={() => setFocusModeOpen(true)} className="gap-1.5">
          <Timer className="h-4 w-4" />
          <span className="hidden lg:inline">Focus</span>
        </Button>

        <Button size="sm" variant="outline" onClick={() => setScreenshotMode(true)} className="gap-1.5">
          <Camera className="h-4 w-4" />
          <span className="hidden lg:inline">Screenshot</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              <span className="hidden lg:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onExportPDF}>Download as PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPNG}>Download as PNG</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={onToggleDarkMode} className="h-9 w-9">
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="icon" onClick={onSignOut} className="h-9 w-9 text-destructive">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
