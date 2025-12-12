import { useState, useRef } from 'react';
import { Upload, Download, AlertCircle, Loader, FileText, Copy, Check } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker using unpkg CDN (more reliable than cdnjs for ES modules)
// Using a specific version that's known to work
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PDFToText() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setError('');
      setText('');
      setProgress(0);
      setPageCount(0);
    } else if (f) {
      setError('Please select a valid PDF file');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setError('');
      setText('');
      setProgress(0);
      setPageCount(0);
    } else if (f) {
      setError('Please select a valid PDF file');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setText('');
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      setPageCount(totalPages);

      let fullText = '';

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');

        fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
        setProgress(Math.round((pageNum / totalPages) * 100));
      }

      setText(fullText.trim());
    } catch (err: any) {
      console.error('PDF extraction error:', err);
      setError(err.message || 'Error extracting text from PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file?.name?.replace('.pdf', '.txt') || 'extracted.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleClear = () => {
    setFile(null);
    setText('');
    setError('');
    setProgress(0);
    setPageCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const wordCount = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
  const charCount = text.length;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative"
      >
        <label className="cursor-pointer block">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 transition-colors bg-slate-50 dark:bg-slate-800/50">
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                Click to upload PDF or drag and drop
              </p>
              <p className="text-sm text-slate-500">
                Supports any PDF file
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Selected File Info */}
      {file && (
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">{file.name}</p>
              <p className="text-sm text-slate-500">
                {(file.size / 1024).toFixed(1)} KB
                {pageCount > 0 && ` • ${pageCount} pages`}
              </p>
            </div>
          </div>
          <button onClick={handleClear} className="text-slate-500 hover:text-red-500 transition-colors">
            ✕
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Extract Button */}
      <button
        onClick={handleExtract}
        disabled={!file || loading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Extracting... {progress}%</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>Extract Text</span>
          </>
        )}
      </button>

      {/* Progress Bar */}
      {loading && (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Results */}
      {text && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span>{wordCount.toLocaleString()} words</span>
            <span>{charCount.toLocaleString()} characters</span>
            <span>{pageCount} pages</span>
          </div>

          {/* Text Output */}
          <div className="relative">
            <textarea
              value={text}
              readOnly
              rows={15}
              className="w-full input-field font-mono text-sm resize-y"
              placeholder="Extracted text will appear here..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Download as .txt</span>
            </button>
            <button
              onClick={handleCopy}
              className="btn-secondary flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
        <p className="font-medium mb-2">About this tool:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Extracts text content from PDF files directly in your browser</li>
          <li>Your files are never uploaded to any server</li>
          <li>Works with text-based PDFs (scanned images require OCR)</li>
          <li>Preserves text order as closely as possible</li>
        </ul>
      </div>
    </div>
  );
}
