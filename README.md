# Vita Coco Photobooth

A professional photobooth application built with React + Electron for kiosk installations.

## Features

- **Full Photo Experience**
  - Touch-to-start welcome screen with live camera preview
  - 3-photo capture with synchronized countdown
  - Real-time camera view during capture
  - Photo strip generation (400x1200px)
  - Print-ready postcard layout (800x1200px, cuts into 2 strips)
  - Smooth transitions between screens

- **Admin Controls**
  - Secret access: tap logo 10 times
  - Camera filters: brightness, contrast, saturation
  - Zoom, crop, and rotation controls
  - Settings persist via localStorage

- **Kiosk Mode**
  - Fullscreen, frameless window
  - All keyboard shortcuts disabled
  - Exit code: `Ctrl + Shift + Alt + Q`
  - Auto-retry camera initialization
  - Wake lock support

- **Professional UI**
  - Vita Coco branded design
  - Touch-optimized controls
  - Minimalist animations
  - Responsive layouts

## Quick Start (Development)

```bash
npm install
npm run dev
```

Open browser to `http://localhost:5173`

## Building for Windows

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Windows installation instructions.

```bash
# Build Windows installer from Mac
npm run electron:build:win

# Or on Windows machine
git clone https://github.com/ssttuuddiioo/vitacoco-photobooth.git
cd vitacoco-photobooth
npm install
npm run electron:build:win
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Electron** - Desktop app wrapper
- **Zod** - Runtime validation

## Project Structure

```
src/
├── components/
│   ├── screens/        # Main app screens
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helpers
├── pages/              # Routes (preview page)
├── styles/             # Global CSS
└── types/              # TypeScript definitions

public/
└── logo/               # Brand assets

electron.cjs            # Electron main process
preload.cjs            # Electron preload script
```

## Development vs Production

### Development Mode
- Window mode (not fullscreen)
- DevTools available
- Hot reload
- `npm run dev`

### Production Mode
- Fullscreen kiosk
- No browser UI
- Keyboard shortcuts disabled
- Exit: `Ctrl + Shift + Alt + Q`

## Camera Settings

Admin panel includes:
- **Filters**: Brightness, contrast, saturation
- **Zoom**: 1x - 3x
- **Crop**: Horizontal and vertical positioning
- **Rotation**: 0° - 359°

Settings are saved locally and applied to all captured photos.

## Photo Strip Details

- **Preview Strip**: 400x1200px (3 photos vertically)
- **Print Layout**: 800x1200px (2 strips side-by-side)
- **Photo Size**: 346x317px each
- **Spacing**: 30px between photos, 100px bottom margin
- **Background**: Vita Coco green (#388046)

The printer cuts the 800x1200 postcard in half, giving users 2 identical strips.

## Browser Compatibility

Tested on:
- Chrome/Edge (recommended for kiosk)
- Firefox
- Safari

## License

Proprietary - Vita Coco

---

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
