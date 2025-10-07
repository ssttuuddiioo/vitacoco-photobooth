// Preload script for Electron security
// This runs in an isolated context before the renderer process

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  saveFile: (params) => ipcRenderer.invoke('save-file', params),
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('Photobooth app loaded in Electron kiosk mode');
});

