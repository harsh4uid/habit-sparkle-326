import { useState } from 'react';
import { useMoodLogs } from '@/hooks/useMoodLogs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const MOODS = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'low', emoji: '😔', label: 'Low' },
  { value: 'stressed', emoji: '😤', label: 'Stressed' },
];

const ENERGIES = [
  { value: 'high', label: 'High ⚡', color: 'bg-accent' },
  { value: 'medium', label: 'Medium', color: 'bg-chart-4' },
  { value: 'low', label: 'Low', color: 'bg-destructive' },
];

export function MoodTracker() {
  const { todayLog, logMood, recentLogs } = useMoodLogs();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedEnergy, setSelectedEnergy] = useState<string>('');

  const handleLog = () => {
    if (!selectedMood || !selectedEnergy) return;
    logMood.mutate({ mood: selectedMood, energy: selectedEnergy });
    setSelectedMood('');
    setSelectedEnergy('');
  };

  if (todayLog) {
    const moodInfo = MOODS.find((m) => m.value === todayLog.mood);
    const energyInfo = ENERGIES.find((e) => e.value === todayLog.energy);
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Heart className="h-4 w-4" /> Today's Mood
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{moodInfo?.emoji || '😐'}</span>
            <div>
              <p className="text-sm font-medium text-foreground">{moodInfo?.label}</p>
              <p className="text-xs text-muted-foreground">Energy: {energyInfo?.label}</p>
            </div>
          </div>
          {recentLogs.length > 1 && (
            <div className="flex gap-1 mt-3">
              {recentLogs.slice(0, 7).map((log, i) => {
                const m = MOODS.find((mo) => mo.value === log.mood);
                return (
                  <div key={i} className="text-center">
                    <span className="text-sm">{m?.emoji || '😐'}</span>
                    <p className="text-[8px] text-muted-foreground">{new Date(log.logged_at).toLocaleDateString('en', { weekday: 'short' })}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Heart className="h-4 w-4" /> How are you feeling?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 justify-center">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelectedMood(m.value)}
              className={`text-2xl p-1.5 rounded-lg transition-all ${
                selectedMood === m.value ? 'bg-primary/10 scale-110 ring-2 ring-primary' : 'hover:scale-105'
              }`}
            >
              {m.emoji}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-center">
          {ENERGIES.map((e) => (
            <button
              key={e.value}
              onClick={() => setSelectedEnergy(e.value)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                selectedEnergy === e.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          className="w-full"
          onClick={handleLog}
          disabled={!selectedMood || !selectedEnergy || logMood.isPending}
        >
          Log Mood
        </Button>
      </CardContent>
    </Card>
  );
}
