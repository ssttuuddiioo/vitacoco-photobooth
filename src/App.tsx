// Main App component with state machine for photo booth flow
import { useEffect, useState } from 'react';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { useWakeLock } from '@/hooks/use-wake-lock';
import { useIdleReset } from '@/hooks/use-idle-reset';
import { ErrorBoundary } from '@/components/error-boundary';
import { AdminScreen } from '@/components/screens/admin-screen';
import { WelcomeScreen } from '@/components/screens/welcome-screen';
import { CaptureCountdownScreen } from '@/components/screens/capture-countdown-screen';
import { ProcessingScreen } from '@/components/screens/processing-screen';
import { GeneratingScreen } from '@/components/screens/generating-screen';
import { ReviewScreen } from '@/components/screens/review-screen';
import { ThankYouScreen } from '@/components/screens/thank-you-screen';
import { generatePhotoStrip } from '@/lib/photo-utils';
import { revokePhotoUrls, forceGarbageCollection } from '@/lib/memory-utils';
import type { Screen, Photo, PhotoStrip } from '@/types';

export const App = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoStrip, setPhotoStrip] = useState<PhotoStrip | null>(null);
  const [didPrint, setDidPrint] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);

  useWakeLock();

  // Request fullscreen on mount (DISABLED FOR TESTING)
  // useEffect(() => {
  //   void requestFullscreen();
  // }, [requestFullscreen]);

  // Kiosk hardening: disable context menu, F11, F12, etc.
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      // Prevent F11, F12, Ctrl+Shift+I, etc.
      if (
        e.key === 'F11' ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventKeyboardShortcuts);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
    };
  }, []);

  // Session reset handler
  const resetSession = () => {
    // Cleanup photos
    if (photos.length > 0) {
      revokePhotoUrls(photos);
    }

    // Reset state
    setPhotos([]);
    setPhotoStrip(null);
    setDidPrint(false);
    setIsCameraActive(false); // Stop camera on reset
    setHasProcessed(false); // Reset processing flag
    setScreen('welcome');

    // Request garbage collection
    forceGarbageCollection();
  };

  // Idle timeout
  useIdleReset({
    onReset: resetSession,
    currentScreen: screen,
    enabled: true,
  });

  // Screen navigation handlers
  const startSession = () => {
    // Initialize camera when session starts (already active from welcome)
    setIsCameraActive(true);
    setScreen('capture'); // Go directly to capture (countdown is integrated)
  };

  const handlePhotosComplete = async (capturedPhotos: Photo[]) => {
    setPhotos(capturedPhotos);
    
    // Show processing screen for 2 seconds (only if not already processed)
    if (!hasProcessed) {
      setIsProcessing(true);
      setHasProcessed(true); // Mark as processed immediately
    }
  };

  const handleProcessingComplete = async () => {
    // Guard against multiple calls
    if (!isProcessing) return;
    
    setIsProcessing(false);
    setIsGenerating(true);

    // Generate photo strip (async - waits for images to load)
    try {
      const stripUrl = await generatePhotoStrip(photos);
      const strip: PhotoStrip = {
        photos,
        stripUrl,
        createdAt: new Date(),
      };
      
      // Set both strip and screen in same render cycle for instant swap
      setPhotoStrip(strip);
      setScreen('review');
      
      // Wait for next frame to ensure review screen is painted
      await new Promise(resolve => requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      }));
      
      // Hide generating screen after review is visible
      setIsGenerating(false);
    } catch (err) {
      console.error('Failed to generate photo strip:', err);
      setIsGenerating(false);
      // Fallback: allow retry
      resetSession();
    }
  };

  const handlePrint = () => {
    setDidPrint(true);
    setScreen('thanks');
  };

  const handleRedo = () => {
    resetSession();
  };

  const handleThankYouComplete = () => {
    resetSession();
  };

  // Render current screen with smooth transitions
  return (
    <ErrorBoundary>
      <div className="min-h-screen relative overflow-hidden">
        {isAdminMode ? (
          <div className="animate-fade-in">
            <AdminScreen onExit={() => setIsAdminMode(false)} />
          </div>
        ) : (
          <>
            {/* All screens render on same page with smooth transitions */}
            <div
              className={`absolute inset-0 ${
                screen === 'welcome' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
              style={{ transition: 'opacity 300ms ease-out' }}
            >
              <WelcomeScreen 
                onStart={startSession}
                onAdminAccess={() => setIsAdminMode(true)}
              />
            </div>

            <div
              className={`absolute inset-0 ${
                screen === 'capture' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
              style={{ transition: 'opacity 300ms ease-out' }}
            >
              {screen === 'capture' && (
                <CaptureCountdownScreen 
                  onPhotosComplete={handlePhotosComplete}
                />
              )}
            </div>

            {/* Processing Screen - Shows for 2 seconds after capture */}
            <div
              className={`absolute inset-0 ${
                isProcessing ? 'opacity-100 z-30' : 'opacity-0 pointer-events-none -z-10'
              }`}
              style={{ transition: 'opacity 200ms ease-out' }}
            >
              {isProcessing && <ProcessingScreen onComplete={handleProcessingComplete} />}
            </div>

            {/* Review Screen - Higher z-index to cover generating screen */}
            <div
              className={`absolute inset-0 ${
                screen === 'review' ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none z-0'
              }`}
              style={{ transition: 'opacity 200ms ease-out' }}
            >
              {screen === 'review' && photoStrip && (
                <ReviewScreen
                  photoStrip={photoStrip}
                  onPrint={handlePrint}
                  onRedo={handleRedo}
                />
              )}
            </div>

            {/* Generating Screen - Shows while photo strip is being created */}
            <div
              className={`absolute inset-0 ${
                isGenerating ? 'opacity-100 z-30' : 'opacity-0 pointer-events-none -z-10'
              }`}
              style={{ transition: 'opacity 150ms ease-out' }}
            >
              {isGenerating && <GeneratingScreen />}
            </div>

            <div
              className={`absolute inset-0 ${
                screen === 'thanks' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
              style={{ transition: 'opacity 300ms ease-out' }}
            >
              {screen === 'thanks' && (
                <ThankYouScreen
                  onComplete={handleThankYouComplete}
                  didPrint={didPrint}
                />
              )}
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

