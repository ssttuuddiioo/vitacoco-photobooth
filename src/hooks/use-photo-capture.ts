// Photo capture hook
import { useCallback, useRef, useState } from 'react';
import { captureFrame } from '@/lib/photo-utils';
import { loadCameraSettings } from '@/lib/camera-settings';
import type { Photo } from '@/types';

interface UsePhotoCaptureReturn {
  capturePhoto: (videoElement: HTMLVideoElement, index: number) => Photo | null;
  isCapturing: boolean;
  error: string | null;
}

export const usePhotoCapture = (): UsePhotoCaptureReturn => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isCapturingRef = useRef(false);

  const capturePhoto = useCallback(
    (videoElement: HTMLVideoElement, index: number): Photo | null => {
      // Guard: Check if already capturing (use ref for stable check)
      if (isCapturingRef.current) {
        return null;
      }

      // Guard: Validate video element
      if (!videoElement || videoElement.readyState !== 4) {
        setError('Video not ready for capture');
        return null;
      }

      try {
        isCapturingRef.current = true;
        setIsCapturing(true);
        setError(null);

        // Load camera settings and apply them during capture
        const cameraSettings = loadCameraSettings();
        const dataUrl = captureFrame(videoElement, cameraSettings);

        const photo: Photo = {
          dataUrl,
          timestamp: Date.now(),
          index,
        };

        return photo;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to capture photo';
        setError(errorMessage);
        return null;
      } finally {
        isCapturingRef.current = false;
        setIsCapturing(false);
      }
    },
    [] // Empty deps - function is now stable!
  );

  return { capturePhoto, isCapturing, error };
};

