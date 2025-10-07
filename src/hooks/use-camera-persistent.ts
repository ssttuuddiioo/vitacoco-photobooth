// Persistent camera hook with retry logic for permanent installations
import { useEffect, useRef, useState } from 'react';
import { CAMERA_CONSTRAINTS } from '@/lib/constants';
import { cleanupMediaStream } from '@/lib/memory-utils';
import type { CameraStream } from '@/types';

interface UseCameraPersistentOptions {
  enabled: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

interface UseCameraPersistentReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraStream: CameraStream | null;
  error: string | null;
  isLoading: boolean;
  retry: () => void;
}

export const useCameraPersistent = ({
  enabled,
  maxRetries = 3,
  retryDelay = 2000,
}: UseCameraPersistentOptions): UseCameraPersistentReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<CameraStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);

  const retry = () => {
    setRetryCount(0);
    setError(null);
  };

  useEffect(() => {
    if (!enabled) {
      // Cleanup stream when disabled
      if (streamRef.current) {
        cleanupMediaStream(streamRef.current);
        streamRef.current = null;
        setCameraStream(null);
      }
      return;
    }

    let mounted = true;

    const initCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Request camera permission with retry logic
        const stream = await navigator.mediaDevices.getUserMedia(
          CAMERA_CONSTRAINTS
        );

        if (!mounted) {
          cleanupMediaStream(stream);
          return;
        }

        const videoTrack = stream.getVideoTracks()[0];
        if (!videoTrack) {
          throw new Error('No video track found');
        }

        // Store stream reference
        streamRef.current = stream;

        // Set video element source
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video to be ready
          await new Promise((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = () => resolve(true);
            }
          });
        }

        setCameraStream({
          stream,
          videoTrack,
          deviceId: videoTrack.getSettings().deviceId,
        });

        setIsLoading(false);
        setRetryCount(0);
      } catch (err) {
        if (!mounted) return;

        console.error('Camera initialization error:', err);

        // Retry logic for permanent installations
        if (retryCount < maxRetries) {
          setError(
            `Initializing camera... (attempt ${retryCount + 1}/${maxRetries})`
          );
          
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, retryDelay);
        } else {
          // Final error after all retries
          if (err instanceof Error) {
            if (err.name === 'NotAllowedError') {
              setError(
                'Camera permission denied. Please allow camera access in browser settings and refresh.'
              );
            } else if (err.name === 'NotFoundError') {
              setError(
                'No camera found. Please connect a camera and refresh.'
              );
            } else if (err.name === 'NotReadableError') {
              setError(
                'Camera is in use by another application. Please close other apps using the camera.'
              );
            } else {
              setError(`Camera error: ${err.message}`);
            }
          } else {
            setError('Failed to access camera. Please refresh and try again.');
          }
          setIsLoading(false);
        }
      }
    };

    void initCamera();

    // Cleanup
    return () => {
      mounted = false;
    };
  }, [enabled, retryCount, maxRetries, retryDelay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        cleanupMediaStream(streamRef.current);
        streamRef.current = null;
      }
    };
  }, []);

  return { videoRef, cameraStream, error, isLoading, retry };
};

