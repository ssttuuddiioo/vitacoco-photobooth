// Flash overlay effect for camera capture
import { useEffect, useState } from 'react';
import { CONSTANTS } from '@/lib/constants';
import { playShutterSound, triggerHaptic } from '@/lib/animation-utils';

interface FlashOverlayProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const FlashOverlay = ({ trigger, onComplete }: FlashOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    setIsVisible(true);
    playShutterSound();
    triggerHaptic('heavy');

    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, CONSTANTS.FLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [trigger, onComplete]);

  if (!isVisible) return null;

  return (
    // ONLY full white screen flash - no burst effects
    <div
      className="fixed inset-0 bg-white pointer-events-none z-50"
      aria-hidden="true"
    />
  );
};

