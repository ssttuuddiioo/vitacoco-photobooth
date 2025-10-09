// Countdown screen - 3-2-1 display before photo capture
import { useEffect, useState } from 'react';
import { useCountdown } from '@/hooks/use-countdown';
import { useCamera } from '@/hooks/use-camera';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { playBeepSound, triggerHaptic } from '@/lib/animation-utils';
import { loadAppSettings } from '@/lib/app-settings';
import { CONSTANTS, COUNTDOWN_MESSAGES } from '@/lib/constants';

interface CountdownScreenProps {
  onComplete: () => void;
}

export const CountdownScreen = ({ onComplete }: CountdownScreenProps) => {
  // Initialize camera here so it's ready for capture screen
  const { videoRef, error: cameraError, isLoading } = useCamera();
  const [appSettings] = useState(() => loadAppSettings());

  const { count } = useCountdown({
    seconds: CONSTANTS.COUNTDOWN_SECONDS,
    onComplete,
    autoStart: true,
  });

  // Play sound and haptic on each count
  useEffect(() => {
    if (count > 0) {
      playBeepSound();
      triggerHaptic('medium');
    }
  }, [count]);

  const message = COUNTDOWN_MESSAGES[count % COUNTDOWN_MESSAGES.length] || 'Get Ready!';

  // Show error if camera fails
  if (cameraError && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white p-8" style={{ backgroundColor: appSettings.countdownBackgroundColor }}>
        <div className="text-center space-y-8 animate-fade-in">
          <div className="text-9xl mb-4">📷</div>
          <h2 className="text-5xl font-bold mb-4">Camera Error</h2>
          <p className="text-2xl mb-8 max-w-2xl">{cameraError}</p>
          <p className="text-xl text-white/80">Please check camera permissions and refresh</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden relative" style={{ backgroundColor: appSettings.countdownBackgroundColor }}>
      {/* Hidden video element for camera warmup */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
      />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center space-y-12 z-10">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 animate-fade-in drop-shadow-lg">
          {message}
        </h2>

        <div className="relative">
          <CountdownTimer count={count} size="large" />
          
          {/* Pulsing ring around countdown */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-8 border-white/30 rounded-full animate-ping" />
          </div>
        </div>

        <p className="text-3xl text-white/90 animate-fade-in font-medium">
          Photos starting in...
        </p>

        <div className="text-6xl animate-bounce">
          📸
        </div>
      </div>
    </div>
  );
};

