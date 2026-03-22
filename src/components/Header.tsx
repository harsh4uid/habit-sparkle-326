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
        <div className="flex items-center gap-2">
          <img src="/tasktitan-logo.png" alt="TaskTitan" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-foreground">TaskTitan</h1>
        </div>
        <Button size="sm" variant="outline" onClick={() => setScreenshotMode(false)} className="gap-1.5">
          <X className="h-4 w-4" /> Exit Screenshot
        </Button>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between px-3 md:px-6 py-2 md:py-4 border-b border-border bg-card gap-3">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <img src="/tasktitan-logo.png" alt="TaskTitan" className="h-6 md:h-8 w-6 md:w-8 shrink-0" />
        <div className="hidden md:flex flex-col">
          <h1 className="text-base md:text-xl font-bold text-foreground tracking-tight leading-tight truncate">TaskTitan</h1>
          <div className="text-xs text-muted-foreground font-medium flex items-center gap-2 mt-0.5">
            <span>Today (ends at {dayEndsAt})</span>
            <span className="opacity-40">|</span>
            <span>Current Time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 flex-wrap justify-end">
        <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
          <SelectTrigger className="w-[90px] md:w-[110px] lg:w-[130px] h-8 md:h-9 text-xs md:text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {months.map((m, i) => (
              <SelectItem key={i} value={String(i)}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
          <SelectTrigger className="w-[70px] md:w-[80px] lg:w-[90px] h-8 md:h-9 text-xs md:text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="sm" onClick={onAddTask} className="gap-1 md:gap-1.5 h-8 md:h-9 px-2 md:px-3 text-xs md:text-sm">
          <Plus className="h-3.5 md:h-4 w-3.5 md:w-4" />
          <span className="hidden md:inline">Add</span>
        </Button>

        <Button size="sm" variant="outline" onClick={() => setFocusModeOpen(true)} className="gap-1 md:gap-1.5 h-8 md:h-9 px-2 md:px-3 text-xs md:text-sm">
          <Timer className="h-3.5 md:h-4 w-3.5 md:w-4" />
          <span className="hidden lg:inline">Focus</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 md:gap-1.5 h-8 md:h-9 px-2 md:px-3 text-xs md:text-sm">
              <Download className="h-3.5 md:h-4 w-3.5 md:w-4" />
              <span className="hidden lg:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onExportPDF}>Download as PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPNG}>Download as PNG</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={onToggleDarkMode} className="h-8 md:h-9 w-8 md:w-9">
          {darkMode ? <Sun className="h-3.5 md:h-4 w-3.5 md:w-4" /> : <Moon className="h-3.5 md:h-4 w-3.5 md:w-4" />}
        </Button>

        <Button variant="ghost" size="icon" onClick={onSignOut} className="h-8 md:h-9 w-8 md:w-9 text-destructive">
          <LogOut className="h-3.5 md:h-4 w-3.5 md:w-4" />
        </Button>
      </div>
    </header>
  );
}
