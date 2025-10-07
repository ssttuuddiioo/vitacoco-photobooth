// Animation utilities for smooth transitions and effects

/**
 * Trigger a haptic feedback (if supported)
 */
export const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'medium'): void => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 50,
      heavy: 100,
    };
    navigator.vibrate(patterns[intensity]);
  }
};

/**
 * Play a shutter sound (placeholder for future sound implementation)
 */
export const playShutterSound = (): void => {
  // Placeholder for sound effect
  // Future: new Audio('/sounds/shutter.mp3').play()
  console.log('📸 Shutter sound');
};

/**
 * Play a beep sound for countdown
 */
export const playBeepSound = (): void => {
  // Placeholder for sound effect
  // Future: new Audio('/sounds/beep.mp3').play()
  console.log('🔔 Beep sound');
};

/**
 * Play a success sound
 */
export const playSuccessSound = (): void => {
  // Placeholder for sound effect
  // Future: new Audio('/sounds/success.mp3').play()
  console.log('✨ Success sound');
};

/**
 * Request animation frame wrapper for smooth animations
 */
export const smoothTransition = (
  callback: (progress: number) => void,
  duration: number
): void => {
  const start = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    callback(progress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

