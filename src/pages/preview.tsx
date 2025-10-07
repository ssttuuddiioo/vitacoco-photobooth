// Preview page for testing the review screen with placeholder content
import { useState } from 'react';
import { ReviewScreen } from '@/components/screens/review-screen';
import { generatePhotoStrip } from '@/lib/photo-utils';
import type { PhotoStrip, Photo } from '@/types';

export default function PreviewPage() {
  const [photoStrip, setPhotoStrip] = useState<PhotoStrip | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePlaceholderStrip = async () => {
    setIsGenerating(true);

    // Create placeholder photos (gray squares with text)
    const placeholderPhotos: Photo[] = [];
    
    for (let i = 0; i < 3; i++) {
      // Create a canvas for each placeholder photo
      const canvas = document.createElement('canvas');
      canvas.width = 346;
      canvas.height = 317;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Gray background
        ctx.fillStyle = '#E5E7EB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Text
        ctx.fillStyle = '#6B7280';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Photo ${i + 1}`, canvas.width / 2, canvas.height / 2);
      }
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      placeholderPhotos.push({
        dataUrl,
        timestamp: Date.now(),
        index: i,
      });
    }

    // Generate the photo strip
    try {
      const stripUrl = await generatePhotoStrip(placeholderPhotos);
      
      setPhotoStrip({
        stripUrl,
        photos: placeholderPhotos,
        createdAt: new Date(),
      });
      setIsGenerating(false);
    } catch (error) {
      console.error('Failed to generate placeholder strip:', error);
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    console.log('Print clicked');
  };

  const handleRedo = () => {
    setPhotoStrip(null);
  };

  return (
    <div className="min-h-screen">
      {!photoStrip && !isGenerating && (
        <div
          className="flex flex-col items-center justify-center min-h-screen"
          style={{ backgroundColor: '#388046' }}
        >
          <button
            onClick={generatePlaceholderStrip}
            className="px-16 py-8 text-4xl font-bold text-white rounded-xl shadow-2xl transition-all hover:scale-105"
            style={{ backgroundColor: '#3B5BA5' }}
          >
            Generate Preview
          </button>
          <p className="text-white text-2xl mt-8">
            Testing: Review Screen with Placeholder Photos
          </p>
        </div>
      )}

      {isGenerating && (
        <div
          className="flex flex-col items-center justify-center min-h-screen"
          style={{ backgroundColor: '#388046' }}
        >
          <div className="text-center space-y-8">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-8 border-white/20 rounded-full" />
              <div className="absolute inset-0 border-8 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-6xl font-bold text-white">Generating Preview...</h2>
          </div>
        </div>
      )}

      {photoStrip && (
        <ReviewScreen
          photoStrip={photoStrip}
          onPrint={handlePrint}
          onRedo={handleRedo}
        />
      )}
    </div>
  );
}

