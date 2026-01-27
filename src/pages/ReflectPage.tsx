import { useState, useEffect } from 'react';
import { usePlanner } from '@/hooks/usePlanner';
import { useHaptics } from '@/hooks/useHaptics';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/lib/utils';
import { Sparkles, Heart, Cloud, Feather, Plus, X } from 'lucide-react';

export default function ReflectPage() {
  const { today, saveReflection, letGo } = usePlanner();
  const { gentlePulse, successTap } = useHaptics();
  
  const [wentWell, setWentWell] = useState<string[]>(today.reflection?.wentWell || []);
  const [newWentWell, setNewWentWell] = useState('');
  const [feltHeavy, setFeltHeavy] = useState(today.reflection?.feltHeavy || '');
  const [gratitude, setGratitude] = useState(today.reflection?.gratitude || '');
  const [isLettingGo, setIsLettingGo] = useState(false);

  const incompleteTasks = today.tasks.filter((t) => !t.completed);
  const hasLetGo = today.reflection?.letGo;

  useEffect(() => {
    saveReflection({
      wentWell,
      feltHeavy,
      gratitude,
      letGo: hasLetGo || false,
    });
  }, [wentWell, feltHeavy, gratitude, hasLetGo, saveReflection]);

  const addWentWell = () => {
    if (newWentWell.trim() && wentWell.length < 3) {
      setWentWell([...wentWell, newWentWell.trim()]);
      setNewWentWell('');
    }
  };

  const removeWentWell = (index: number) => {
    setWentWell(wentWell.filter((_, i) => i !== index));
  };

  const handleLetGo = () => {
    setIsLettingGo(true);
    gentlePulse();
    
    setTimeout(() => {
      letGo();
      successTap();
      setIsLettingGo(false);
    }, 800);
  };

  return (
    <div className="min-h-screen pb-28">
      <div className="container max-w-lg mx-auto px-4">
        <PageHeader
          title="Evening Reflection"
          subtitle="Take a moment to honor your day"
        />

        <div className="space-y-6">
          {/* What went well */}
          <div className="card-mindful animate-gentle-fade">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-medium">What went well today?</h2>
            </div>
            
            <div className="space-y-2 mb-3">
              {wentWell.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-success/10 text-success-foreground p-3 rounded-xl animate-scale-in"
                >
                  <span className="flex-1 text-foreground">{item}</span>
                  <button
                    onClick={() => removeWentWell(index)}
                    className="p-1 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>

            {wentWell.length < 3 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWentWell}
                  onChange={(e) => setNewWentWell(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addWentWell()}
                  placeholder="Something that made you smile..."
                  className="input-mindful flex-1"
                  maxLength={100}
                />
                <button onClick={addWentWell} className="btn-soft">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* What felt heavy */}
          <div className="card-mindful animate-gentle-fade" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-medium">What felt heavy?</h2>
              <span className="text-xs text-muted-foreground">(optional)</span>
            </div>
            <textarea
              value={feltHeavy}
              onChange={(e) => setFeltHeavy(e.target.value)}
              placeholder="Acknowledge what was difficult..."
              className="input-mindful w-full resize-none"
              rows={2}
              maxLength={200}
            />
          </div>

          {/* Gratitude */}
          <div className="card-mindful animate-gentle-fade" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-destructive" />
              <h2 className="font-medium">One thing I'm grateful for</h2>
            </div>
            <input
              type="text"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="A simple gratitude..."
              className="input-mindful w-full"
              maxLength={100}
            />
          </div>

          {/* Let Go */}
          {incompleteTasks.length > 0 && !hasLetGo && (
            <div className="card-mindful animate-gentle-fade border-2 border-dashed border-primary/20" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 mb-4">
                <Feather className="w-4 h-4 text-primary" />
                <h2 className="font-medium">Let Go of Today</h2>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {incompleteTasks.length} task{incompleteTasks.length > 1 ? 's' : ''} will gently move to tomorrow. 
                No pressure, just a fresh start.
              </p>

              <div className={cn('space-y-2 mb-4', isLettingGo && 'animate-let-go')}>
                {incompleteTasks.map((task) => (
                  <div key={task.id} className="bg-muted/50 p-3 rounded-xl text-sm">
                    {task.title}
                  </div>
                ))}
              </div>

              <button
                onClick={handleLetGo}
                disabled={isLettingGo}
                className="w-full py-4 rounded-2xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Feather className="w-5 h-5" />
                <span>Release and Rest</span>
              </button>
            </div>
          )}

          {hasLetGo && (
            <div className="card-mindful text-center py-8 animate-gentle-fade">
              <Feather className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-muted-foreground">
                You've let go for today. Rest well.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
