// Photo strip component for displaying the 4-photo composite
import type { PhotoStrip as PhotoStripType } from '@/types';

interface PhotoStripProps {
  photoStrip: PhotoStripType;
  className?: string;
}

export const PhotoStrip = ({ photoStrip, className = '' }: PhotoStripProps) => {
  return (
    <div className={`${className}`}>
      <img
        src={photoStrip.stripUrl}
        alt="Photo Strip"
        className="w-full h-auto max-h-[80vh]"
        style={{ 
          objectFit: 'contain', 
          display: 'block',
          border: '2px solid #F8F3EC' // Cream border on preview only
        }}
      />
    </div>
  );
};

