// Processing screen with animated progress bar
import { useEffect, useState, useRef } from 'react';

interface ProcessingScreenProps {
  onComplete: () => void;
}

export const ProcessingScreen = ({ onComplete }: ProcessingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const hasCompleted = useRef(false);

  useEffect(() => {
    // Prevent multiple runs
    if (hasCompleted.current) return;
    
    // Animate progress bar over 2 seconds
    const duration = 2000;
    const interval = 20; // Update every 20ms for smooth animation
    const increment = (100 / duration) * interval;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          if (!hasCompleted.current) {
            hasCompleted.current = true;
            setTimeout(onComplete, 100); // Small delay after reaching 100%
          }
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return (
    <div
      className="relative h-screen overflow-hidden transition-all duration-500 animate-fade-in"
      style={{ backgroundColor: '#388046' }}
    >
      <div className="absolute inset-0 flex items-center justify-center w-full px-8">
        {/* Left spacer */}
        <div className="flex-1" />

        {/* Processing Animation - Center (takes place of camera view) */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 animate-slide-up"
          style={{
            backgroundColor: '#E74C3C',
            width: '800px',
            height: '600px',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/60 to-black/80">
            <div className="text-center space-y-8 animate-fade-in max-w-md px-8">
              {/* Message */}
              <h2 className="text-5xl font-bold text-white">Processing photos...</h2>
              <p className="text-2xl text-white/80">please wait just a sec</p>

              {/* Progress bar container */}
              <div className="w-full mt-12">
                <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right spacer */}
        <div className="flex-1" />
      </div>
    </div>
  );
};

