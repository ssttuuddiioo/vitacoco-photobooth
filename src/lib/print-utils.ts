// Print utilities for photo booth
import { loadAppSettings } from '@/lib/app-settings';
import { saveFile } from '@/lib/electron-api';

/**
 * Save print layout to downloads folder (fallback)
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
 * Save photo strip - saves single 400x1200 column (no duplication)
 */
export const printPhotoStrip = async (stripUrl: string): Promise<void> => {
  try {
    // Save the strip directly (400x1200 - single column, 3 photos)
    // No duplication - just one column 2x6
    
    // Load app settings
    const appSettings = loadAppSettings();
    const prefix = appSettings.filenamePrefix || 'photobooth';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${prefix}-${timestamp}.jpg`;
    
    // Try to save to selected folder (works in both Electron and modern browsers)
    if (appSettings.saveFolderPath) {
      const result = await saveFile(filename, stripUrl, appSettings.saveFolderPath);
      
      if (result.success) {
        console.log('File saved to:', result.filePath);
        return Promise.resolve();
      } else {
        console.error('Failed to save file:', result.error);
        // Fall back to download
      }
    }
    
    // Fallback: Browser download to Downloads folder
    downloadPrintFile(stripUrl, filename);
    return Promise.resolve();
  } catch (error) {
    throw error;
  }
};
