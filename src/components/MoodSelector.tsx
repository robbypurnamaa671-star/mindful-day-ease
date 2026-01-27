import { MoodLevel } from '@/types/planner';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';

interface MoodSelectorProps {
  value: MoodLevel | null;
  onChange: (mood: MoodLevel) => void;
}

const moods: { level: MoodLevel; emoji: string; label: string }[] = [
  { level: 1, emoji: '😔', label: 'Struggling' },
  { level: 2, emoji: '😕', label: 'Low' },
  { level: 3, emoji: '😌', label: 'Okay' },
  { level: 4, emoji: '🙂', label: 'Good' },
  { level: 5, emoji: '😊', label: 'Great' },
];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const { softTap } = useHaptics();

  const handleSelect = (level: MoodLevel) => {
    softTap();
    onChange(level);
  };

  return (
    <div className="card-mindful animate-gentle-fade">
      <p className="text-sm text-muted-foreground mb-4 font-medium">How are you feeling?</p>
      <div className="flex justify-between gap-2">
        {moods.map((mood) => (
          <button
            key={mood.level}
            onClick={() => handleSelect(mood.level)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300',
              'hover:bg-muted/50 active:scale-95',
              value === mood.level && 'bg-primary/10 ring-2 ring-primary/30'
            )}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs text-muted-foreground">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
