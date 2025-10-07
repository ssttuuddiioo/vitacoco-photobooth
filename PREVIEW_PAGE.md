# Preview Page for Testing

## Overview
A standalone `/preview` route has been added for testing the review screen without going through the full photo capture flow.

## Access the Preview Page

```
http://localhost:5173/preview
```

## Features

### Placeholder Content
- Generates 3 placeholder photos (gray boxes with "Photo 1", "Photo 2", "Photo 3")
- Creates a complete photo strip with Vita Coco branding
- Shows the exact review screen layout

### What You Can Test
- Photo strip display (400x1200px with 346x317px photos)
- Responsive sizing
- Button positioning (Print and Redo)
- Stacked polaroid effect
- Print preview (single strip, centered)
- Overall layout and spacing

### How to Use

1. Start the dev server:
```bash
npm run dev
```

2. Navigate to `/preview` in your browser

3. Click "Generate Preview" button

4. View the review screen with placeholder content

5. Test Print button to see print layout (single strip)

6. Click Redo to reset

## Print Layout Updated

The print preview now shows **ONE strip** (not two side-by-side):
- 4x6 inch layout (1200x1800px)
- Single 400x1200px strip
- Centered horizontally and vertically
- White background

## Routes

- `/` - Main photobooth app
- `/preview` - Testing preview page

## Files Modified

- `src/main.tsx` - Added React Router
- `src/pages/preview.tsx` - New preview page
- `src/lib/photo-utils.ts` - Updated print layout to single strip
- `package.json` - Added react-router-dom

