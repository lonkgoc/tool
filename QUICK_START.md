# Quick Start Guide

## Setup & Installation

### 1. Start the Backend Server

```powershell
cd d:\tool\server

# Install dependencies (if not already done)
npm install

# Start development server on port 4010
npm run dev
```

You should see:
```
Server listening on http://localhost:4010
```

### 2. Start the Frontend (Vite)

In a new PowerShell terminal:

```powershell
cd d:\tool

# Install dependencies (if not already done)
npm install

# Start dev server on port 5173
npm run dev
```

You should see something like:
```
VITE v5.0.0 ready in XXX ms

➜  Local: http://localhost:5173/
```

### 3. Open the App

Open your browser to `http://localhost:5173` and navigate to any tool. All tools now call the backend API on `http://localhost:4010`.

## Available Tools by Category

### PDF Tools (Merge, Split, Rotate, Watermark, Extract Text, Images→PDF, etc.)
- **Route:** `/tool/pdf-tools`
- **Backend:** `/api/pdf/*`

### Image Tools (Compress, Resize, Crop, Convert, Add Text, SVG→PNG, PNG→ICO)
- **Route:** `/tool/image-tools`
- **Backend:** `/api/image/*`

### Archive & File Tools (ZIP/TAR create/extract, merge, split, hash, compare, validate)
- **Route:** `/tool/archive-tools`
- **Backend:** `/api/archive/*`

### Office & Document Tools (Text/Markdown/RTF→PDF, Office→HTML, HTML→PDF)
- **Route:** `/tool/office-tools`
- **Backend:** `/api/office/*`

### Media Tools (Audio/Video convert, Video→GIF, GIF maker)
- **Route:** `/tool/media-tools`
- **Backend:** `/api/media/*`

### Data Format Converters (JSON↔CSV/YAML/XML/TOML, Base64, URL Encode, etc.)
- **Route:** `/tool/file-converters`
- **Backend:** Client-side (all in-browser)

### PDF to Text
- **Route:** `/tool/pdf-to-text`
- **Backend:** `/api/pdf/text`

## Testing the Tools

### Example 1: Extract Text from PDF

1. Navigate to `/tool/pdf-to-text`
2. Click the upload area and select a PDF file
3. Click "Extract Text"
4. Wait for processing and download the `.txt` file

### Example 2: Compress an Image

1. Navigate to `/tool/image-tools`
2. Select "compress" tab
3. Upload an image
4. Click "Compress" and download the compressed version

### Example 3: Create a ZIP from Multiple Files

1. Navigate to `/tool/archive-tools`
2. Select "zip" tab
3. Select multiple files
4. Click "Create ZIP" and download

### Example 4: Convert Text to PDF

1. Navigate to `/tool/office-tools`
2. Select "text→pdf"
3. Upload a `.txt` file
4. Click "TEXT → PDF" and download the PDF

### Example 5: Merge PDFs

1. Navigate to `/tool/pdf-tools`
2. Select "merge" tab
3. Select 2+ PDF files
4. Click "Merge PDFs" and download

## Dependencies by Tool

### No External Dependencies (Client-Side)
- All data format converters (JSON, CSV, YAML, XML, TOML, Base64, URL encode, HTML entities)
- Text-to-PDF (basic)
- Markdown-to-PDF (basic)
- Image compress, resize, crop, convert formats
- ZIP create/extract, file merge, file split, hash, compare, validate

### Requires Optional Binaries

**Image to Base64, Base64 to Image, Add Text to Image, SVG→PNG, PNG→ICO:**
- Already works with `sharp` (npm package, no external binary needed)

**PDF to Images, PDF Compression, PDF Password Protection:**
- `pdftoppm` (poppler-utils) — PDF page rendering
- `ghostscript` — PDF compression
- `qpdf` — PDF password encryption/decryption

**Office Conversions (Word/Excel/PPT/ODT↔PDF):**
- `pandoc` — General document conversion
- `wkhtmltopdf` — HTML to PDF rendering
- `libreoffice` — Office document processing

**Audio/Video/GIF:**
- `ffmpeg` — Video/audio conversion
- `ImageMagick` (convert) — GIF creation from images

## File Upload Limits

- Default: 200 MB per file (archives/media: 500 MB)
- Adjust in `server/src/index.ts` if needed:
  ```typescript
  const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });
  ```

## Troubleshooting

### Backend not running?
- Ensure `npm run dev` is running in `d:\tool\server`
- Check port 4010 is not in use: `netstat -aon | Select-String 4010`
- If port conflict, change in `server/src/index.ts`: `const PORT = process.env.PORT || 4010`

### Frontend not loading?
- Ensure `npm run dev` is running in `d:\tool`
- Check port 5173 is available
- Clear browser cache (Ctrl+Shift+Delete)

### Tool not working?
- Check browser console for errors (F12 → Console)
- Check server logs for API errors
- Ensure required binary is installed (if applicable)
- File size might exceed limit (check upload size limits)

### "Requires X binary" error?
- Most tools have fallbacks; advanced options require external binaries
- See `server/README.md` for installation instructions
- Many advanced features are optional

## Architecture

```
d:\tool
├── src/
│   ├── tools/           ← React components for each tool
│   ├── pages/           ← Page components (ToolPage.tsx routes to tools)
│   ├── App.tsx          ← Main app component
│   └── index.css        ← Global styles
├── server/
│   ├── src/
│   │   ├── index.ts     ← Main Express server
│   │   ├── routes/      ← API route handlers (pdf, image, archive, office, media)
│   │   └── utils/       ← Helper functions for conversions
│   └── package.json     ← Server dependencies
├── vite.config.ts       ← Frontend build config
└── package.json         ← Frontend dependencies
```

## Next Steps

1. **Install Optional Binaries** (if needed):
   - For best experience, install `ghostscript`, `qpdf`, `pandoc`, `ffmpeg`, `ImageMagick`
   - See `server/README.md` for detailed instructions

2. **Deploy to Production:**
   - Build frontend: `npm run build` (in `d:\tool`)
   - Build server: `npm run build` (in `d:\tool\server`)
   - Run: `npm start` in both directories
   - Or use Docker (see `server/README.md`)

3. **Add More Features:**
   - Extend `src/tools/` with new tool components
   - Add corresponding API routes in `server/src/routes/`
   - Update tool registry in `src/tools/index.tsx`

## Support

All tools use the same API pattern:
1. Frontend component uploads file(s) to backend
2. Backend processes file (or calls external binary)
3. Frontend downloads result from `/api/uploads/{filename}`

For detailed endpoint documentation, see `server/README.md`.
