import { useState } from 'react';
import { EffortLevel } from '@/types/planner';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';
import { Plus, Clock, Hourglass, Brain } from 'lucide-react';

interface AddTaskFormProps {
  onAdd: (task: { title: string; completed: boolean; effort: EffortLevel }) => void;
  disabled: boolean;
}

const effortOptions: { level: EffortLevel; icon: typeof Clock; label: string }[] = [
  { level: 'short', icon: Clock, label: 'Short' },
  { level: 'medium', icon: Hourglass, label: 'Medium' },
  { level: 'deep', icon: Brain, label: 'Deep' },
];

export function AddTaskForm({ onAdd, disabled }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [effort, setEffort] = useState<EffortLevel>('short');
  const { softTap } = useHaptics();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    softTap();
    onAdd({ title: title.trim(), completed: false, effort });
    setTitle('');
    setEffort('short');
    setIsOpen(false);
  };

  if (disabled) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        <p>You've set your 3 priorities for today ✨</p>
        <p className="text-xs mt-1">Focus on what matters most</p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          softTap();
          setIsOpen(true);
        }}
        className="w-full p-4 rounded-2xl border-2 border-dashed border-primary/30 text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Priority</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-mindful animate-scale-in">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What's important today?"
        className="input-mindful w-full text-lg mb-4"
        autoFocus
        maxLength={80}
      />

      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Effort needed</p>
        <div className="flex gap-2">
          {effortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.level}
                type="button"
                onClick={() => setEffort(option.level)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300',
                  effort === option.level 
                    ? 'bg-primary/10 ring-2 ring-primary/30 text-primary' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn-soft flex-1">
          Add Priority
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
