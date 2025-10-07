// Camera hook for accessing user media with auto-retry for reliability
import { useEffect, useRef, useState } from 'react';
import { CAMERA_CONSTRAINTS } from '@/lib/constants';
import { cleanupMediaStream } from '@/lib/memory-utils';
import type { CameraStream } from '@/types';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraStream: CameraStream | null;
  error: string | null;
  isLoading: boolean;
  retry: () => void;
}

interface UseCameraOptions {
  deviceId?: string;
}

export const useCamera = (options?: UseCameraOptions): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<CameraStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    let mounted = true;
    let stream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🎥 Initializing camera... (attempt', retryCount + 1, 'of', maxRetries + 1, ')');
        
        // Build constraints with optional deviceId
        const constraints = options?.deviceId
          ? {
              video: {
                ...CAMERA_CONSTRAINTS.video,
                deviceId: { exact: options.deviceId }
              },
              audio: false
            }
          : CAMERA_CONSTRAINTS;
        
        console.log('Camera constraints:', constraints);

        // Request camera permission
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        console.log('✅ Camera stream obtained:', stream.id);

        if (!mounted) {
          cleanupMediaStream(stream);
          return;
        }

        const videoTrack = stream.getVideoTracks()[0];
        if (!videoTrack) {
          throw new Error('No video track found');
        }

        // Set video element source
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video metadata to load
          await new Promise<void>((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = () => {
                void videoRef.current?.play();
                resolve();
              };
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

        // Auto-retry for permanent installations
        if (retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 2000);
          return;
        }

        // Final error after retries
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError(
              'Camera permission denied. Please allow camera access in browser settings.'
            );
          } else if (err.name === 'NotFoundError') {
            setError('No camera found. Please connect a camera.');
          } else if (err.name === 'NotReadableError') {
            setError(
              'Camera is in use by another application. Please close other apps using the camera.'
            );
          } else {
            setError(`Camera error: ${err.message}`);
          }
        } else {
          setError('Failed to access camera');
        }
        setIsLoading(false);
      }
    };

    void initCamera();

    // Cleanup
    return () => {
      mounted = false;
      if (stream) {
        cleanupMediaStream(stream);
      }
    };
  }, [retryCount, options?.deviceId]);

  const retry = () => {
    setRetryCount(0);
    setError(null);
    setIsLoading(true);
  };

  return { videoRef, cameraStream, error, isLoading, retry };
};

