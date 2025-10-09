// Application settings management with localStorage persistence

export interface AppSettings {
  filenamePrefix: string;
  saveFolderPath: string;
  stripBackgroundColor: string;
  watermarkImageUrl: string;
  watermarkScale: number; // 0.5 to 1.5 (percentage of strip width)
  watermarkBottomOffset: number; // pixels from bottom
  // Page background colors
  welcomeBackgroundColor: string;
  countdownBackgroundColor: string;
  captureBackgroundColor: string;
  processingBackgroundColor: string;
  reviewBackgroundColor: string;
  thankYouBackgroundColor: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  filenamePrefix: 'photobooth',
  saveFolderPath: '', // Empty means use Downloads folder
  stripBackgroundColor: '#388046', // Vita Coco green
  watermarkImageUrl: '', // Empty means use default bottom.png
  watermarkScale: 0.9, // 90% of strip width
  watermarkBottomOffset: 20, // 20px from bottom edge
  // Page background colors (Vita Coco green by default)
  welcomeBackgroundColor: '#388046',
  countdownBackgroundColor: '#388046',
  captureBackgroundColor: '#388046',
  processingBackgroundColor: '#388046',
  reviewBackgroundColor: '#388046',
  thankYouBackgroundColor: '#388046',
};

const STORAGE_KEY = 'photobooth-app-settings';

/**
 * Load app settings from localStorage
 */
export const loadAppSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AppSettings;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.error('Failed to load app settings:', err);
  }
  return DEFAULT_SETTINGS;
};

/**
 * Save app settings to localStorage
 */
export const saveAppSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save app settings:', err);
  }
};

/**
 * Reset app settings to defaults
 */
export const resetAppSettings = (): AppSettings => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset app settings:', err);
  }
  return DEFAULT_SETTINGS;
};

