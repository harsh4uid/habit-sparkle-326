import { useProfile } from '@/hooks/useProfile';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export function HardModeToggle() {
  const { hardMode, updateProfile } = useProfile();

  return (
    <Card className={hardMode ? 'border-destructive/40 bg-destructive/5' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-destructive" /> Hard Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="hard-mode" className="text-xs text-muted-foreground cursor-pointer">
            {hardMode ? '🔥 Active — 2x XP, XP loss on failure' : 'Enable for 2x XP rewards'}
          </Label>
          <Switch
            id="hard-mode"
            checked={hardMode}
            onCheckedChange={(checked) => updateProfile.mutate({ hard_mode: checked })}
          />
        </div>
        {hardMode && (
          <ul className="text-[10px] text-destructive/80 space-y-1">
            <li>• No streak protection</li>
            <li>• -10 XP on missed tasks</li>
            <li>• 2x XP on completion</li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
