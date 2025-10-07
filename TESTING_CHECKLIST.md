# Testing Checklist

## Pre-Testing Setup

- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Browser opened to `http://localhost:5173`
- [ ] Camera connected and working
- [ ] Console open for error monitoring

---

## 🎯 Core Flow Testing

### Welcome Screen
- [ ] Screen displays correctly
- [ ] START button is large and touch-friendly
- [ ] Button responds to click/tap
- [ ] Fullscreen activates on click

### Countdown Screen
- [ ] Countdown starts at 3
- [ ] Numbers animate smoothly (3 → 2 → 1)
- [ ] "Get Ready!" message displays
- [ ] Auto-advances to capture after countdown

### Capture Screen
- [ ] Camera permission prompt appears
- [ ] Live video preview displays
- [ ] Video is mirrored correctly
- [ ] Photo counter shows "Photo 1 of 4"
- [ ] First photo captures after 3 seconds
- [ ] Flash effect appears on capture
- [ ] Photo prompts change between captures
- [ ] Progress dots fill as photos are taken
- [ ] All 4 photos captured successfully
- [ ] Auto-advances to review after 4th photo

### Review Screen
- [ ] Photo strip displays correctly
- [ ] All 4 photos visible in strip
- [ ] PRINT button works
- [ ] Print dialog opens
- [ ] REDO button resets to welcome

### Thank You Screen
- [ ] Thank you message displays
- [ ] "Photos printing" message (if printed)
- [ ] Countdown shows 10 → 0
- [ ] Auto-resets to welcome after 10s

---

## 🔒 Kiosk Features

### Fullscreen Mode
- [ ] Fullscreen activates on START
- [ ] Fullscreen persists across screens
- [ ] F11 key is disabled
- [ ] Browser chrome is hidden

### Wake Lock
- [ ] Screen doesn't sleep during session
- [ ] Wake lock status shows in console (if supported)

### Disabled Shortcuts
- [ ] Right-click context menu disabled
- [ ] F12 developer tools disabled
- [ ] Ctrl+Shift+I disabled
- [ ] Ctrl+U (view source) disabled
- [ ] Text selection disabled

### Touch Optimization
- [ ] No zoom on double-tap
- [ ] No overscroll bounce
- [ ] Buttons feel responsive (<100ms)
- [ ] No tap highlight flash

---

## ⏱️ Timing & Auto-Reset

### Photo Capture Timing
- [ ] 3 seconds between each photo
- [ ] Countdown timer displays correctly
- [ ] Total capture time ~12 seconds (4 photos)

### Idle Timeout
- [ ] Leave app on welcome screen for 30s
- [ ] App resets to welcome automatically
- [ ] Leave app on review screen for 30s
- [ ] App resets to welcome automatically
- [ ] Idle timeout does NOT trigger during capture

### Thank You Timer
- [ ] 10-second countdown displays
- [ ] Auto-reset after 10 seconds
- [ ] Timer is accurate

---

## 🧹 Memory Management

### Between Sessions
- [ ] Run 5 consecutive sessions
- [ ] Check browser memory in DevTools
- [ ] Memory doesn't continuously grow
- [ ] No console errors about leaks

### Photo Cleanup
- [ ] Photos cleared on reset
- [ ] Photo URLs revoked (check network tab)
- [ ] Canvas elements cleaned up

---

## 🐛 Error Handling

### Camera Errors
- [ ] Deny camera permission → Error message displays
- [ ] No camera connected → Error message displays
- [ ] Camera in use by other app → Error displays
- [ ] Error messages are user-friendly

### Edge Cases
- [ ] Start session, immediately refresh → No errors
- [ ] Close browser tab during capture → Cleanup works
- [ ] Print dialog cancelled → No errors
- [ ] Navigate away and back → App resets correctly

---

## 🎨 UI/UX

### Visual Design
- [ ] Colors are vibrant and engaging
- [ ] Text is readable at distance
- [ ] Buttons have clear labels
- [ ] Animations are smooth (60fps)

### Responsive Behavior
- [ ] Works on desktop display
- [ ] Works on touchscreen device
- [ ] Scales properly at different resolutions

### Accessibility
- [ ] High contrast for readability
- [ ] Large touch targets (150px+)
- [ ] Clear visual feedback on interactions

---

## 📱 Device-Specific Testing

### Desktop/Laptop
- [ ] Mouse clicks work
- [ ] Keyboard (spacebar on buttons) works
- [ ] Webcam captures correctly

### Touchscreen Kiosk
- [ ] Touch interactions responsive
- [ ] No accidental zooms or scrolls
- [ ] Buttons easy to press
- [ ] Works in portrait and landscape

### Windows Touchscreen
- [ ] Touch events register correctly
- [ ] No Windows gestures interfere
- [ ] Edge/Chrome browser works well

---

## 🖨️ Print Testing

### Print Functionality
- [ ] Print button triggers print dialog
- [ ] Photo strip renders in print preview
- [ ] Print dimensions are correct (4in strip)
- [ ] Quality is acceptable
- [ ] Print completes successfully

### Print Errors
- [ ] Cancel print → No app errors
- [ ] Printer offline → Graceful handling
- [ ] Re-print after cancel works

---

## 🔧 Development Testing

### Code Quality
- [ ] `npm run lint` → No errors
- [ ] `npm run format` → Code formatted
- [ ] TypeScript compiles without errors
- [ ] No console warnings in production build

### Build Testing
- [ ] `npm run build` → Successful
- [ ] `npm run preview` → App works in production mode
- [ ] Production build is optimized
- [ ] Assets loaded correctly

---

## Performance Metrics

### Load Time
- [ ] Initial load < 3 seconds
- [ ] Camera initializes < 2 seconds

### Interaction Speed
- [ ] Button press → Response < 100ms
- [ ] Screen transitions smooth
- [ ] Photo capture fast (<500ms)
- [ ] Photo strip generation < 1 second

### Memory Usage
- [ ] Baseline memory noted
- [ ] After 10 sessions: < 50MB growth
- [ ] No memory leaks detected

---

## 🎯 Acceptance Criteria

### MVP Complete When:
- ✅ Camera initializes and displays preview
- ✅ Captures 4 photos with 3s intervals
- ✅ Generates photo strip correctly
- ✅ Print functionality works
- ✅ Session resets automatically after 30s idle
- ✅ No memory leaks over 50+ sessions
- ✅ Fullscreen mode stays active
- ✅ Touch interactions feel responsive (<100ms)
- ✅ Errors handled gracefully with user feedback
- ✅ Runs smoothly on target Windows touchscreen device

---

## Notes Section

**Issues Found:**

---

**Performance Observations:**

---

**Suggestions:**

---

**Device Tested:**
- OS: 
- Browser:
- Screen Size:
- Camera:

**Test Date:** _______________
**Tested By:** _______________

