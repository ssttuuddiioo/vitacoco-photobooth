// Wake lock hook to prevent screen from sleeping
import { useEffect, useState } from 'react';

interface UseWakeLockReturn {
  isSupported: boolean;
  isActive: boolean;
}

export const useWakeLock = (): UseWakeLockReturn => {
  const [isSupported] = useState(() => 'wakeLock' in navigator);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    let wakeLock: WakeLockSentinel | null = null;

    const requestWakeLock = async () => {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        setIsActive(true);

        wakeLock.addEventListener('release', () => {
          setIsActive(false);
        });
      } catch (err) {
        console.error('Failed to acquire wake lock:', err);
      }
    };

    // Request wake lock on mount
    void requestWakeLock();

    // Re-request wake lock when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !wakeLock) {
        void requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) {
        void wakeLock.release();
      }
    };
  }, [isSupported]);

  return { isSupported, isActive };
};

