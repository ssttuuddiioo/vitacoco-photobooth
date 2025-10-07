# Vita Coco Photobooth - Windows Deployment Guide

## Prerequisites on Windows Machine

1. **Install Node.js** (v18 or later)
   - Download from: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **Install Git**
   - Download from: https://git-scm.com/download/win
   - Verify: `git --version`

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/ssttuuddiioo/vitacoco-photobooth.git
cd vitacoco-photobooth
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Application

```bash
npm run build
```

### 4. Build Windows Installer

```bash
npm run electron:build:win
```

This creates a Windows installer in the `release/` folder.

### 5. Install the App

- Navigate to `release/` folder
- Run the installer: `Vita Coco Photobooth Setup X.X.X.exe`
- Follow installation wizard
- Choose installation directory
- Create desktop shortcut (recommended)

## Running the App

### Production Mode (Kiosk)

Double-click the "Vita Coco Photobooth" desktop shortcut or find it in Start Menu.

The app will launch in full kiosk mode:
- No menu bar
- No window controls
- All keyboard shortcuts disabled
- Exit only with: `Ctrl + Shift + Alt + Q`

### Development Mode (Testing)

If you need to test without kiosk mode:

```bash
npm run dev
```

Then open Chrome/Edge to: `http://localhost:5173`

## Admin Access

1. **Tap the logo 10 times** to enter admin mode
2. Configure camera settings:
   - Filters (brightness, contrast, saturation)
   - Zoom
   - Crop position
   - Rotation
3. Settings are saved to localStorage and persist

## Printer Setup

The app automatically saves photo strips to:
```
C:\Users\[Username]\Downloads\photobooth-[timestamp].jpg
```

### Configure Windows to Auto-Print

1. Set default printer in Windows Settings
2. Use printer software to monitor Downloads folder
3. Configure auto-print for new `.jpg` files

## Auto-Start on Boot (Optional)

1. Press `Win + R`
2. Type: `shell:startup`
3. Create shortcut to: `C:\Program Files\Vita Coco Photobooth\Vita Coco Photobooth.exe`
4. App will launch on Windows startup

## Troubleshooting

### Camera Not Working
- Grant camera permissions in Windows Settings → Privacy → Camera
- Ensure no other apps are using the camera
- Restart the app

### Fullscreen Issues
- Exit with: `Ctrl + Shift + Alt + Q`
- Re-launch the app

### Print Files Not Saving
- Check Downloads folder permissions
- Ensure sufficient disk space

### Updates
To update the app:
```bash
cd vitacoco-photobooth
git pull origin main
npm install
npm run electron:build:win
```

Then reinstall the app.

## Support

For issues or questions, contact: [your-email@example.com]

---

**Note:** The printer setup expects 4x6" postcards. The app generates 800x1200px images (2 strips side-by-side) which the printer will cut in half.

