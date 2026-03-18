import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useProofOfWork() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const submitProof = useMutation({
    mutationFn: async ({ taskId, note, imageFile }: { taskId: string; note: string; imageFile?: File }) => {
      if (!user) throw new Error('Not authenticated');
      let image_url: string | null = null;

      if (imageFile) {
        const path = `${user.id}/${Date.now()}-${imageFile.name}`;
        const { error: uploadErr } = await supabase.storage
          .from('proof-images')
          .upload(path, imageFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from('proof-images').getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      const { error } = await supabase
        .from('proof_of_work')
        .insert({ user_id: user.id, task_id: taskId, note, image_url });
      if (error) throw error;
      toast.success('Proof submitted! 💪');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proof_of_work'] }),
  });

  return { submitProof };
}
