// Thank you screen - final screen with auto-reset countdown
import { useEffect, useState } from 'react';
import { CONSTANTS } from '@/lib/constants';
import { playSuccessSound } from '@/lib/animation-utils';

interface ThankYouScreenProps {
  onComplete: () => void;
  didPrint?: boolean;
}

export const ThankYouScreen = ({
  onComplete,
  didPrint = false,
}: ThankYouScreenProps) => {
  const [countdown, setCountdown] = useState(
    CONSTANTS.THANK_YOU_DURATION_MS / 1000
  );

  // Play success sound on mount
  useEffect(() => {
    playSuccessSound();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div 
      className="flex flex-col items-center justify-between h-screen transition-all duration-500 overflow-hidden py-16 animate-fade-in"
      style={{ backgroundColor: '#388046' }}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-12 animate-slide-up">
          <h1 className="text-9xl font-bold text-white drop-shadow-2xl">
            Thank You!
          </h1>

          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-5xl font-bold text-white">Your pictures are now printing</p>
          </div>
        </div>
      </div>

      {/* Small timer at bottom */}
      <div className="text-center pb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <p className="text-white/70 text-2xl">
          Restarting in {countdown} seconds
        </p>
      </div>
    </div>
  );
};

