import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useMeditationSounds } from '@/hooks/useMeditationSounds';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

const PHASE_DURATIONS = {
  inhale: 4,
  hold: 7,
  exhale: 8,
};

const PHASE_LABELS = {
  idle: 'Ready',
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
};

export const BreathingExercise = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const prevPhaseRef = useRef<Phase>('idle');
  
  const { playInhaleChime, playHoldChime, playExhaleChime, playCompletionBell } = useMeditationSounds();

  const getNextPhase = useCallback((currentPhase: Phase): Phase => {
    switch (currentPhase) {
      case 'idle':
      case 'exhale':
        return 'inhale';
      case 'inhale':
        return 'hold';
      case 'hold':
        return 'exhale';
      default:
        return 'inhale';
    }
  }, []);

  const startNextPhase = useCallback((nextPhase: Phase) => {
    setPhase(nextPhase);
    setTimeLeft(PHASE_DURATIONS[nextPhase]);
    
    if (nextPhase === 'inhale' && prevPhaseRef.current !== 'idle') {
      setCycleCount(prev => prev + 1);
    }
    prevPhaseRef.current = nextPhase;
  }, []);

  // Play sounds on phase transitions
  useEffect(() => {
    if (!isRunning || phase === 'idle') return;
    
    switch (phase) {
      case 'inhale':
        playInhaleChime();
        break;
      case 'hold':
        playHoldChime();
        break;
      case 'exhale':
        playExhaleChime();
        break;
    }
  }, [phase, isRunning, playInhaleChime, playHoldChime, playExhaleChime]);

  // Play completion bell when cycles reach milestones
  useEffect(() => {
    if (cycleCount > 0 && cycleCount % 4 === 0) {
      playCompletionBell();
    }
  }, [cycleCount, playCompletionBell]);

  useEffect(() => {
    if (!isRunning) return;

    if (phase === 'idle') {
      startNextPhase('inhale');
      return;
    }

    if (timeLeft <= 0) {
      const nextPhase = getNextPhase(phase);
      startNextPhase(nextPhase);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, phase, timeLeft, getNextPhase, startNextPhase]);

  const handleStart = () => {
    setIsRunning(true);
    if (phase === 'idle') {
      startNextPhase('inhale');
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('idle');
    setTimeLeft(0);
    setCycleCount(0);
  };

  const getCircleScale = () => {
    if (phase === 'idle') return 1;
    
    const duration = PHASE_DURATIONS[phase];
    const progress = 1 - timeLeft / duration;
    
    switch (phase) {
      case 'inhale':
        return 1 + progress * 0.5; // Scale from 1 to 1.5
      case 'hold':
        return 1.5; // Stay at max
      case 'exhale':
        return 1.5 - progress * 0.5; // Scale from 1.5 to 1
      default:
        return 1;
    }
  };

  const getCircleOpacity = () => {
    if (phase === 'idle') return 0.3;
    
    const duration = PHASE_DURATIONS[phase];
    const progress = 1 - timeLeft / duration;
    
    switch (phase) {
      case 'inhale':
        return 0.3 + progress * 0.4;
      case 'hold':
        return 0.7;
      case 'exhale':
        return 0.7 - progress * 0.4;
      default:
        return 0.3;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-8">
      {/* Breathing Circle */}
      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Outer ring */}
        <div className="absolute w-full h-full rounded-full border-2 border-primary/20" />
        
        {/* Animated breathing circle */}
        <div
          className="absolute w-40 h-40 rounded-full bg-primary transition-all duration-1000 ease-in-out"
          style={{
            transform: `scale(${getCircleScale()})`,
            opacity: getCircleOpacity(),
          }}
        />
        
        {/* Inner content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-light text-foreground/80">
            {PHASE_LABELS[phase]}
          </span>
          {phase !== 'idle' && (
            <span className="text-4xl font-light text-foreground mt-2">
              {timeLeft}
            </span>
          )}
        </div>
      </div>

      {/* Cycle Counter */}
      {cycleCount > 0 && (
        <p className="text-sm text-muted-foreground animate-fade-in">
          {cycleCount} cycle{cycleCount !== 1 ? 's' : ''} completed
        </p>
      )}

      {/* Phase Indicators */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className={`flex flex-col items-center transition-colors ${phase === 'inhale' ? 'text-primary' : ''}`}>
          <span className="font-medium">4s</span>
          <span>In</span>
        </div>
        <div className={`flex flex-col items-center transition-colors ${phase === 'hold' ? 'text-primary' : ''}`}>
          <span className="font-medium">7s</span>
          <span>Hold</span>
        </div>
        <div className={`flex flex-col items-center transition-colors ${phase === 'exhale' ? 'text-primary' : ''}`}>
          <span className="font-medium">8s</span>
          <span>Out</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            size="lg"
            className="rounded-full px-8 gap-2"
          >
            <Play className="w-5 h-5" />
            {phase === 'idle' ? 'Start' : 'Resume'}
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            size="lg"
            variant="outline"
            className="rounded-full px-8 gap-2"
          >
            <Pause className="w-5 h-5" />
            Pause
          </Button>
        )}
        
        {phase !== 'idle' && (
          <Button
            onClick={handleReset}
            size="lg"
            variant="ghost"
            className="rounded-full gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </Button>
        )}
      </div>

      {/* Description */}
      <p className="text-center text-sm text-muted-foreground max-w-xs leading-relaxed">
        The 4-7-8 technique helps calm your nervous system and reduce anxiety. 
        Practice for at least 4 cycles for best results.
      </p>
    </div>
  );
};
