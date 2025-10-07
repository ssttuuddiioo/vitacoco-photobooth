// Fullscreen hook for kiosk mode
import { useEffect, useState } from 'react';

interface UseFullscreenReturn {
  isFullscreen: boolean;
  requestFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
}

export const useFullscreen = (): UseFullscreenReturn => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const requestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Failed to exit fullscreen:', err);
    }
  };

  return { isFullscreen, requestFullscreen, exitFullscreen };
};

