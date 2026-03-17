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
        className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg md:hidden"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card md:hidden">
        <div className="flex items-center justify-around h-16">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors',
                mobileView === id
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
