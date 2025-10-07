// Countdown timer hook
import { useEffect, useState } from 'react';

interface UseCountdownOptions {
  seconds: number;
  onComplete: () => void;
  autoStart?: boolean;
}

interface UseCountdownReturn {
  count: number;
  isActive: boolean;
  start: () => void;
  reset: () => void;
}

export const useCountdown = ({
  seconds,
  onComplete,
  autoStart = false,
}: UseCountdownOptions): UseCountdownReturn => {
  const [count, setCount] = useState(seconds);
  const [isActive, setIsActive] = useState(autoStart);

  useEffect(() => {
    if (!isActive) return;

    if (count <= 0) {
      setIsActive(false);
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, isActive, onComplete]);

  const start = () => {
    setCount(seconds);
    setIsActive(true);
  };

  const reset = () => {
    setCount(seconds);
    setIsActive(false);
  };

  return { count, isActive, start, reset };
};

