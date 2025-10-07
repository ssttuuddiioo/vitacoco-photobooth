const { app, BrowserWindow, globalShortcut, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Single instance lock - prevent multiple instances from running
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Another instance is already running, quit this one
  app.quit();
} else {
  // This is the first instance, set up focus handler
  app.on('second-instance', () => {
    // If someone tries to launch a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    fullscreen: false, // Disabled for debugging
    kiosk: false, // Disabled for debugging
    frame: true, // Enabled for debugging
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: true,
    },
  });

  // Grant camera and microphone permissions automatically
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    console.log('Permission requested:', permission);
    if (permission === 'media' || permission === 'mediaKeySystem') {
      callback(true); // Grant permission
    } else {
      callback(false);
    }
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    mainWindow.webContents.openDevTools(); // Enable DevTools to see errors
  }

  // Prevent window from being closed
  mainWindow.on('close', (e) => {
    // DEBUGGING: Allow closing for now
    return;
    
    // TODO: Re-enable for production kiosk mode:
    // if (process.env.NODE_ENV === 'development') {
    //   return;
    // }
    // e.preventDefault();
  });
};

// IPC handlers for file operations
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.filePaths[0];
});

ipcMain.handle('save-file', async (event, { folderPath, filename, dataUrl }) => {
  try {
    // Convert base64 data URL to buffer
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create full file path
    const filePath = path.join(folderPath, filename);
    
    // Save file
    await fs.promises.writeFile(filePath, buffer);
    
    return { success: true, filePath };
  } catch (error) {
    console.error('Failed to save file:', error);
    return { success: false, error: error.message };
  }
});

app.whenReady().then(() => {
  createWindow();

  // Disable all keyboard shortcuts for kiosk mode
  globalShortcut.register('Alt+F4', () => {});
  globalShortcut.register('F11', () => {});
  globalShortcut.register('F12', () => {});
  globalShortcut.register('CommandOrControl+R', () => {});
  globalShortcut.register('CommandOrControl+Shift+R', () => {});
  globalShortcut.register('CommandOrControl+W', () => {});
  globalShortcut.register('CommandOrControl+Q', () => {});
  globalShortcut.register('Escape', () => {});

  // Secret exit code: Ctrl+Shift+Alt+Q
  globalShortcut.register('CommandOrControl+Shift+Alt+Q', () => {
    app.quit();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

