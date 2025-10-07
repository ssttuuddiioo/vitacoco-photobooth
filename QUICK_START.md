# ⚡ Quick Start

## 1. Install Dependencies

```bash
npm install
```

## 2. Start Development Server

```bash
npm run dev
```

## 3. Open Browser

Navigate to: `http://localhost:5173`

## 4. Test the Flow

1. Click **START**
2. Watch countdown (3-2-1)
3. Camera will take 4 photos automatically
4. Click **PRINT** or **REDO**
5. App resets after 10 seconds

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm run format` | Format code with Prettier |

---

## Important Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main state machine |
| `src/lib/constants.ts` | Configuration (timing, sizes) |
| `src/components/screens/` | All screen components |
| `src/hooks/` | Custom React hooks |

---

## Customize Settings

Edit `src/lib/constants.ts`:

```typescript
export const CONSTANTS = {
  PHOTO_COUNT: 4,           // Change to 3 or 6
  COUNTDOWN_SECONDS: 3,     // Initial countdown
  PHOTO_INTERVAL_MS: 3000,  // Time between photos
  IDLE_TIMEOUT_MS: 30000,   // Auto-reset timeout
};
```

---

## Troubleshooting

**Camera not working?**
- Allow camera permissions in browser
- Check camera isn't used by another app

**Fullscreen not activating?**
- Click START button (gesture required)

**TypeScript errors?**
- Run `npm install` again
- Restart VS Code

---

## What's Included

✅ **5 Screens**: Welcome, Countdown, Capture, Review, Thank You  
✅ **Camera Integration**: Live preview and capture  
✅ **Auto-Capture**: 4 photos with 3s intervals  
✅ **Photo Strip**: Generate printable strip  
✅ **Kiosk Mode**: Fullscreen, wake lock, disabled shortcuts  
✅ **Auto-Reset**: 30s idle timeout  
✅ **Memory Management**: Cleanup between sessions  

---

## Next Steps

1. **Test**: Run through complete session
2. **Customize**: Adjust colors, timing, prompts
3. **Deploy**: Build and deploy to kiosk device
4. **Enhance**: Move to Phase 4 for animations

---

**Status**: ✅ Phases 1-3 Complete | Ready to Test!

