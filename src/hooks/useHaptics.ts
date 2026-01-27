import { useCallback } from 'react';
import { usePlanner } from './usePlanner';

export function useHaptics() {
  const { settings } = usePlanner();

  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (settings.hapticsEnabled && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, [settings.hapticsEnabled]);

  const softTap = useCallback(() => vibrate(10), [vibrate]);
  const successTap = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const gentlePulse = useCallback(() => vibrate([5, 30, 5, 30, 5]), [vibrate]);

  return { softTap, successTap, gentlePulse };
}
