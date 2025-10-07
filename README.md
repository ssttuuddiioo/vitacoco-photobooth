# Photo Booth Kiosk Application

A touch-optimized photo booth application built with React + Vite for kiosk deployment.

## Features

- 📸 **4-Photo Capture** - Automatic capture with 3-second intervals
- 🖨️ **Print Ready** - Generate and print professional photo strips
- 🔒 **Kiosk Hardening** - Fullscreen mode, wake lock, disabled shortcuts
- ♻️ **Auto-Reset** - 30-second idle timeout returns to welcome screen
- 📱 **Touch Optimized** - Large buttons (150px+) with haptic feedback
- 🎨 **Modern UI** - Animated particles, confetti, and smooth transitions
- 🧹 **Memory Management** - Aggressive cleanup between sessions
- ✨ **Enhanced Animations** - Flash effects, countdowns, and celebrations
- 🎉 **Confetti Effects** - Animated celebrations on success
- 🛡️ **Error Boundaries** - Graceful error handling and recovery
- 🔊 **Interactive Feedback** - Haptic vibration and sound support

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Architecture**: Pure client-side SPA with state machine

## Project Structure

```
photobooth/
├── src/
│   ├── components/
│   │   ├── screens/          # Screen components (welcome, capture, etc.)
│   │   ├── ui/                # Reusable UI components
│   │   └── photo-strip.tsx    # Photo strip display
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and pure functions
│   ├── types/                 # TypeScript type definitions
│   ├── styles/                # Global CSS
│   ├── App.tsx                # Main state machine
│   └── main.tsx               # Entry point
├── public/                    # Static assets
└── [config files]
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Webcam/camera device
- Modern browser (Chrome/Edge recommended for kiosk)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will be available at `http://localhost:5173`

For testing on a touch device on the same network:
```bash
# Server runs on all network interfaces
npm run dev
# Access via http://YOUR_IP:5173
```

## Usage Flow

1. **Welcome Screen** - Tap "START" to begin
2. **Countdown** - 3-2-1 countdown before photos
3. **Capture** - 4 photos captured automatically (3s intervals)
4. **Review** - View photo strip, choose "PRINT" or "REDO"
5. **Thank You** - Confirmation screen (auto-resets in 10s)

## Kiosk Mode

The app includes built-in kiosk hardening:

- ✅ Fullscreen API (automatic)
- ✅ Wake Lock API (prevent screen sleep)
- ✅ Disabled: right-click, F11, F12, Ctrl+Shift+I, text selection
- ✅ Touch-optimized (no zoom, no overscroll)
- ✅ Idle timeout (30s auto-reset)

### Optional: Electron Wrapper

For true kiosk mode on Windows, wrap with Electron:

```bash
npm install -D electron electron-builder
```

See `electron-main.js` example in project documentation.

## Configuration

Edit constants in `src/lib/constants.ts`:

```typescript
export const CONSTANTS = {
  PHOTO_COUNT: 4,              // Number of photos per session
  COUNTDOWN_SECONDS: 3,        // Initial countdown
  PHOTO_INTERVAL_MS: 3000,     // Time between photos
  IDLE_TIMEOUT_MS: 30000,      // Auto-reset timeout
  CANVAS_WIDTH: 400,           // Photo strip width
  CANVAS_STRIP_HEIGHT: 1600,   // Photo strip height
  // ...
};
```

## Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Camera API | ✅ | ✅ | ✅ | ✅ |
| Fullscreen | ✅ | ✅ | ✅ | ✅ |
| Wake Lock | ✅ | ✅ | ⚠️ iOS 16.4+ | ❌ |
| Print API | ✅ | ✅ | ✅ | ✅ |

**Recommended**: Chrome or Edge for best kiosk support

## Development Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run format     # Format with Prettier
```

## Deployment

### Production Build

```bash
npm run build
# Output: dist/
```

Serve the `dist/` folder with any static file server:

```bash
# Example with serve
npx serve dist

# Example with nginx, Apache, or other web server
```

### Windows Kiosk Setup

1. Build production version
2. Set up Electron or use browser kiosk mode:

**Chrome Kiosk Mode:**
```bash
chrome.exe --kiosk --app=http://localhost:5173
```

**Edge Kiosk Mode:**
```bash
msedge.exe --kiosk --app=http://localhost:5173
```

3. Configure Windows to auto-launch on startup
4. Disable Windows shortcuts (Alt+Tab, Win key, etc.) via Group Policy

## Memory Management

The app aggressively manages memory to prevent leaks during extended kiosk operation:

- Photo URLs revoked after session ends
- Canvas elements cleaned up after use
- Media streams stopped properly
- Garbage collection requested on idle

Tested stable for 50+ consecutive sessions.

## Troubleshooting

### Camera Not Working

1. Check browser permissions (allow camera access)
2. Verify camera is not in use by another app
3. Try refreshing the page
4. Check console for error messages

### Fullscreen Not Working

- User gesture required - click "START" button
- Some browsers block fullscreen in iframe
- Check browser permissions

### Print Not Working

- Ensure print dialog is not blocked
- Check printer connection
- Browser must allow window.open()

## Future Enhancements

- [ ] Email/SMS sharing
- [ ] Custom frame overlays
- [ ] Sound effects
- [ ] Admin settings panel
- [ ] Multi-language support
- [ ] Analytics tracking

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.

