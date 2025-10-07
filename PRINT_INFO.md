# Photo Strip Print Information

## Photo Strip Layout

### Single Column (2x6 inch)
- **Dimensions**: 600 x 1800 pixels (300 DPI)
- **Format**: 3 square photos stacked vertically
- **Background**: Vita Coco green (#578A5F)
- **Photos**: 520x520px each with white borders
- **Branding**: Vita Coco and Montauk General Store logos at bottom

### Print Layout (4x6 inch)
- **Dimensions**: 1200 x 1800 pixels (300 DPI)
- **Format**: 2 columns side-by-side (identical photo strips)
- **Output**: Ready for 4x6 photo paper printing

## Print Workflow

1. **Capture**: User takes 3 photos with countdown
2. **Review**: Photos are displayed in a preview strip
3. **Print**: 
   - Generates 2x6 single column strip
   - Creates 4x6 layout (2 columns)
   - Saves to Downloads folder as `photobooth-[timestamp].jpg`
   - Opens print dialog for immediate printing

## File Storage

All printed photos are automatically saved to the browser's Downloads folder with filename format:
```
photobooth-2025-10-06T12-30-45-123Z.jpg
```

## Technical Specifications

- **Canvas Size**: 1200 x 1800 pixels
- **Resolution**: 300 DPI
- **Format**: JPEG (95% quality)
- **Paper Size**: 4x6 inches
- **Orientation**: Portrait
- **Margins**: None (full bleed)

## Usage

The print function is automatically triggered when user clicks "Print" button on the review screen. The file is saved locally and a print dialog opens for physical printing.

```typescript
await printPhotoStrip(stripUrl);
```

This will:
1. Generate the 4x6 print layout
2. Save to Downloads folder
3. Open print preview
4. Allow user to print on 4x6 photo paper

