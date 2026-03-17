import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/hooks/useGamification';

const EMOJIS = ['🎯', '🔥', '💎', '⭐', '🧠', '🏆', '⚡', '🎮'];

interface CardData {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

export function MemoryFlipGame() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const { awardXP } = useGamification();

  const initGame = useCallback(() => {
    const pairs = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(pairs);
    setFlipped([]);
    setMoves(0);
    setGameOver(false);
    setStarted(true);
  }, []);

  const handleFlip = (id: number) => {
    if (flipped.length === 2) return;
    if (cards[id].matched || cards[id].flipped) return;

    const updated = [...cards];
    updated[id].flipped = true;
    setCards(updated);
    setFlipped([...flipped, id]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = flipped;
      if (cards[a].emoji === cards[b].emoji) {
        const updated = [...cards];
        updated[a].matched = true;
        updated[b].matched = true;
        setCards(updated);
        setFlipped([]);
        if (updated.every((c) => c.matched)) {
          setGameOver(true);
          awardXP.mutate('medium');
        }
      } else {
        setTimeout(() => {
          const updated = [...cards];
          updated[a].flipped = false;
          updated[b].flipped = false;
          setCards(updated);
          setFlipped([]);
        }, 800);
      }
    }
  }, [flipped]);

  if (!started) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">🧠 Memory Flip</CardTitle></CardHeader>
        <CardContent className="text-center space-y-3">
          <p className="text-xs text-muted-foreground">Match all pairs to earn XP!</p>
          <Button onClick={initGame}>Start Game</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">🧠 Memory Flip</CardTitle>
          <span className="text-xs text-muted-foreground">Moves: {moves}</span>
        </div>
      </CardHeader>
      <CardContent>
        {gameOver ? (
          <div className="text-center space-y-3">
            <p className="text-lg font-bold text-accent">🎉 Completed in {moves} moves!</p>
            <p className="text-xs text-muted-foreground">+25 XP earned</p>
            <Button onClick={initGame} size="sm">Play Again</Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleFlip(card.id)}
                className={`h-16 rounded-lg text-2xl flex items-center justify-center transition-all duration-200 ${
                  card.flipped || card.matched
                    ? 'bg-primary/10 scale-95'
                    : 'bg-muted hover:bg-muted/80'
                } ${card.matched ? 'opacity-50' : ''}`}
              >
                {card.flipped || card.matched ? card.emoji : '?'}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
