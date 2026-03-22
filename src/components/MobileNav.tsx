import { LayoutDashboard, CheckSquare, Timer, Gamepad2, User, Plus } from 'lucide-react';
import { useUIStore } from '@/stores/useHabitStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  onAddTask: () => void;
}

type MobileView = 'dashboard' | 'tasks' | 'focus' | 'tools' | 'profile';

export function MobileNav({ onAddTask }: MobileNavProps) {
  const { mobileView, setMobileView, setFocusModeOpen, screenshotMode } = useUIStore();

  if (screenshotMode) return null;

  const tabs: { id: MobileView; icon: typeof LayoutDashboard; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'focus', icon: Timer, label: 'Focus' },
    { id: 'tools', icon: Gamepad2, label: 'Tools' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const handleTabClick = (id: MobileView) => {
    if (id === 'focus') {
      setFocusModeOpen(true);
    } else {
      setMobileView(id);
    }
  };

  return (
    <>
      {/* FAB - Add Task */}
      <Button
        onClick={onAddTask}
        className="fixed bottom-20 right-3 z-40 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg md:hidden text-sm sm:text-base"
        size="icon"
      >
        <Plus className="h-5 sm:h-6 w-5 sm:w-6" />
      </Button>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card md:hidden">
        <div className="flex items-center justify-around h-14 sm:h-16">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={cn(
                'flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-2 text-[10px] sm:text-xs transition-colors',
                mobileView === id
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 sm:h-5 w-4 sm:w-5" />
              <span className="line-clamp-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
