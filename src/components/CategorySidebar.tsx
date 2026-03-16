import { useState } from 'react';
import { useUIStore } from '@/stores/useHabitStore';
import { useCategories } from '@/hooks/useCategories';
import { useTasks } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';
import { LayoutGrid, Plus, Pencil, Trash2, X, Check, StickyNote, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORY_COLORS } from '@/lib/habitUtils';

export function CategorySidebar() {
  const { selectedCategory, setSelectedCategory, setScratchpadOpen, scratchpadOpen } = useUIStore();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { tasks } = useTasks();

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    const color = CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length];
    addCategory.mutate({ name: newName.trim(), color });
    setNewName('');
    setAdding(false);
  };

  const handleEdit = (id: string) => {
    if (!editName.trim()) return;
    updateCategory.mutate({ id, name: editName.trim() });
    setEditingId(null);
  };

  const totalDailyTasks = tasks.filter(t => t.frequency === 'daily').length;

  return (
    <aside className="w-52 shrink-0 border-r border-border bg-card p-4 hidden lg:block overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</p>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAdding(!adding)}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {adding && (
        <div className="flex items-center gap-1 mb-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="h-7 text-xs"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleAdd}>
            <Check className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setAdding(false)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      <nav className="space-y-1">
        <button
          onClick={() => { setSelectedCategory('all'); setScratchpadOpen(false); }}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            selectedCategory === 'all' && !scratchpadOpen
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="flex-1 text-left">All Tasks</span>
          <span className="text-xs tabular-nums">{totalDailyTasks}</span>
        </button>

        {categories.map((cat) => {
          const count = tasks.filter(t => t.category_id === cat.id && t.frequency === 'daily').length;
          const active = selectedCategory === cat.id && !scratchpadOpen;

          return (
            <div key={cat.id} className="group relative">
              {editingId === cat.id ? (
                <div className="flex items-center gap-1 px-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-7 text-xs"
                    onKeyDown={(e) => e.key === 'Enter' && handleEdit(cat.id)}
                    autoFocus
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => handleEdit(cat.id)}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setEditingId(null)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => { setSelectedCategory(cat.id); setScratchpadOpen(false); }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="flex-1 text-left truncate">{cat.name}</span>
                  <span className="text-xs tabular-nums">{count}</span>
                </button>
              )}
              {editingId !== cat.id && (
                <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-0.5">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteCategory.mutate(cat.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-6 pt-4 border-t border-border space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tools</p>
        <button
          onClick={() => setScratchpadOpen(!scratchpadOpen)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            scratchpadOpen
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <StickyNote className="h-4 w-4" />
          <span className="flex-1 text-left">Scratchpad</span>
        </button>
      </div>
    </aside>
  );
}
