# Tool Server - Backend API

A TypeScript/Express server providing conversion and file manipulation endpoints for 60+ tools.

## Quick Start

### Prerequisites

- Node.js 16+
- npm

### Optional Binary Dependencies

Some endpoints require external binaries. Install as needed:

**PDF Operations (compress, rotate, watermark, add/remove password, pdf-to-images):**
- `qpdf` — Password encrypt/decrypt
- `ghostscript` — PDF compression and optimization
- `pdftoppm` (poppler-utils) — PDF page rendering to PNG

**Office/Document Conversions:**
- `libreoffice` — office-to-html, DOCX/XLSX/PPTX operations
- `pandoc` — Document conversions (word-to-pdf, excel-to-pdf, etc.)
- `wkhtmltopdf` — HTML to PDF rendering

**Media & Image:**
- `ffmpeg` — Video/audio conversion, video-to-gif
- `ImageMagick` (convert command) — GIF creation from images

### Installation & Running

```bash
cd server

# Install dependencies
npm install

# Development (with auto-reload)
npm run dev

# Production build & run
npm run build
npm start
```

Server runs on `http://localhost:4010` by default. Change port via `$env:PORT=4000`:

```powershell
$env:PORT=4000; npm run dev
```

## API Endpoints

### PDF Operations

- `POST /api/pdf/text` — Extract text from PDF
- `POST /api/pdf/merge` — Merge multiple PDFs
- `POST /api/pdf/split` — Split PDF into single pages
- `POST /api/pdf/rotate` — Rotate PDF pages
- `POST /api/pdf/watermark` — Add watermark text
- `POST /api/pdf/compress` — Compress PDF (requires ghostscript)
- `POST /api/pdf/add-password` — Encrypt PDF (requires qpdf)
- `POST /api/pdf/remove-password` — Decrypt PDF (requires qpdf)
- `POST /api/pdf/to-images` — Render PDF pages to PNG (requires pdftoppm)
- `POST /api/pdf/images-to-pdf` — Create PDF from images

### Image Operations

- `POST /api/image/compress` — Compress image
- `POST /api/image/resize` — Resize image
- `POST /api/image/crop` — Crop image
- `POST /api/image/convert` — Convert image format (jpeg/png/webp/gif)
- `POST /api/image/add-text` — Add text overlay to image
- `POST /api/image/svg-to-png` — Render SVG to PNG
- `POST /api/image/png-to-ico` — Convert PNG to ICO
- `POST /api/image/to-base64` — Image to Base64
- `POST /api/image/from-base64` — Base64 to Image

### Archive & File Tools

- `POST /api/archive/zip-create` — Create ZIP archive
- `POST /api/archive/zip-extract` — Extract ZIP
- `POST /api/archive/tar-create` — Create TAR.GZ
- `POST /api/archive/tar-extract` — Extract TAR.GZ
- `POST /api/archive/7z-extract` — Extract 7Z (requires 7z)
- `POST /api/archive/rar-extract` — Extract RAR (requires unrar)
- `POST /api/archive/merge` — Merge binary files
- `POST /api/archive/split` — Split file into chunks
- `POST /api/archive/hash` — Generate file hash (SHA256)
- `POST /api/archive/compare` — Compare two files
- `POST /api/archive/find-duplicates` — Find duplicate files
- `POST /api/archive/validate` — Validate file
- `POST /api/archive/bulk-rename` — Bulk rename files

### Office & Document Conversions

- `POST /api/office/text-to-pdf` — Text to PDF
- `POST /api/office/markdown-to-pdf` — Markdown to PDF
- `POST /api/office/rtf-to-pdf` — RTF to PDF (requires pandoc + wkhtmltopdf)
- `POST /api/office/html-to-pdf` — HTML to PDF (requires wkhtmltopdf)
- `POST /api/office/office-to-html` — Office to HTML (requires libreoffice)
- `POST /api/office/word-to-pdf` — DOCX to PDF (requires pandoc)
- `POST /api/office/excel-to-pdf` — XLSX to PDF (requires pandoc)
- `POST /api/office/ppt-to-pdf` — PPTX to PDF (requires pandoc)
- `POST /api/office/odt-to-pdf` — ODT to PDF (requires pandoc)

### Media Operations

- `POST /api/media/video-to-gif` — Convert video to GIF (requires ffmpeg)
- `POST /api/media/audio-convert` — Convert audio format (requires ffmpeg)
- `POST /api/media/video-convert` — Convert video format (requires ffmpeg)
- `POST /api/media/create-gif` — Create GIF from images (requires ImageMagick)

### Utility Endpoints

- `GET /api/health` — Health check
- `POST /api/upload` — Generic file upload
- `GET /api/uploads/:name` — Download uploaded file

## Example Usage (PowerShell/cURL)

### Extract PDF text:

```powershell
$form = @{
    file = Get-Item "C:\path\to\file.pdf"
}
Invoke-WebRequest -Uri "http://localhost:4010/api/pdf/text" `
    -Method Post -Form $form
```

### Compress image:

```powershell
$form = @{
    file = Get-Item "C:\path\to\image.jpg"
    quality = 80
}
Invoke-WebRequest -Uri "http://localhost:4010/api/image/compress" `
    -Method Post -Form $form
```

### Create ZIP:

```powershell
$form = @{
    files = Get-Item "C:\path\to\file1.txt", "C:\path\to\file2.txt"
}
Invoke-WebRequest -Uri "http://localhost:4010/api/archive/zip-create" `
    -Method Post -Form $form
```

## Limitations & Notes

- File upload limit: 200 MB (500 MB for archives/media)
- Text-based conversions (JSON, CSV, YAML, XML, TOML) run client-side via `FileConverters.tsx`
- Some conversions are approximate (e.g., XML↔JSON, RTF conversion)
- For production, add authentication, rate limiting, and virus scanning
- Background removal, OCR, and advanced image processing benefit from cloud services (remove.bg, Tesseract)

## Development

The server uses:
- **Express** for routing and middleware
- **multer** for file uploads
- **pdf-lib** for PDF manipulations
- **sharp** for image processing
- **adm-zip** for ZIP handling
- **jsPDF** / **marked** for document conversion helpers
- Child process `exec` for external binaries (pandoc, ffmpeg, etc.)

## Docker (Optional)

To containerize with LibreOffice, FFmpeg, and other binaries:

```dockerfile
FROM node:18-slim
RUN apt-get update && apt-get install -y \
    libreoffice ffmpeg ghostscript imagemagick qpdf pandoc wkhtmltopdf poppler-utils
WORKDIR /app
COPY server . 
RUN npm install && npm run build
EXPOSE 4010
CMD ["npm", "start"]
```

## License

MIT
