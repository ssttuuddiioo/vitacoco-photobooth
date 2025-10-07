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
    <>
      {/* Main flash - Clean white flash */}
      <div
        className="fixed inset-0 bg-white pointer-events-none z-50 animate-flash"
        aria-hidden="true"
      />
      
      {/* Flash burst effect */}
      <div
        className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-32 h-32 bg-white/80 rounded-full blur-3xl animate-ping" />
      </div>
    </>
  );
};

