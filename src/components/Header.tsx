import { Moon, Sun, Plus } from 'lucide-react';
import { useHabitStore } from '@/stores/useHabitStore';
import { months } from '@/lib/habitUtils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onAddHabit: () => void;
}

export function Header({ darkMode, onToggleDarkMode, onAddHabit }: HeaderProps) {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = useHabitStore();

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">P</span>
        </div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Pulse</h1>
      </div>

      <div className="flex items-center gap-3">
        <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, i) => (
              <SelectItem key={i} value={String(i)}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
          <SelectTrigger className="w-[100px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="sm" onClick={onAddHabit} className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Habit</span>
        </Button>

        <Button variant="ghost" size="icon" onClick={onToggleDarkMode} className="h-9 w-9">
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
