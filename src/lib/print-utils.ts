// Print utilities for photo booth
import { generatePrintLayout } from '@/lib/photo-utils';

/**
 * Save print layout to downloads folder
 */
const downloadPrintFile = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Save photo strip to downloads folder (no print dialog)
 */
export const printPhotoStrip = async (stripUrl: string): Promise<void> => {
  try {
    // Generate 4x6 print layout (single centered strip)
    const printLayout = await generatePrintLayout(stripUrl);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `photobooth-${timestamp}.jpg`;
    
    // Save to downloads folder
    downloadPrintFile(printLayout, filename);
    
    // Resolve immediately after download starts
    return Promise.resolve();
  } catch (error) {
    throw error;
  }
};
