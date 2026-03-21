import { toast } from 'sonner';

const MESSAGES = [
  "🔥 Great job! Keep the momentum going!",
  "⚡ You're on fire! One more task?",
  "🎯 Consistency beats intensity. You're doing great!",
  "💪 Small wins lead to big results!",
  "🧠 Your future self will thank you!",
  "✨ That's the way! Progress over perfection.",
  "🏆 Another one done — champion mindset!",
  "🚀 Unstoppable! What's next?",
];

const INACTIVITY_MESSAGES = [
  "Start now. Just 5 minutes.",
  "Your future self will thank you.",
  "A small step is still a step forward.",
  "Don't wait for motivation — create it.",
  "You've got this. Start with one task.",
];

export function showMotivationalToast() {
  const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  toast.success(msg, { duration: 2500 });
}

export function getRandomInactivityMessage(): string {
  return INACTIVITY_MESSAGES[Math.floor(Math.random() * INACTIVITY_MESSAGES.length)];
}
