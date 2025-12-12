import { useState, useRef, useEffect } from 'react';
import { Upload, Download, AlertCircle, Loader, FileText, Merge, Split, RotateCw, Droplets, Lock, Image as ImageIcon, FileSpreadsheet, Presentation } from 'lucide-react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { asBlob } from 'html-docx-js-typescript';
import * as XLSX from 'xlsx';
import PptxGenJS from 'pptxgenjs';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

type Tab = 'merge' | 'split' | 'rotate' | 'watermark' | 'images' | 'pdf2word' | 'pdf2excel' | 'pdf2ppt';

interface PdfToolsProps {
  initialTab?: Tab;
  hideTabs?: boolean;
}

export default function PdfTools({ initialTab, hideTabs = false }: PdfToolsProps = {}) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab || 'merge');
  const [files, setFiles] = useState<File[]>([]);
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);

  // Rotate params
  const [rotateAngle, setRotateAngle] = useState(90);

  // Watermark params
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkSize, setWatermarkSize] = useState(48);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);

  const extractTextPages = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Basic layout reconstruction
      const items = textContent.items as any[];
      items.sort((a, b) => b.transform[5] - a.transform[5]); // Sort by Y

      let pageText = '';
      let lastY = -1;

      items.forEach(item => {
        if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        }
        pageText += item.str + ' ';
        lastY = item.transform[5];
      });

      pages.push(pageText);
      setProgress(Math.round((i / pdf.numPages) * 100));
    }
    return pages;
  };

  const handlePdfToWord = async () => {
    if (!singleFile) {
      setError('Please select a PDF file');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('');
    setResult(null);
    setProgress(0);

    try {
      const pageTexts = await extractTextPages(singleFile);
      let html = '<!DOCTYPE html><html><body>';

      pageTexts.forEach((text, i) => {
        html += text.split('\n').map(line => `<p>${line}</p>`).join('');
        if (i < pageTexts.length - 1) html += '<br style="page-break-after: always;" />';
      });

      html += '</body></html>';

      const blob = await asBlob(html);
      setResult(blob as Blob);
      setStatus('Converted PDF to Word (.docx)');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error converting PDF to Word');
    } finally {
      setLoading(false);
    }
  };

  const handlePdfToExcel = async () => {
    if (!singleFile) {
      setError('Please select a PDF file');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('');
    setResult(null);
    setProgress(0);

    try {
      const pageTexts = await extractTextPages(singleFile);
      const wb = XLSX.utils.book_new();

      // Try to guess tables - extremely naive but better than nothing
      // We look for lines with multiple gaps
      const rows: string[][] = [];

      pageTexts.join('\n').split('\n').forEach(line => {
        // Split by multiple spaces (common in PDFs for columns)
        const cells = line.trim().split(/\s{2,}|\t/);
        if (cells.length > 0) rows.push(cells);
      });

      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, "PDF Data");

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      setResult(blob);
      setStatus('Converted PDF to Excel (.xlsx)');
    } catch (err: any) {
      setError(err.message || 'Error converting PDF to Excel');
    } finally {
      setLoading(false);
    }
  };

  const handlePdfToPpt = async () => {
    if (!singleFile) {
      setError('Please select a PDF file');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('');
    setResult(null);

    try {
      const pptx = new PptxGenJS();

      // For PPT, users often prefer "Images to Slides" if layout is complex
      // We will do a hybrid: Extract text per page and put it on a slide
      // Ideally we would rasterize pages to images but that requires canvas + pdfjs rendering which is heavy
      // Let's stick to text for now, but cleaner

      const pageTexts = await extractTextPages(singleFile);

      pageTexts.forEach((text, i) => {
        const slide = pptx.addSlide();
        slide.addText(`Page ${i + 1}`, { x: 0.5, y: 0.2, fontSize: 10, color: '666666' });
        slide.addText(text, { x: 0.5, y: 0.5, w: '90%', h: '85%', fontSize: 12, wrap: true });
      });

      const pptBlob = await pptx.write({ outputType: 'blob' });
      setResult(pptBlob as Blob);
      setStatus('Converted PDF to PowerPoint (.pptx)');
    } catch (err: any) {
      setError(err.message || 'Error converting PDF to PPT');
    } finally {
      setLoading(false);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('');
    setResult(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      setResult(blob);
      setStatus(`Successfully merged ${files.length} PDFs`);
    } catch (err: any) {
      setError(err.message || 'Error merging PDFs');
    } finally {
      setLoading(false);
    }
  };

  const handleSplit = async () => {
    if (!singleFile) {
      setError('Please select a PDF file');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('');

    try {
      const arrayBuffer = await singleFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();

      // Create a zip-like download of individual pages
      // For simplicity, we'll create a multi-page info and let user know
      const splitPdfs: Blob[] = [];

      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(page);
        const pdfBytes = await newPdf.save();
        splitPdfs.push(new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }));
      }

      // Download each page
      for (let i = 0; i < splitPdfs.length; i++) {
        const url = URL.createObjectURL(splitPdfs[i]);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${singleFile.name.replace('.pdf', '')}_page_${i + 1}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        await new Promise(r => setTimeout(r, 100)); // Small delay between downloads
      }

      setStatus(`Split into ${pageCount} individual PDF files`);
    } catch (err: any) {
      setError(err.message || 'Error splitting PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleRotate = async () => {
    if (!singleFile) {
      setError('Please select a PDF file');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('');
    setResult(null);

    try {
      const arrayBuffer = await singleFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();

      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotateAngle));
      });

      const pdfBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      setResult(blob);
      setStatus(`Rotated all ${pages.length} pages by ${rotateAngle}°`);
    } catch (err: any) {
      setError(err.message || 'Error rotating PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleWatermark = async () => {
    if (!singleFile) {
      setError('Please select a PDF file');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('');
    setResult(null);

    try {
      const arrayBuffer = await singleFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - (watermarkText.length * watermarkSize * 0.25),
          y: height / 2,
          size: watermarkSize,
          color: rgb(0.5, 0.5, 0.5),
          opacity: watermarkOpacity,
          rotate: degrees(-45),
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      setResult(blob);
      setStatus(`Added watermark to ${pages.length} pages`);
    } catch (err: any) {
      setError(err.message || 'Error adding watermark');
    } finally {
      setLoading(false);
    }
  };

  const handleImagesToPdf = async () => {
    if (imageFiles.length === 0) {
      setError('Please select image files');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('');
    setResult(null);

    try {
      const pdf = await PDFDocument.create();

      for (const imageFile of imageFiles) {
        const arrayBuffer = await imageFile.arrayBuffer();
        let image;

        if (imageFile.type === 'image/png') {
          image = await pdf.embedPng(arrayBuffer);
        } else if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
          image = await pdf.embedJpg(arrayBuffer);
        } else {
          // Convert other formats to PNG via canvas
          const img = new Image();
          const url = URL.createObjectURL(imageFile);
          img.src = url;
          await new Promise(r => img.onload = r);

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);

          const pngDataUrl = canvas.toDataURL('image/png');
          const pngData = atob(pngDataUrl.split(',')[1]);
          const pngArray = new Uint8Array(pngData.length);
          for (let i = 0; i < pngData.length; i++) {
            pngArray[i] = pngData.charCodeAt(i);
          }
          image = await pdf.embedPng(pngArray);
          URL.revokeObjectURL(url);
        }

        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      setResult(blob);
      setStatus(`Created PDF from ${imageFiles.length} images`);
    } catch (err: any) {
      setError(err.message || 'Error creating PDF from images');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    const ext = activeTab === 'pdf2word' ? '.doc' : activeTab === 'pdf2excel' ? '.csv' : '.pdf';
    a.download = `${activeTab}-result${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setFiles(Array.from(fileList));
      setResult(null);
      setStatus('');
    }
  };

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSingleFile(e.target.files?.[0] || null);
    setResult(null);
    setStatus('');
  };

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setImageFiles(Array.from(fileList));
      setResult(null);
      setStatus('');
    }
  };

  const tabConfig = [
    { id: 'merge', label: 'Merge', icon: Merge },
    { id: 'split', label: 'Split', icon: Split },
    { id: 'rotate', label: 'Rotate', icon: RotateCw },
    { id: 'watermark', label: 'Watermark', icon: Droplets },
    { id: 'images', label: 'Images to PDF', icon: ImageIcon },

  ] as const;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">PDF Tools</h2>

      {/* Tabs */}
      {!hideTabs && (
        <div className="flex gap-2 flex-wrap">
          {tabConfig.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id as Tab); setResult(null); setStatus(''); setError(''); setSingleFile(null); setFiles([]); setImageFiles([]); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === id
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Error/Status */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}
      {status && (
        <div className="text-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
          {status}
        </div>
      )}

      {/* Merge */}
      {activeTab === 'merge' && (
        <div className="card space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select multiple PDF files to merge into one document.
          </p>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFilesChange}
            className="input-field"
          />
          {files.length > 0 && (
            <div className="text-sm text-slate-600">
              Selected {files.length} files: {files.map(f => f.name).join(', ')}
            </div>
          )}
          <button onClick={handleMerge} disabled={loading || files.length < 2} className="btn-primary w-full disabled:opacity-50">
            {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Merging...</> : 'Merge PDFs'}
          </button>
        </div>
      )}

      {/* Split */}
      {activeTab === 'split' && (
        <div className="card space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Split a multi-page PDF into individual page files.
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleSingleFileChange}
            className="input-field"
          />
          <button onClick={handleSplit} disabled={loading || !singleFile} className="btn-primary w-full disabled:opacity-50">
            {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Splitting...</> : 'Split PDF'}
          </button>
        </div>
      )}

      {/* Rotate */}
      {activeTab === 'rotate' && (
        <div className="card space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Rotate all pages in a PDF document.
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleSingleFileChange}
            className="input-field"
          />
          <div>
            <label className="block text-sm font-medium mb-2">Rotation Angle</label>
            <select value={rotateAngle} onChange={(e) => setRotateAngle(Number(e.target.value))} className="input-field">
              <option value={90}>90° Clockwise</option>
              <option value={180}>180°</option>
              <option value={270}>270° (90° Counter-clockwise)</option>
            </select>
          </div>
          <button onClick={handleRotate} disabled={loading || !singleFile} className="btn-primary w-full disabled:opacity-50">
            {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Rotating...</> : 'Rotate PDF'}
          </button>
        </div>
      )}

      {/* Watermark */}
      {activeTab === 'watermark' && (
        <div className="card space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Add a text watermark to all pages.
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleSingleFileChange}
            className="input-field"
          />
          <div>
            <label className="block text-sm font-medium mb-2">Watermark Text</label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Font Size: {watermarkSize}px</label>
              <input type="range" min="12" max="100" value={watermarkSize} onChange={(e) => setWatermarkSize(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Opacity: {Math.round(watermarkOpacity * 100)}%</label>
              <input type="range" min="0.1" max="1" step="0.1" value={watermarkOpacity} onChange={(e) => setWatermarkOpacity(Number(e.target.value))} className="w-full" />
            </div>
          </div>
          <button onClick={handleWatermark} disabled={loading || !singleFile} className="btn-primary w-full disabled:opacity-50">
            {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Adding...</> : 'Add Watermark'}
          </button>
        </div>
      )}

      {/* Images to PDF */}
      {activeTab === 'images' && (
        <div className="card space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Convert multiple images to a single PDF document.
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageFilesChange}
            className="input-field"
          />
          {imageFiles.length > 0 && (
            <div className="text-sm text-slate-600">
              Selected {imageFiles.length} images
            </div>
          )}
          <button onClick={handleImagesToPdf} disabled={loading || imageFiles.length === 0} className="btn-primary w-full disabled:opacity-50">
            {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Creating...</> : 'Create PDF'}
          </button>
        </div>
      )}

      {/* PDF to Word */}
      {activeTab === 'pdf2word' && (
        <div className="card space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Extract text from PDF and convert to editable Word document. (Basic formatting)
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleSingleFileChange}
            className="input-field"
          />
          <button onClick={handlePdfToWord} disabled={loading || !singleFile} className="btn-primary w-full disabled:opacity-50">
            {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Converting... {progress}%</> : 'Convert to Word'}
          </button>
        </div>
      )}

      {/* PDF to Excel */}
      {activeTab === 'pdf2excel' && (
        <div className="card space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Extract text from PDF and convert to CSV/Excel. (Attempts to detect tables)
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleSingleFileChange}
            className="input-field"
          />
          <button onClick={handlePdfToExcel} disabled={loading || !singleFile} className="btn-primary w-full disabled:opacity-50">
            {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Converting... {progress}%</> : 'Convert to Excel'}
          </button>
        </div>
      )}

      {/* PDF to PPT */}
      {activeTab === 'pdf2ppt' && (
        <div className="card space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Convert PDF pages to PowerPoint slides.
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleSingleFileChange}
            className="input-field"
          />
          <button onClick={handlePdfToPpt} disabled={loading || !singleFile} className="btn-primary w-full disabled:opacity-50">
            {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Converting... {progress}%</> : 'Convert to PowerPoint'}
          </button>
        </div>
      )}

      {/* Download Result */}
      {result && (
        <button onClick={handleDownload} className="btn-primary w-full flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Download Result
        </button>
      )}


      {/* Info */}
      <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
        <p className="font-medium mb-2">Features:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>All processing happens in your browser - files never leave your device</li>
          <li>Merge multiple PDFs into one document</li>
          <li>Split PDFs into individual pages</li>
          <li>Rotate pages by 90°, 180°, or 270°</li>
          <li>Add customizable text watermarks</li>
          <li>Convert images (JPG, PNG) to PDF</li>
          <li>Extract text from PDFs to Word/Excel (Basic)</li>
        </ul>
      </div>

    </div >
  );
}
