// Pure functions for photo operations
import { CONSTANTS } from '@/lib/constants';
import { loadCameraSettings, type CameraSettings } from '@/lib/camera-settings';
import { loadAppSettings } from '@/lib/app-settings';
import type { Photo } from '@/types';

/**
 * Apply camera settings to canvas context
 */
const applyCameraFiltersToCanvas = (
  ctx: CanvasRenderingContext2D,
  settings: CameraSettings
): void => {
  // Apply filters using canvas filter property
  const filters = [];
  
  if (settings.brightness !== 100) {
    filters.push(`brightness(${settings.brightness}%)`);
  }
  if (settings.contrast !== 100) {
    filters.push(`contrast(${settings.contrast}%)`);
  }
  if (settings.saturation !== 100) {
    filters.push(`saturate(${settings.saturation}%)`);
  }
  
  if (filters.length > 0) {
    ctx.filter = filters.join(' ');
  }
};

/**
 * Capture a frame from video element to canvas and return as data URL
 * Applies camera settings (filters, zoom, rotation, crop) to the captured image
 */
export const captureFrame = (video: HTMLVideoElement, settings?: CameraSettings): string => {
  // Load settings if not provided
  const cameraSettings = settings || loadCameraSettings();
  
  const canvas = document.createElement('canvas');
  canvas.width = CONSTANTS.PHOTO_WIDTH;
  canvas.height = CONSTANTS.PHOTO_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Save context state
  ctx.save();

  // Apply rotation if set
  if (cameraSettings.rotation !== 0) {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((cameraSettings.rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  }

  // Apply filters to canvas
  applyCameraFiltersToCanvas(ctx, cameraSettings);

  // Draw video frame with zoom and crop
  const aspectRatio = video.videoWidth / video.videoHeight;
  let sourceWidth = video.videoWidth / cameraSettings.zoom;
  let sourceHeight = video.videoHeight / cameraSettings.zoom;
  let sourceX = (video.videoWidth - sourceWidth) / 2 + cameraSettings.cropX;
  let sourceY = (video.videoHeight - sourceHeight) / 2 + cameraSettings.cropY;

  // Crop to center square
  if (aspectRatio > 1) {
    // Landscape: crop width
    sourceWidth = sourceHeight;
    sourceX = (video.videoWidth - sourceWidth) / 2 + cameraSettings.cropX;
  } else {
    // Portrait: crop height
    sourceHeight = sourceWidth;
    sourceY = (video.videoHeight - sourceHeight) / 2 + cameraSettings.cropY;
  }

  ctx.drawImage(
    video,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Restore context state
  ctx.restore();

  // Convert to JPEG with quality compression
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

  // Cleanup
  canvas.width = 0;
  canvas.height = 0;

  return dataUrl;
};

/**
 * Generate 2x6 photo strip from 3 photos with Vita Coco branding (single column)
 * Specs: 400x1200px, photos 346x317px, 30px spacing, 100px bottom
 */
export const generatePhotoStrip = async (photos: Photo[]): Promise<string> => {
  if (photos.length !== CONSTANTS.PHOTO_COUNT) {
    throw new Error(`Photo strip requires exactly ${CONSTANTS.PHOTO_COUNT} photos`);
  }

  // Load app settings for custom background color
  const appSettings = loadAppSettings();

  // Exact specifications
  const stripWidth = 400;
  const stripHeight = 1200;
  const photoWidth = 346;
  const photoHeight = 317;
  const photoSpacing = 30;
  const bottomSpace = 100;
  
  const canvas = document.createElement('canvas');
  canvas.width = stripWidth;
  canvas.height = stripHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Use custom background color from settings
  ctx.fillStyle = appSettings.stripBackgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calculate top padding to center photos vertically
  const totalPhotoHeight = (photoHeight * 3) + (photoSpacing * 2);
  const topPadding = (stripHeight - totalPhotoHeight - bottomSpace) / 2;
  
  // Center photos horizontally
  const startX = (stripWidth - photoWidth) / 2;

  // Load and draw photos - wait for all to complete
  const photoPromises = photos.map((photo, index) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const yPosition = topPadding + (index * (photoHeight + photoSpacing));
        
        // Draw photo (no border - photos have white space around them)
        ctx.drawImage(
          img,
          startX,
          yPosition,
          photoWidth,
          photoHeight
        );
        
        resolve();
      };
      img.onerror = () => reject(new Error(`Failed to load photo ${index}`));
      img.src = photo.dataUrl;
    });
  });

  // Wait for all photo images to load
  await Promise.all(photoPromises);

  // Load and draw bottom branding image
  await new Promise<void>((resolve) => {
    const bottomImg = new Image();
    bottomImg.onload = () => {
      // Calculate position to center the bottom image in the bottom space
      const bottomImgWidth = stripWidth * 0.9; // 90% of strip width for padding
      const bottomImgHeight = (bottomImg.height / bottomImg.width) * bottomImgWidth;
      const bottomX = (stripWidth - bottomImgWidth) / 2;
      const bottomY = stripHeight - bottomSpace + (bottomSpace - bottomImgHeight) / 2;
      
      ctx.drawImage(
        bottomImg,
        bottomX,
        bottomY,
        bottomImgWidth,
        bottomImgHeight
      );
      
      resolve();
    };
    bottomImg.onerror = () => {
      console.error('Failed to load bottom branding image, using text fallback');
      // Fallback to text if image fails to load
      const brandingY = stripHeight - 60;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Futura, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VITA COCO', stripWidth / 2, brandingY);
      ctx.font = '18px Futura, sans-serif';
      ctx.fillText('Montauk General Store', stripWidth / 2, brandingY + 30);
      resolve();
    };
    bottomImg.src = '/bottom.png';
  });

  // Return data URL after everything is complete
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

  // Cleanup
  canvas.width = 0;
  canvas.height = 0;

  return dataUrl;
};

/**
 * Generate postcard print layout: 800x1200 with strip repeated twice side-by-side
 * Printer cuts this in half to give user 2 identical strips!
 */
export const generatePrintLayout = (stripDataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Postcard dimensions: 800x1200 (two 400x1200 strips side by side)
      const printWidth = 800;
      const printHeight = 1200;
      const stripWidth = 400;
      const stripHeight = 1200;
      
      const canvas = document.createElement('canvas');
      canvas.width = printWidth;
      canvas.height = printHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // No background needed - strips fill the entire canvas

      // Load strip image
      const img = new Image();
      img.onload = () => {
        // Draw strip on LEFT side (first strip)
        ctx.drawImage(img, 0, 0, stripWidth, stripHeight);
        
        // Draw strip on RIGHT side (second strip - duplicate)
        ctx.drawImage(img, stripWidth, 0, stripWidth, stripHeight);

        // Return data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

        // Cleanup
        canvas.width = 0;
        canvas.height = 0;

        resolve(dataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load photo strip image'));
      };
      
      img.src = stripDataUrl;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Add watermark to canvas with improved styling
 */
export const addWatermark = (
  ctx: CanvasRenderingContext2D,
  text: string,
  includeDate = true
): void => {
  const canvas = ctx.canvas;

  ctx.save();
  
  // Semi-transparent background for watermark
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
  
  // Watermark text
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  
  if (includeDate) {
    const date = new Date().toLocaleDateString();
    ctx.fillText(`${text} • ${date}`, canvas.width / 2, canvas.height - 20);
  } else {
    ctx.fillText(text, canvas.width / 2, canvas.height - 20);
  }
  
  ctx.restore();
};

/**
 * Add frame overlay to canvas (optional enhancement)
 */
export const addFrameOverlay = (ctx: CanvasRenderingContext2D): void => {
  const canvas = ctx.canvas;

  ctx.save();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 8;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
};

