# Quick Setup Guide

## Initial Setup (First Time Only)

```bash
# Navigate to project directory
cd photobooth

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at: `http://localhost:5173`

## What's Included (Phases 1-3 Complete ✅)

### Phase 1: Foundation & Kiosk Setup ✅
- ✅ Project initialized with Vite + React + TypeScript
- ✅ All configuration files (tsconfig, tailwind, eslint, prettier)
- ✅ Core type definitions and Zod schemas
- ✅ Kiosk hardening (fullscreen, wake lock, disabled shortcuts)

### Phase 2: Camera & Memory Management ✅
- ✅ Camera hook with permission handling
- ✅ Memory utilities for cleanup
- ✅ Photo capture hook with error handling
- ✅ Photo utilities (frame capture, strip generation)

### Phase 3: Core State Machine ✅
- ✅ Main App component with state machine
- ✅ All screen components:
  - Welcome screen
  - Countdown screen (3-2-1)
  - Capture screen (4 photos with auto-capture)
  - Review screen (print/redo)
  - Thank you screen (auto-reset)
- ✅ Idle timeout and auto-reset
- ✅ Complete navigation flow

## Testing the App

1. **Allow Camera Access**: Browser will prompt for camera permission
2. **Welcome Screen**: Click "START"
3. **Countdown**: Watch 3-2-1 countdown
4. **Capture**: 4 photos will be taken automatically (3s apart)
5. **Review**: See your photo strip, click "PRINT" or "REDO"
6. **Thank You**: Confirmation screen (resets in 10s)

## Keyboard Shortcuts (Development Only)

In kiosk mode, most shortcuts are disabled. During development:
- `F11` - Disabled (use button to toggle fullscreen)
- `F12` - Disabled (dev tools blocked in kiosk)
- `Right-click` - Disabled (context menu blocked)

## Next Steps (Phase 4+)

Ready to continue with:
- **Phase 4**: Enhanced capture flow with animations
- **Phase 5**: Advanced photo strip features
- **Phase 6**: Session management refinements
- **Phase 7**: Polish & UX improvements
- **Phase 8**: Error handling & testing

## Project Structure

```
photobooth/
├── src/
│   ├── components/
│   │   ├── screens/        ← All screen components
│   │   ├── ui/             ← Reusable UI (Button, Flash, Timer)
│   │   └── photo-strip.tsx
│   ├── hooks/              ← Custom hooks (camera, countdown, etc.)
│   ├── lib/                ← Utilities (photo, print, memory)
│   ├── types/              ← TypeScript types
│   └── App.tsx             ← Main state machine
└── [config files]
```

## Common Issues

### Camera not working?
- Check browser permissions
- Make sure camera isn't used by another app
- Try refreshing the page

### Fullscreen not activating?
- Click the "START" button (user gesture required)
- Some browsers need manual approval

### TypeScript errors?
- Run `npm install` to ensure all deps are installed
- Check tsconfig.json is using correct paths

## Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview

# Output will be in: dist/
```

## Development Tips

- **Hot Reload**: Changes auto-reload in browser
- **Console**: Check browser console for any errors
- **Linting**: Run `npm run lint` to check code quality
- **Format**: Run `npm run format` to auto-format code

## What's Next?

The foundational prototype is complete! You can now:

1. **Test the flow**: Run through a complete session
2. **Adjust timing**: Edit `src/lib/constants.ts`
3. **Customize UI**: Modify colors in screen components
4. **Continue development**: Move to Phase 4 for enhanced features

---

**Status**: Phases 1-3 Complete ✅ | Ready for Phase 4+

