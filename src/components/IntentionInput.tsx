import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface IntentionInputProps {
  value: string;
  onChange: (intention: string) => void;
}

export function IntentionInput({ value, onChange }: IntentionInputProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    onChange(localValue);
  };

  return (
    <div className="card-mindful animate-gentle-fade">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Today's Intention</p>
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="What do you want to focus on today?"
        className="input-mindful w-full text-lg"
        maxLength={100}
      />
    </div>
  );
}
