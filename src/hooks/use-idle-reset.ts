// Idle timeout hook for automatic session reset
import { useEffect, useRef } from 'react';
import { CONSTANTS } from '@/lib/constants';
import type { Screen } from '@/types';

interface UseIdleResetOptions {
  onReset: () => void;
  currentScreen: Screen;
  enabled?: boolean;
}

export const useIdleReset = ({
  onReset,
  currentScreen,
  enabled = true,
}: UseIdleResetOptions): void => {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Don't reset during capture screen (user is actively taking photos)
    if (!enabled || currentScreen === 'capture') {
      return;
    }

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        onReset();
      }, CONSTANTS.IDLE_TIMEOUT_MS);
    };

    // Start timer on mount
    resetTimer();

    // Reset timer on user interaction
    const events = ['mousedown', 'touchstart', 'keydown'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [onReset, currentScreen, enabled]);
};

