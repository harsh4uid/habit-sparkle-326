import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { Category } from '@/stores/useHabitStore';

export function useCategories() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });
      if (error) throw error;
      return data as Category[];
    },
    enabled: !!user,
  });

  const addCategory = useMutation({
    mutationFn: async ({ name, color }: { name: string; color: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('categories')
        .insert({ name, color, user_id: user.id, position: categories.length })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category added');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, name, color }: { id: string; name: string; color?: string }) => {
      const updates: any = { name };
      if (color) updates.color = color;
      const { error } = await supabase.from('categories').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', 'tasks'] });
      toast.success('Category deleted');
    },
    onError: (err: any) => toast.error(err.message),
  });

  return { categories, isLoading, addCategory, updateCategory, deleteCategory };
}
