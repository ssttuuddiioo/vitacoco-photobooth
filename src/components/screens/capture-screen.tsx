// Capture screen - live camera preview and photo capture
import { useEffect, useState } from 'react';
import { useCamera } from '@/hooks/use-camera';
import { usePhotoCapture } from '@/hooks/use-photo-capture';
import { FlashOverlay } from '@/components/ui/flash-overlay';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { loadAppSettings } from '@/lib/app-settings';
import { CONSTANTS, PHOTO_PROMPTS } from '@/lib/constants';
import type { Photo } from '@/types';

interface CaptureScreenProps {
  onPhotosComplete: (photos: Photo[]) => void;
}

export const CaptureScreen = ({ onPhotosComplete }: CaptureScreenProps) => {
  const { videoRef, cameraStream, error: cameraError, isLoading } = useCamera();
  const { capturePhoto, error: captureError } = usePhotoCapture();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [countdown, setCountdown] = useState(CONSTANTS.PHOTO_INTERVAL_MS / 1000);
  const [showFlash, setShowFlash] = useState(false);
  const [appSettings] = useState(() => loadAppSettings());

  // Countdown timer for next photo
  useEffect(() => {
    if (photos.length >= CONSTANTS.PHOTO_COUNT) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return CONSTANTS.PHOTO_INTERVAL_MS / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [photos.length]);

  // Auto-capture photos
  useEffect(() => {
    if (!videoRef.current || !cameraStream || photos.length >= CONSTANTS.PHOTO_COUNT) {
      return;
    }

    const timer = setTimeout(() => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setShowFlash(true);

        // Capture immediately on next frame for instant feedback
        requestAnimationFrame(() => {
          const photo = capturePhoto(videoRef.current!, photos.length);
          if (photo) {
            setPhotos(prev => [...prev, photo]);
          }
          
          // Clear flash after FLASH_DURATION_MS
          setTimeout(() => {
            setShowFlash(false);
          }, CONSTANTS.FLASH_DURATION_MS);
        });
      });
    }, CONSTANTS.PHOTO_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [photos, cameraStream, videoRef, capturePhoto]);

  // Navigate to review when all photos captured
  useEffect(() => {
    if (photos.length === CONSTANTS.PHOTO_COUNT) {
      setTimeout(() => {
        onPhotosComplete(photos);
      }, 500);
    }
  }, [photos, onPhotosComplete]);

  // Handle errors
  if (cameraError || captureError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-red-500">Error</h2>
          <p className="text-xl">{cameraError || captureError}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto" />
          <p className="text-2xl">Initializing camera...</p>
        </div>
      </div>
    );
  }

  // Randomize prompt for variety
  const currentPrompt = photos.length === 0
    ? PHOTO_PROMPTS[0]
    : PHOTO_PROMPTS[photos.length % PHOTO_PROMPTS.length];

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center" style={{ backgroundColor: appSettings.captureBackgroundColor }}>
      {/* Video preview - centered and contained */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-contain"
        style={{ maxWidth: '100vw', maxHeight: '100vh' }}
      />

      {/* Overlay UI */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen p-8 text-white">
        {/* Top: Photo counter with animation */}
        <div className="bg-black/60 px-8 py-4 rounded-full backdrop-blur-md border-2 border-white/20 shadow-2xl animate-slide-up">
          <p className="text-3xl font-bold">
            Photo {photos.length + 1} of {CONSTANTS.PHOTO_COUNT}
          </p>
        </div>

        {/* Center: Prompt with enhanced styling */}
        <div className="text-center space-y-8">
          <h2 
            className="text-7xl md:text-8xl font-bold animate-scale-in drop-shadow-2xl px-8 py-4 bg-black/30 rounded-3xl backdrop-blur-sm" 
            key={currentPrompt}
          >
            {currentPrompt}
          </h2>
          
          <div className="bg-black/40 rounded-full px-12 py-6 backdrop-blur-sm">
            <CountdownTimer count={countdown} size="large" />
          </div>
        </div>

        {/* Bottom: Enhanced progress dots */}
        <div className="space-y-4">
          <div className="flex gap-4">
            {Array.from({ length: CONSTANTS.PHOTO_COUNT }).map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full transition-all duration-300 ${
                  index < photos.length
                    ? 'bg-green-400 scale-125 shadow-lg shadow-green-400/50 animate-bounce'
                    : 'bg-white/40 backdrop-blur-sm border-2 border-white/60'
                }`}
              />
            ))}
          </div>
          
          {photos.length > 0 && (
            <p className="text-center text-xl text-white/80 animate-fade-in">
              {CONSTANTS.PHOTO_COUNT - photos.length} more to go!
            </p>
          )}
        </div>
      </div>

      {/* Flash overlay */}
      <FlashOverlay trigger={showFlash} />
    </div>
  );
};

