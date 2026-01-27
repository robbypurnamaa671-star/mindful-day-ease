import { useState } from 'react';
import { Task, EffortLevel } from '@/types/planner';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';
import { Check, Clock, Hourglass, Brain, X, MessageCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onUpdate: (updates: Partial<Task>) => void;
  onRemove: () => void;
}

const effortConfig: Record<EffortLevel, { icon: typeof Clock; label: string; color: string }> = {
  short: { icon: Clock, label: 'Short', color: 'text-energy-high' },
  medium: { icon: Hourglass, label: 'Medium', color: 'text-energy-medium' },
  deep: { icon: Brain, label: 'Deep', color: 'text-energy-low' },
};

export function TaskItem({ task, onToggle, onUpdate, onRemove }: TaskItemProps) {
  const [showNote, setShowNote] = useState(false);
  const [noteValue, setNoteValue] = useState(task.mindfulnessNote || '');
  const { successTap, softTap } = useHaptics();

  const handleToggle = () => {
    if (!task.completed) {
      successTap();
    } else {
      softTap();
    }
    onToggle();
  };

  const handleSaveNote = () => {
    onUpdate({ mindfulnessNote: noteValue });
    setShowNote(false);
  };

  const EffortIcon = effortConfig[task.effort].icon;

  return (
    <div 
      className={cn(
        'card-mindful transition-all duration-300',
        task.completed && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          className={cn(
            'mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300',
            task.completed 
              ? 'bg-success border-success animate-check' 
              : 'border-primary/40 hover:border-primary hover:bg-primary/10'
          )}
        >
          {task.completed && <Check className="w-4 h-4 text-success-foreground" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium transition-all duration-300',
            task.completed && 'line-through text-muted-foreground'
          )}>
            {task.title}
          </p>
          
          <div className="flex items-center gap-3 mt-2">
            <div className={cn('flex items-center gap-1 text-xs', effortConfig[task.effort].color)}>
              <EffortIcon className="w-3 h-3" />
              <span>{effortConfig[task.effort].label}</span>
            </div>

            {task.mindfulnessNote && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageCircle className="w-3 h-3" />
                <span className="truncate max-w-[100px]">{task.mindfulnessNote}</span>
              </div>
            )}
          </div>

          {showNote && (
            <div className="mt-3 animate-gentle-fade">
              <textarea
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                placeholder="Add a mindfulness note..."
                className="input-mindful w-full text-sm resize-none"
                rows={2}
                maxLength={150}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSaveNote} className="btn-soft text-sm">
                  Save
                </button>
                <button 
                  onClick={() => setShowNote(false)} 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNote(!showNote)}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
