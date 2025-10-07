// Welcome screen - Vita Coco branded CTA with live camera feed
import { useState } from 'react';
import { useCamera } from '@/hooks/use-camera';
import { loadCameraSettings, getCameraSettingsStyle } from '@/lib/camera-settings';

interface WelcomeScreenProps {
  onStart: () => void;
  onAdminAccess?: () => void;
}

export const WelcomeScreen = ({ onStart, onAdminAccess }: WelcomeScreenProps) => {
  // Initialize camera on welcome screen so it persists throughout experience
  const { videoRef, cameraStream, error, isLoading } = useCamera();
  
  // Load saved camera settings
  const [cameraSettings] = useState(() => loadCameraSettings());
  const cameraStyle = getCameraSettingsStyle(cameraSettings);

  // Secret admin access - tap logo 10 times quickly
  let tapCount = 0;
  let tapTimeout: NodeJS.Timeout;

  const handleLogoTap = () => {
    clearTimeout(tapTimeout);
    tapCount++;
    
    if (tapCount >= 10 && onAdminAccess) {
      tapCount = 0;
      onAdminAccess();
      return;
    }

    tapTimeout = setTimeout(() => {
      tapCount = 0;
    }, 2000);
  };

  return (
    <div 
      className="relative min-h-screen overflow-hidden transition-all duration-500 animate-fade-in"
      style={{ backgroundColor: '#388046' }} // Vita Coco green
    >
      {/* Main Content - Horizontal Layout: Logo | Camera | Palms */}
      <div className="absolute inset-0 flex items-center justify-center w-full px-8">
        {/* Logo - Left (centered between left edge and camera) */}
        <div className="flex-1 flex items-center justify-center animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
          <div 
            className="w-64 cursor-pointer"
            onClick={handleLogoTap}
          >
            <img 
              src="/logo/logo.png" 
              alt="Vita Coco" 
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Camera Feed - Center */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 animate-slide-up"
          style={{
            backgroundColor: '#E74C3C',
            width: '800px',
            height: '600px',
            animationDelay: '0.2s',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover transition-all duration-200"
            style={cameraStyle}
          />

          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto" />
                <p className="text-2xl font-bold">Initializing Camera...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white space-y-4 p-8">
                <div className="text-6xl">📷</div>
                <p className="text-2xl font-bold">Camera Error</p>
                <p className="text-lg">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Palms Image - Right (centered between camera and right edge) */}
        <div className="flex-1 flex items-center justify-center animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
          <img
            src="/logo/palms.png"
            alt="Palms"
            className="max-w-xs h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Touch to Start Button - Bottom (same position as progress dots) */}
      <div 
        className="absolute left-0 right-0 flex justify-center z-10 animate-slide-up" 
        style={{ 
          bottom: 'calc((100vh - 600px) / 4)',
          animationDelay: '0.4s' 
        }}
      >
        <button
          onClick={onStart}
          disabled={!cameraStream || isLoading}
          className="px-24 py-8 text-4xl md:text-5xl font-bold rounded-2xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          style={{
            backgroundColor: '#388046', // Vita Coco green
            color: '#FFFFFF', // White text for contrast
            border: '2px solid #F8F3EC' // Cream border
          }}
        >
          Touch to Start
        </button>
      </div>
    </div>
  );
};

