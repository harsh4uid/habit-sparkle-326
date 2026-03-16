import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useScratchpad() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [localContent, setLocalContent] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const { data, isLoading } = useQuery({
    queryKey: ['scratchpad', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('scratchpad_notes')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (data) setLocalContent(data.content);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Not authenticated');
      if (data?.id) {
        const { error } = await supabase
          .from('scratchpad_notes')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('scratchpad_notes')
          .insert({ user_id: user.id, content });
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scratchpad'] }),
  });

  const updateContent = useCallback((content: string) => {
    setLocalContent(content);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveMutation.mutate(content);
    }, 2000);
  }, [saveMutation]);

  return { content: localContent, updateContent, isLoading, isSaving: saveMutation.isPending };
}
