// Memory management utilities for cleanup between sessions
import type { Photo } from '@/types';

/**
 * Revoke object URLs from photos to free memory
 */
export const revokePhotoUrls = (photos: Photo[]): void => {
  photos.forEach(photo => {
    if (photo.dataUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photo.dataUrl);
    }
  });
};

/**
 * Clean up media stream and stop all tracks
 */
export const cleanupMediaStream = (stream: MediaStream): void => {
  stream.getTracks().forEach(track => {
    track.stop();
  });
};

/**
 * Clean up canvas element
 */
export const cleanupCanvas = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  // Reset canvas dimensions to free memory
  canvas.width = 0;
  canvas.height = 0;
};

/**
 * Request garbage collection via idle callback
 */
export const forceGarbageCollection = (): void => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        // Browser will perform GC when idle
      },
      { timeout: 2000 }
    );
  }
};

