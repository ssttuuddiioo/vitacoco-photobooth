// Application constants

export const CONSTANTS = {
  PHOTO_COUNT: 3,
  COUNTDOWN_SECONDS: 3,
  PHOTO_INTERVAL_MS: 2500, // 2.5 seconds between photos
  IDLE_TIMEOUT_MS: 30000,
  CANVAS_WIDTH: 400, // Strip width
  CANVAS_STRIP_HEIGHT: 1200, // Strip height
  PHOTO_WIDTH: 346, // Photo width
  PHOTO_HEIGHT: 317, // Photo height
  FLASH_DURATION_MS: 200, // Optimized for snappy response without lag
  THANK_YOU_DURATION_MS: 5000, // 5 seconds
} as const;

export const CAMERA_CONSTRAINTS = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user',
    focusMode: 'manual', // Disable autofocus
  },
  audio: false,
} as const;

export const PHOTO_PROMPTS = [
  'Say Cheese! 🧀',
  'Strike a Pose! 💃',
  'Get Silly! 🤪',
  'Big Smiles! 😁',
  'Look Fabulous! ✨',
  'Peace Out! ✌️',
  'Show Your Style! 😎',
  'Party Time! 🎉',
] as const;

export const COUNTDOWN_MESSAGES = [
  'Get Ready!',
  'Smile Time!',
  'Looking Good!',
  'Almost There!',
] as const;

