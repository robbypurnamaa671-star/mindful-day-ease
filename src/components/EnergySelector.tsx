import { EnergyLevel } from '@/types/planner';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';
import { Battery, BatteryMedium, BatteryFull } from 'lucide-react';

interface EnergySelectorProps {
  value: EnergyLevel | null;
  onChange: (energy: EnergyLevel) => void;
}

const energyLevels: { level: EnergyLevel; icon: typeof Battery; label: string }[] = [
  { level: 'low', icon: Battery, label: 'Low' },
  { level: 'medium', icon: BatteryMedium, label: 'Medium' },
  { level: 'high', icon: BatteryFull, label: 'High' },
];

export function EnergySelector({ value, onChange }: EnergySelectorProps) {
  const { softTap } = useHaptics();

  const handleSelect = (level: EnergyLevel) => {
    softTap();
    onChange(level);
  };

  return (
    <div className="card-mindful animate-gentle-fade" style={{ animationDelay: '0.1s' }}>
      <p className="text-sm text-muted-foreground mb-4 font-medium">Your energy today</p>
      <div className="flex gap-3">
        {energyLevels.map((energy) => {
          const Icon = energy.icon;
          return (
            <button
              key={energy.level}
              onClick={() => handleSelect(energy.level)}
              className={cn(
                'flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300',
                'hover:bg-muted/50 active:scale-95 border border-transparent',
                value === energy.level && [
                  'border-2',
                  energy.level === 'low' && 'bg-energy-low/10 border-energy-low/40',
                  energy.level === 'medium' && 'bg-energy-medium/10 border-energy-medium/40',
                  energy.level === 'high' && 'bg-energy-high/10 border-energy-high/40',
                ]
              )}
            >
              <Icon 
                className={cn(
                  'w-6 h-6 transition-colors',
                  value === energy.level ? [
                    energy.level === 'low' && 'text-energy-low',
                    energy.level === 'medium' && 'text-energy-medium',
                    energy.level === 'high' && 'text-energy-high',
                  ] : 'text-muted-foreground'
                )} 
              />
              <span className="text-sm font-medium">{energy.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
