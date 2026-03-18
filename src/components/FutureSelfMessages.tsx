import { useState } from 'react';
import { useFutureMessages } from '@/hooks/useFutureMessages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MessageSquareHeart, X, Send } from 'lucide-react';

export function FutureSelfMessages() {
  const { triggeredMessages, addMessage, markShown } = useFutureMessages();
  const [composing, setComposing] = useState(false);
  const [message, setMessage] = useState('');
  const [triggerDate, setTriggerDate] = useState('');

  const handleSend = () => {
    if (!message.trim() || !triggerDate) return;
    addMessage.mutate({ message: message.trim(), triggerAfter: triggerDate });
    setMessage('');
    setTriggerDate('');
    setComposing(false);
  };

  return (
    <>
      {/* Triggered messages banner */}
      {triggeredMessages.map((m) => (
        <div key={m.id} className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3 animate-fade-in">
          <MessageSquareHeart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Message from your past self:</p>
            <p className="text-sm text-foreground font-medium">"{m.message}"</p>
          </div>
          <button onClick={() => markShown.mutate(m.id)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}

      {/* Compose card */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MessageSquareHeart className="h-4 w-4 text-primary" /> Future Self
          </CardTitle>
        </CardHeader>
        <CardContent>
          {composing ? (
            <div className="space-y-2">
              <Textarea
                placeholder="Write a message to your future self..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="text-xs min-h-[60px]"
              />
              <Input
                type="date"
                value={triggerDate}
                onChange={(e) => setTriggerDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                className="text-xs"
              />
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 gap-1 text-xs" onClick={handleSend} disabled={!message.trim() || !triggerDate}>
                  <Send className="h-3 w-3" /> Send
                </Button>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => setComposing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => setComposing(true)}>
              Write to your future self ✍️
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
}
