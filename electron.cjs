const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

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
    // Allow closing with secret code or in development
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    e.preventDefault();
  });
};

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

