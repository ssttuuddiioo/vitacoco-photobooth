// Review screen - display photo strip and print/redo options
import { useState } from 'react';
import { PhotoStrip } from '@/components/photo-strip';
import { printPhotoStrip } from '@/lib/print-utils';
import { playSuccessSound, triggerHaptic } from '@/lib/animation-utils';
import { loadAppSettings } from '@/lib/app-settings';
import type { PhotoStrip as PhotoStripType } from '@/types';
import palmsImg from '/logo/palms.png';

interface ReviewScreenProps {
  photoStrip: PhotoStripType;
  onPrint: () => void;
  onRedo: () => void;
}

export const ReviewScreen = ({
  photoStrip,
  onPrint,
  onRedo,
}: ReviewScreenProps) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);
  const [appSettings] = useState(() => loadAppSettings());

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      setPrintError(null);
      triggerHaptic('medium');
      
      await printPhotoStrip(photoStrip.stripUrl);
      
      playSuccessSound();
      triggerHaptic('heavy');
      onPrint();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to print';
      setPrintError(errorMessage);
      triggerHaptic('heavy');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleRedo = () => {
    triggerHaptic('light');
    onRedo();
  };

  return (
    <div 
      className="relative h-screen transition-all duration-500 overflow-hidden animate-fade-in py-16"
      style={{ 
        backgroundColor: appSettings.reviewBackgroundColor
      }}
    >
      {/* Photo Strip - Centered with padding */}
      <div className="absolute inset-0 flex items-center justify-center py-16">
        <div className="animate-slide-down" style={{ maxWidth: '400px', width: '100%', animationDelay: '0.1s' }}>
          <PhotoStrip photoStrip={photoStrip} />
        </div>
      </div>

      {/* Palms Image - 50px from strip's left edge */}
      <div className="absolute inset-y-16 flex items-end pb-32 animate-slide-in-left" style={{ right: 'calc(50% + 250px)', animationDelay: '0.2s' }}>
        <div style={{ width: '212px' }}>
          <img 
            src={palmsImg} 
            alt="Palms" 
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Buttons - 50px from strip's right edge, properly contained */}
      <div className="absolute inset-y-16 flex items-center" style={{ left: 'calc(50% + 200px + 50px)' }}>
        <div className="flex flex-col animate-slide-in-right items-start" style={{ gap: '30px', animationDelay: '0.3s', paddingBottom: '80px' }}>
          <button
            onClick={handleRedo}
            className="px-8 py-4 text-4xl font-bold text-white rounded-lg shadow-xl transition-all hover:scale-105 active:scale-95"
            style={{ 
              backgroundColor: '#388046',
              border: '2px solid #F8F3EC'
            }}
          >
            Redo
          </button>

          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-20 py-10 text-9xl font-bold text-white rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: '#388046',
              border: '4px solid #F8F3EC'
            }}
          >
            {isPrinting ? 'Printing...' : 'Print Strips'}
          </button>

          {printError && (
            <div className="bg-red-500 text-white rounded-lg p-6 mt-4 animate-slide-down">
              <p className="text-xl font-medium">{printError}</p>
              <p className="text-base mt-2">Please try again</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

