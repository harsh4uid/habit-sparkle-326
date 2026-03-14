import { useHabitStore, HabitCategory } from '@/stores/useHabitStore';
import { categoryColors, categoryLabels } from '@/lib/habitUtils';
import { cn } from '@/lib/utils';
import { LayoutGrid, Heart, Zap, BookOpen, Dumbbell, Flower2 } from 'lucide-react';

const categoryIcons: Record<HabitCategory, React.ElementType> = {
  health: Heart,
  productivity: Zap,
  learning: BookOpen,
  fitness: Dumbbell,
  mindfulness: Flower2,
};

const categories: (HabitCategory | 'all')[] = ['all', 'health', 'productivity', 'learning', 'fitness', 'mindfulness'];

export function CategorySidebar() {
  const { selectedCategory, setSelectedCategory, habits } = useHabitStore();

  return (
    <aside className="w-52 shrink-0 border-r border-border bg-card p-4 hidden lg:block">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Categories</p>
      <nav className="space-y-1">
        {categories.map((cat) => {
          const isAll = cat === 'all';
          const Icon = isAll ? LayoutGrid : categoryIcons[cat as HabitCategory];
          const count = isAll
            ? habits.filter(h => h.frequency === 'daily').length
            : habits.filter((h) => h.category === cat && h.frequency === 'daily').length;
          const active = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{isAll ? 'All Habits' : categoryLabels[cat as HabitCategory]}</span>
              <span className={cn(
                'text-xs tabular-nums',
                active ? 'text-primary' : 'text-muted-foreground'
              )}>{count}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
