// Application settings management with localStorage persistence

export interface AppSettings {
  filenamePrefix: string;
  saveFolderPath: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  filenamePrefix: 'photobooth',
  saveFolderPath: '', // Empty means use Downloads folder
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

