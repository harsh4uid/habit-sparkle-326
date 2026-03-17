import { MemoryFlipGame } from './games/MemoryFlipGame';
import { ReactionTimeTest } from './games/ReactionTimeTest';
import { MathSprint } from './games/MathSprint';
import { FocusTapGame } from './games/FocusTapGame';

export function BrainTools() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">🧠 Brain Tools</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Train your brain and earn XP! Each game rewards you for completing rounds.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MemoryFlipGame />
        <ReactionTimeTest />
        <MathSprint />
        <FocusTapGame />
      </div>
    </div>
  );
}
