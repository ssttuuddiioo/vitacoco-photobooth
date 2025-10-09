// Flash overlay effect for camera capture
import { useEffect } from 'react';
import { playShutterSound, triggerHaptic } from '@/lib/animation-utils';

interface FlashOverlayProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const FlashOverlay = ({ trigger, onComplete }: FlashOverlayProps) => {
  useEffect(() => {
    if (!trigger) return;

    // Play sound and haptic immediately for instant feedback
    playShutterSound();
    triggerHaptic('heavy');
    
    // Call onComplete if provided (but capture screen now handles timing)
    onComplete?.();
  }, [trigger, onComplete]);

  // Show flash only when triggered
  if (!trigger) return null;

  return (
    // ONLY full white screen flash - no burst effects
    // Using CSS transition for smoother performance
    <div
      className="fixed inset-0 bg-white pointer-events-none z-50 animate-flash"
      aria-hidden="true"
      style={{
        animation: 'flash 0.2s ease-out forwards'
      }}
    />
  );
};

