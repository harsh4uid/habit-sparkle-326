import { useScratchpad } from '@/hooks/useScratchpad';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StickyNote, Loader2 } from 'lucide-react';

export function Scratchpad() {
  const { content, updateContent, isLoading, isSaving } = useScratchpad();

  return (
    <Card className="h-screen md:h-[calc(100vh-200px)] flex flex-col">
      <CardHeader className="pb-2 shrink-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <StickyNote className="h-4 w-4" />
          Scratchpad
          {isSaving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => updateContent(e.target.value)}
            placeholder="Quick notes, rough ideas, temporary schedules..."
            className="w-full h-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground p-4 focus:outline-none font-mono overflow-y-auto"
          />
        )}
      </CardContent>
    </Card>
  );
}
