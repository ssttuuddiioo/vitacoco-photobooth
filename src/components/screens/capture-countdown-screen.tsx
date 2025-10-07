// Combined countdown and capture screen - Vita Coco style
import { useEffect, useState, useRef } from 'react';
import { useCamera } from '@/hooks/use-camera';
import { usePhotoCapture } from '@/hooks/use-photo-capture';
import { FlashOverlay } from '@/components/ui/flash-overlay';
import { CONSTANTS } from '@/lib/constants';
import { loadCameraSettings, getCameraSettingsStyle } from '@/lib/camera-settings';
import type { Photo } from '@/types';
import palmsImg from '/logo/palms.png';

interface CaptureCountdownScreenProps {
  onPhotosComplete: (photos: Photo[]) => void;
}

export const CaptureCountdownScreen = ({
  onPhotosComplete,
}: CaptureCountdownScreenProps) => {
  // Load saved camera settings
  const [cameraSettings] = useState(() => loadCameraSettings());
  const cameraStyle = getCameraSettingsStyle(cameraSettings);
  
  const { videoRef, cameraStream, error, isLoading } = useCamera({
    deviceId: cameraSettings.deviceId
  });
  const { capturePhoto } = usePhotoCapture();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [countdown, setCountdown] = useState<number>(CONSTANTS.COUNTDOWN_SECONDS);
  const [showFlash, setShowFlash] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showGetReady, setShowGetReady] = useState(true); // Show "Get Ready!" initially
  
  // Use ref for isCapturing to avoid triggering effect re-runs
  const isCapturingRef = useRef(false);

  // DEBUG: Log all state changes
  console.log('🔍 CAPTURE STATE:', {
    currentPhotoIndex,
    countdown,
    isCapturing: isCapturingRef.current,
    showGetReady,
    photosCaptured: photos.length,
    hasCamera: !!cameraStream,
  });

  // Hide "Get Ready!" after 1 second and start countdown
  useEffect(() => {
    if (showGetReady) {
      console.log('⏱️ Get Ready showing for 1 second...');
      const timer = setTimeout(() => {
        console.log('✅ Get Ready finished, starting countdown');
        setShowGetReady(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showGetReady]);

  // Main synchronized photo capture sequence
  useEffect(() => {
    console.log('🔄 Main useEffect triggered', { countdown, currentPhotoIndex, isCapturing: isCapturingRef.current, showGetReady });
    
    if (!videoRef.current || !cameraStream) {
      console.log('⚠️ No video or camera stream');
      return undefined;
    }
    if (currentPhotoIndex >= CONSTANTS.PHOTO_COUNT) {
      console.log('✅ All photos captured, stopping sequence');
      return undefined;
    }
    if (isCapturingRef.current) {
      console.log('⏸️ Currently capturing, waiting...');
      return undefined;
    }
    if (showGetReady) {
      console.log('⏸️ Get Ready showing, waiting...');
      return undefined;
    }

    // Countdown phase
    if (countdown > 0) {
      console.log(`⏱️ Countdown: ${countdown}`);
      const timer = setTimeout(() => {
        console.log(`⏱️ Countdown tick: ${countdown} → ${countdown - 1}`);
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Countdown hit 0 - START THE FLASH AND CAPTURE SEQUENCE
    if (countdown === 0) {
      console.log(`📸 === STARTING CAPTURE SEQUENCE FOR PHOTO ${currentPhotoIndex + 1} ===`);
      isCapturingRef.current = true;
      console.log(`🔒 isCapturing locked = true`);
      
      // STEP 1: Turn on flash immediately
      setShowFlash(true);
      console.log(`✨ FLASH ON for photo ${currentPhotoIndex + 1}`);

      // STEP 2: Capture photo at peak of flash
      const captureTimer = setTimeout(() => {
        console.log(`📷 CAPTURING photo ${currentPhotoIndex + 1}`);
        const photo = capturePhoto(videoRef.current!, currentPhotoIndex);
        if (photo) {
          console.log(`✅ Photo ${currentPhotoIndex + 1} captured successfully`);
          setPhotos(prev => {
            const newPhotos = [...prev, photo];
            console.log(`📦 Photos array now has ${newPhotos.length} items`);
            return newPhotos;
          });
        } else {
          console.error(`❌ Photo ${currentPhotoIndex + 1} capture FAILED!`);
        }
      }, Math.floor(CONSTANTS.FLASH_DURATION_MS / 2));

      // STEP 3: Turn off flash after full duration
      const flashOffTimer = setTimeout(() => {
        console.log(`💫 FLASH OFF for photo ${currentPhotoIndex + 1}`);
        setShowFlash(false);
      }, CONSTANTS.FLASH_DURATION_MS);

      // STEP 4: Move to next photo after flash is complete
      const nextPhotoTimer = setTimeout(() => {
        console.log(`➡️ Moving from photo ${currentPhotoIndex + 1} to ${currentPhotoIndex + 2}`);
        isCapturingRef.current = false;
        console.log(`🔓 isCapturing unlocked = false`);
        setCurrentPhotoIndex(prev => {
          const next = prev + 1;
          console.log(`📍 Photo index: ${prev} → ${next}`);
          return next;
        });
        setCountdown(CONSTANTS.COUNTDOWN_SECONDS);
        console.log(`🔄 Countdown reset to ${CONSTANTS.COUNTDOWN_SECONDS}`);
        console.log(`📸 === CAPTURE SEQUENCE ${currentPhotoIndex + 1} COMPLETE ===\n`);
      }, CONSTANTS.FLASH_DURATION_MS + 300);

      return () => {
        console.log(`🧹 Cleaning up timers for photo ${currentPhotoIndex + 1}`);
        clearTimeout(captureTimer);
        clearTimeout(flashOffTimer);
        clearTimeout(nextPhotoTimer);
      };
    }

    return undefined;
  }, [countdown, currentPhotoIndex, videoRef, cameraStream, showGetReady]); // Using isCapturingRef instead of state!

  // Navigate to review when all photos captured
  useEffect(() => {
    console.log('🎬 Completion check:', { currentPhotoIndex, photoCount: photos.length, target: CONSTANTS.PHOTO_COUNT });
    if (currentPhotoIndex === CONSTANTS.PHOTO_COUNT && photos.length === CONSTANTS.PHOTO_COUNT) {
      console.log('🎉 ALL PHOTOS CAPTURED! Moving to review in 500ms...');
      setTimeout(() => {
        console.log('🎉 Calling onPhotosComplete with', photos.length, 'photos');
        onPhotosComplete(photos);
      }, 500);
    }
  }, [currentPhotoIndex, photos, onPhotosComplete]);

  // Handle errors
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-8"
        style={{ backgroundColor: '#388046' }}
      >
        <div className="text-center space-y-4 text-white">
          <div className="text-9xl font-bold">X</div>
          <h2 className="text-3xl font-bold">Camera Error</h2>
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden transition-all duration-500 animate-fade-in"
      style={{ backgroundColor: '#388046' }} // Vita Coco green background
    >
      {/* Progress Dots - Bottom (centered between camera bottom and screen bottom) */}
      {currentPhotoIndex < CONSTANTS.PHOTO_COUNT && (
        <div 
          className="absolute left-0 right-0 flex justify-center z-20"
          style={{ bottom: 'calc((100vh - 600px) / 4)' }}
        >
          {/* Progress dots - shows how many photos are already captured */}
          <div className="flex gap-6">
            {Array.from({ length: CONSTANTS.PHOTO_COUNT }).map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full transition-all duration-300 ${
                  index < currentPhotoIndex
                    ? 'bg-white scale-125 shadow-lg'
                    : 'bg-white/40 border-2 border-white'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content - Horizontal Layout: Countdown | Camera | Palms */}
      <div className="absolute inset-0 flex items-center justify-center w-full px-8">
        {/* Countdown / Get Ready - Left (centered between left edge and camera) */}
        <div className="flex-1 flex items-center justify-center">
          {showGetReady && currentPhotoIndex < CONSTANTS.PHOTO_COUNT && (
            <div className="animate-scale-in">
              <div className="text-7xl font-bold text-white drop-shadow-2xl">
                Get Ready!
              </div>
            </div>
          )}
          {!showGetReady && countdown > 0 && currentPhotoIndex < CONSTANTS.PHOTO_COUNT && (
            <div className="animate-scale-in" key={countdown}>
              <div className="text-[15rem] font-bold text-white drop-shadow-2xl leading-none">
                {countdown}
              </div>
            </div>
          )}
        </div>

        {/* Camera Feed - Center */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
          style={{
            backgroundColor: '#E74C3C',
            width: '800px',
            height: '600px',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover transition-all duration-200"
            style={{ ...cameraStyle, transform: `${cameraStyle.transform || ''} scaleX(-1)`.trim() }}
          />

          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto" />
                <p className="text-2xl font-bold">Camera Ready...</p>
              </div>
            </div>
          )}
        </div>

        {/* Palms Image - Right (centered between camera and right edge) */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={palmsImg}
            alt="Palms"
            className="max-w-xs h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Flash overlay */}
      <FlashOverlay trigger={showFlash} />
    </div>
  );
};

