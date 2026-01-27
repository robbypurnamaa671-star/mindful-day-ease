import { useCallback, useRef } from 'react';
import { usePlanner } from './usePlanner';

export const useMeditationSounds = () => {
  const { settings } = usePlanner();
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    if (!settings.soundsEnabled) return;
    
    try {
      const ctx = getAudioContext();
      
      // Resume context if suspended (required after user interaction)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      // Soft envelope for gentle sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      console.log('Audio not supported');
    }
  }, [settings.soundsEnabled, getAudioContext]);

  // Soft ascending chime for inhale start
  const playInhaleChime = useCallback(() => {
    playTone(523.25, 0.8, 'sine', 0.15); // C5
    setTimeout(() => playTone(659.25, 0.6, 'sine', 0.12), 100); // E5
    setTimeout(() => playTone(783.99, 0.5, 'sine', 0.1), 200); // G5
  }, [playTone]);

  // Gentle hold tone
  const playHoldChime = useCallback(() => {
    playTone(440, 1.0, 'sine', 0.1); // A4 - soft sustained
  }, [playTone]);

  // Soft descending chime for exhale start
  const playExhaleChime = useCallback(() => {
    playTone(783.99, 0.6, 'sine', 0.12); // G5
    setTimeout(() => playTone(659.25, 0.5, 'sine', 0.1), 100); // E5
    setTimeout(() => playTone(523.25, 0.8, 'sine', 0.08), 200); // C5
  }, [playTone]);

  // Completion bell (soft singing bowl style)
  const playCompletionBell = useCallback(() => {
    playTone(261.63, 2.0, 'sine', 0.15); // C4
    playTone(329.63, 2.0, 'sine', 0.1); // E4
    playTone(392.00, 2.0, 'sine', 0.08); // G4
  }, [playTone]);

  return {
    playInhaleChime,
    playHoldChime,
    playExhaleChime,
    playCompletionBell,
  };
};
