// Preload script for Electron security
// This runs in an isolated context before the renderer process

window.addEventListener('DOMContentLoaded', () => {
  console.log('Photobooth app loaded in Electron kiosk mode');
});

