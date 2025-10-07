// Camera settings management with localStorage persistence

export interface CameraSettings {
  zoom: number;
  brightness: number;
  contrast: number;
  saturation: number;
  cropX: number;
  cropY: number;
  rotation: number;
  deviceId?: string; // Optional: specific camera device to use
}

const DEFAULT_SETTINGS: CameraSettings = {
  zoom: 1,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  cropX: 0,
  cropY: 0,
  rotation: 0,
  deviceId: undefined, // Use system default camera
};

const STORAGE_KEY = 'photobooth-camera-settings';

/**
 * Load camera settings from localStorage
 */
export const loadCameraSettings = (): CameraSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CameraSettings;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.error('Failed to load camera settings:', err);
  }
  return DEFAULT_SETTINGS;
};

/**
 * Save camera settings to localStorage
 */
export const saveCameraSettings = (settings: CameraSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save camera settings:', err);
  }
};

/**
 * Reset camera settings to defaults
 */
export const resetCameraSettings = (): CameraSettings => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset camera settings:', err);
  }
  return DEFAULT_SETTINGS;
};

/**
 * Apply camera settings to video element
 */
export const applyCameraSettings = (
  element: HTMLVideoElement | null,
  settings: CameraSettings
): void => {
  if (!element) return;

  const { zoom, brightness, contrast, saturation, cropX, cropY, rotation } = settings;

  element.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  element.style.transform = `scale(${zoom}) translateX(${cropX}%) translateY(${cropY}%) rotate(${rotation}deg)`;
};

/**
 * Get CSS style object for camera settings
 */
export const getCameraSettingsStyle = (settings: CameraSettings) => {
  const { zoom, brightness, contrast, saturation, cropX, cropY, rotation } = settings;
  
  return {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
    transform: `scale(${zoom}) translateX(${cropX}%) translateY(${cropY}%) rotate(${rotation}deg)`,
  };
};

