import { useState, useRef } from 'react';
import { useProofOfWork } from '@/hooks/useProofOfWork';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Camera, FileText, Upload } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  taskId: string;
  taskName: string;
}

export function ProofOfWork({ open, onClose, taskId, taskName }: Props) {
  const [note, setNote] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { submitProof } = useProofOfWork();

  const handleSubmit = () => {
    submitProof.mutate({ taskId, note, imageFile: imageFile || undefined }, {
      onSuccess: () => {
        setNote('');
        setImageFile(null);
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" /> Proof of Work
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">Document your completion of: <strong>{taskName}</strong></p>
        <Textarea
          placeholder="What did you accomplish? Add notes..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="text-xs min-h-[80px]"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 text-xs gap-1" onClick={() => fileRef.current?.click()}>
            <Camera className="h-3 w-3" /> {imageFile ? imageFile.name : 'Add Photo'}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 text-xs gap-1" onClick={handleSubmit} disabled={!note.trim()}>
            <Upload className="h-3 w-3" /> Submit Proof
          </Button>
          <Button size="sm" variant="outline" className="text-xs" onClick={onClose}>Skip</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
