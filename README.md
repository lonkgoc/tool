# ToolHub Pro - 256 Free Online Tools

A beautiful, production-ready, single-page React application featuring 256 free online tools. Built with Vite, React 18, TypeScript, and Tailwind CSS.

## ✨ Features

- **256+ Free Tools** - Comprehensive collection of productivity, finance, health, file conversion, and utility tools
- **Optional Backend API** - Advanced tools (PDF, image, office, archive, media conversion) with optional Express backend
- **100% Frontend by Default** - No backend required for 200+ tools; entirely optional for advanced features
- **Instant Loading** - Fast, responsive, and optimized for performance
- **Beautiful UI** - Modern glassmorphism design with dark/light mode
- **Fully Responsive** - Mobile-first design that works on all devices
- **Accessible** - ARIA labels, keyboard navigation, and semantic HTML
- **SEO Optimized** - Clean URLs, meta tags, and proper structure
- **Modular Architecture** - Easy to add new tools and customize existing ones

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- (Optional) Backend requirements: See [QUICK_START.md](./QUICK_START.md) for backend setup

### Installation

**Frontend only:**
```bash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**With Backend (Advanced Tools):**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Start both (requires concurrently)
npm run dev:full
# OR start separately:
# Terminal 1: npm run dev
# Terminal 2: cd server && npm run dev
```

**📚 For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md)**

## 📁 Project Structure

```
toolhub-pro/
├── public/
│   ├── ads.txt              # Google AdSense ads.txt file
│   └── index.html           # HTML entry point
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── AdUnit.tsx
│   │   ├── AffiliateCorner.tsx
│   │   └── ToolWrapper.tsx
│   ├── pages/               # Page components
│   │   ├── Home.tsx
│   │   ├── ToolPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── Privacy.tsx
│   │   └── Disclaimer.tsx
│   ├── tools/               # Tool implementations (256+)
│   │   ├── index.tsx        # Tool router with 50+ new mappings
│   │   ├── PdfToText.tsx
│   │   ├── PdfTools.tsx     # Unified PDF tool
│   │   ├── ImageTools.tsx   # Unified image tool
│   │   ├── ArchiveTools.tsx # Unified archive tool
│   │   ├── OfficeTools.tsx  # Office converter
│   │   ├── MediaTools.tsx   # Media converter
│   │   ├── FileConverters.tsx # Enhanced converter (17 formats)
│   │   └── ... (250+ fully implemented tools)
│   ├── data/
│   │   └── tools.ts         # Tool data and metadata
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── server/                  # Optional Express backend (NEW)
│   ├── src/
│   │   ├── index.ts         # Main Express app
│   │   ├── routes/
│   │   │   ├── pdf.ts       # 11 PDF endpoints
│   │   │   ├── image.ts     # 10 image endpoints
│   │   │   ├── archive.ts   # 13 archive endpoints
│   │   │   ├── office.ts    # 9 office conversion endpoints
│   │   │   └── media.ts     # 4 media endpoints
│   │   └── utils/
│   │       ├── pdfHelpers.ts
│   │       ├── imageHelpers.ts
│   │       ├── archiveHelpers.ts
│   │       ├── officeHelpers.ts
│   │       └── mediaHelpers.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── README.md            # API documentation
│   └── .gitignore
├── QUICK_START.md           # Setup & testing guide (NEW)
├── TOOLS_IMPLEMENTATION.md  # Complete tool status (NEW)
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 🛠️ Implemented Tools (256+)

### Core Tools (Frontend-only, no backend needed)
1. **PDF to Text** - Extract text from PDF files
2. **QR Code Generator** - Generate QR codes from text/URLs
3. **Password Generator** - Create secure passwords
4. **BMI + BMR + TDEE** - Calculate body metrics
5. **JSON Formatter** - Format and validate JSON
6. **Base64 Encode/Decode** - Encode and decode Base64
7. **URL Encode/Decode** - Encode and decode URLs
8. **Word Counter** - Count words, characters, paragraphs
9. **Case Converter** - Convert text case (upper, lower, camel, etc.)
10. **Lorem Ipsum Generator** - Generate placeholder text
... and **190+ more** core tools

### Advanced Tools (Optional Backend API)
**PDF Operations (11 tools):**
- PDF to Text, PDF Merge, PDF Split, PDF Rotate, PDF Watermark, PDF Compress, PDF Password Protection

**Image Processing (10 tools):**
- Image Compress, Image Resize, Image Crop, Image Convert, Add Text to Image, SVG to PNG, PNG to ICO

**Archive Management (13 tools):**
- ZIP/TAR/7Z/RAR Extract & Create, File Merge/Split, Hash Generation, Duplicate Finder, File Comparator

**Office Conversions (9 tools):**
- Text/Markdown/RTF/HTML to PDF, Office to HTML, Word/Excel/PPT/ODT to PDF

**Media Processing (4 tools):**
- Video to GIF, Audio/Video Conversion, GIF Creator

**Data Converters (17 tools):**
- JSON/CSV/YAML/XML/TOML conversions, Base64, URL encoding, HTML entities

**See [TOOLS_IMPLEMENTATION.md](./TOOLS_IMPLEMENTATION.md) for complete tool list and status**

## 🎨 Customization

### Backend Setup (Optional)

For advanced tools like PDF processing, image conversion, and archive utilities, follow the backend setup:

**Quick Backend Setup:**
```bash
cd server
npm install

# Recommended: Install optional binaries for full functionality
# Windows: choco install pandoc ffmpeg ghostscript imagemagick
# macOS:   brew install pandoc ffmpeg ghostscript imagemagick
# Linux:   apt-get install pandoc ffmpeg ghostscript imagemagick

# Start backend server (port 4010)
npm run dev
```

For complete setup instructions and available endpoints, see:
- **[QUICK_START.md](./QUICK_START.md)** - Setup guide with testing examples
- **[server/README.md](./server/README.md)** - API documentation
- **[TOOLS_IMPLEMENTATION.md](./TOOLS_IMPLEMENTATION.md)** - Complete tool status

### Google AdSense

1. Replace `ca-pub-XXXXXXXXXXXXXXXX` in `index.html` with your AdSense publisher ID
2. Update `public/ads.txt` with your actual publisher ID
3. Update ad slot IDs in `src/components/AdUnit.tsx`

### Affiliate Links

Edit `src/data/tools.ts` to add affiliate links to specific tools:

```typescript
{
  id: "111",
  name: "PDF to Text",
  // ...
  affiliateLinks: [
    { name: "SmallPDF", url: "https://smallpdf.com", description: "Professional PDF tools" }
  ]
}
```

### Dark Mode

Dark mode is automatically saved to localStorage. Users can toggle it via the navbar button.

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Vite and configure the build
4. Deploy!

**Build Command:** `npm run build`  
**Output Directory:** `dist`

### Netlify

1. Push your code to GitHub
2. Import your repository in [Netlify](https://netlify.com)
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

### Manual Deployment

```bash
# Build the project
npm run build

# The dist/ folder contains the production build
# Upload dist/ to your hosting provider
```

## 🔧 Environment Variables

No environment variables are required. The app is 100% frontend.

## 📝 Adding New Tools

1. Create a new component in `src/tools/YourToolName.tsx`
2. Export it as default
3. Add it to `src/tools/index.tsx`:

```typescript
'your-tool-slug': lazy(() => import('./YourToolName')),
```

4. The tool will automatically be available at `/tools/your-tool-slug`

## 🎯 Categories

1. Productivity & Planning (40 tools)
2. Finance & Calculators (40 tools)
3. Health & Fitness (30 tools)
4. File Converters & Editors (70 tools)
5. Text & Code Tools (20 tools)
6. Image & Design Tools (10 tools)
7. Fun & Entertainment (30 tools)
8. Generators & Makers (10 tools)
9. Web & SEO Tools (10 tools)
10. Time & Utilities (6 tools)

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add more tool implementations
- Improve existing tools
- Fix bugs
- Enhance UI/UX
- Add new features

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 🎉 Credits

Built with:
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

---

**Made with ❤️ for the community**

