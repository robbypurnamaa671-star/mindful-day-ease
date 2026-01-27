import { useState } from 'react';
import { usePlanner } from '@/hooks/usePlanner';
import { PageHeader } from '@/components/PageHeader';
import { DayEntry } from '@/types/planner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ChevronRight, Check, Sparkles, Heart, Calendar } from 'lucide-react';

export default function HistoryPage() {
  const { history, getEntry } = usePlanner();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const selectedEntry = selectedDate ? getEntry(selectedDate) : null;

  if (selectedEntry) {
    return (
      <div className="min-h-screen pb-28">
        <div className="container max-w-lg mx-auto px-4">
          <button
            onClick={() => setSelectedDate(null)}
            className="mt-6 text-sm text-primary font-medium hover:underline"
          >
            ← Back to history
          </button>

          <PageHeader
            title={format(new Date(selectedEntry.date), 'EEEE, MMMM d')}
          />

          <div className="space-y-4">
            {selectedEntry.intention && (
              <div className="card-mindful animate-gentle-fade">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground font-medium">Intention</span>
                </div>
                <p className="text-foreground">{selectedEntry.intention}</p>
              </div>
            )}

            {selectedEntry.mood && (
              <div className="card-mindful animate-gentle-fade" style={{ animationDelay: '0.1s' }}>
                <span className="text-sm text-muted-foreground font-medium">Mood</span>
                <p className="text-2xl mt-1">
                  {['😔', '😕', '😌', '🙂', '😊'][selectedEntry.mood - 1]}
                </p>
              </div>
            )}

            {selectedEntry.tasks.length > 0 && (
              <div className="card-mindful animate-gentle-fade" style={{ animationDelay: '0.2s' }}>
                <span className="text-sm text-muted-foreground font-medium">Tasks</span>
                <div className="mt-3 space-y-2">
                  {selectedEntry.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3">
                      <div className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center',
                        task.completed ? 'bg-success' : 'border-2 border-muted-foreground/30'
                      )}>
                        {task.completed && <Check className="w-3 h-3 text-success-foreground" />}
                      </div>
                      <span className={cn(task.completed && 'line-through text-muted-foreground')}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedEntry.reflection?.gratitude && (
              <div className="card-mindful animate-gentle-fade" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-muted-foreground font-medium">Gratitude</span>
                </div>
                <p className="text-foreground">{selectedEntry.reflection.gratitude}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      <div className="container max-w-lg mx-auto px-4">
        <PageHeader
          title="Your Journey"
          subtitle="A gentle look back at your days"
        />

        {history.length === 0 ? (
          <div className="card-mindful text-center py-12 animate-gentle-fade">
            <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No past entries yet.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Your history will appear here tomorrow.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((entry, index) => (
              <DayCard
                key={entry.date}
                entry={entry}
                onClick={() => setSelectedDate(entry.date)}
                delay={index * 0.05}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DayCard({ 
  entry, 
  onClick, 
  delay 
}: { 
  entry: DayEntry; 
  onClick: () => void; 
  delay: number;
}) {
  const completedTasks = entry.tasks.filter((t) => t.completed).length;
  const totalTasks = entry.tasks.length;

  return (
    <button
      onClick={onClick}
      className="w-full card-mindful text-left hover:shadow-float transition-all duration-300 animate-gentle-fade"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">
            {format(new Date(entry.date), 'EEEE, MMM d')}
          </p>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            {entry.mood && (
              <span>{['😔', '😕', '😌', '🙂', '😊'][entry.mood - 1]}</span>
            )}
            {totalTasks > 0 && (
              <span>{completedTasks}/{totalTasks} tasks</span>
            )}
          </div>
          {entry.intention && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
              "{entry.intention}"
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </button>
  );
}
