import { useState } from 'react';
import { Upload, AlertCircle, Loader, FileText, Download, Info, FileSpreadsheet, Presentation } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { marked } from 'marked';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

type Operation = 'text2pdf' | 'md2pdf' | 'html2pdf' | 'word2pdf' | 'excel2pdf' | 'ppt2pdf' | 'odt2pdf' | 'info';

interface OfficeToolsProps {
  initialMode?: Operation;
  hideTabs?: boolean;
}

export default function OfficeTools({ initialMode, hideTabs = false }: OfficeToolsProps = {}) {
  const [activeOp, setActiveOp] = useState<Operation>(initialMode || 'text2pdf');
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Blob | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setError('');
    setResult(null);
    setTextContent(''); // Clear previous text content

    // Read file content based on type
    try {
      if (activeOp === 'text2pdf' || activeOp === 'md2pdf' || activeOp === 'html2pdf') {
        const text = await f.text();
        setTextContent(text);
      }
    } catch (err) {
      setError('Error reading file');
    }
  };

  const textToPdf = async (text: string, isMarkdown = false) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    let content = text;

    if (isMarkdown) {
      const html = await marked(text);
      content = html.replace(/<[^>]*>/g, '\n').replace(/\n\s*\n/g, '\n\n');
    }

    doc.setFontSize(11);
    const lines = doc.splitTextToSize(content, maxWidth);

    let y = margin;
    const lineHeight = 5;

    for (let i = 0; i < lines.length; i++) {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines[i], margin, y);
      y += lineHeight;
    }

    return doc.output('blob');
  };

  const htmlToPdf = async (html: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<li>/gi, '• ')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n\s*\n\s*\n/g, '\n\n');

    doc.setFontSize(11);
    const lines = doc.splitTextToSize(text.trim(), maxWidth);

    let y = margin;
    const lineHeight = 5;
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 0; i < lines.length; i++) {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines[i], margin, y);
      y += lineHeight;
    }

    return doc.output('blob');
  };

  const wordToPdf = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return htmlToPdf(result.value);
  };

  const excelToPdf = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    let fullHtml = '';

    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const html = XLSX.utils.sheet_to_html(sheet);
      fullHtml += `<h1>${sheetName}</h1>${html}<br/><br/>`;
    });

    return htmlToPdf(fullHtml);
  };

  const pptToPdf = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const zip = new JSZip();
    const content = await zip.loadAsync(arrayBuffer);

    // Find all slide files
    const slideFiles = Object.keys(content.files).filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'));

    // Sort slides numerically (slide1.xml, slide2.xml, etc.)
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.replace('ppt/slides/slide', '').replace('.xml', '')) || 0;
      const numB = parseInt(b.replace('ppt/slides/slide', '').replace('.xml', '')) || 0;
      return numA - numB;
    });

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    for (let i = 0; i < slideFiles.length; i++) {
      if (i > 0) doc.addPage();

      const slideXml = await content.files[slideFiles[i]].async('text');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(slideXml, 'text/xml');

      // Extract text from <a:t> elements
      const textElements = xmlDoc.getElementsByTagName('a:t');
      let slideText = '';
      for (let j = 0; j < textElements.length; j++) {
        slideText += textElements[j].textContent + '\n';
      }

      doc.setFontSize(16);
      doc.text(`Slide ${i + 1}`, margin, margin);

      doc.setFontSize(12);
      const lines = doc.splitTextToSize(slideText, maxWidth);
      let y = margin + 15;

      lines.forEach((line: string) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 7;
      });
    }

    return doc.output('blob');
  };

  const odtToPdf = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const zip = new JSZip();
    const content = await zip.loadAsync(arrayBuffer);
    const contentXml = await content.file('content.xml')?.async('text');

    if (!contentXml) throw new Error('Invalid ODT file: content.xml not found');

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(contentXml, 'text/xml');

    // ODT text is usually in text:p, text:h, etc.
    const textParams = xmlDoc.getElementsByTagName('text:p');
    const headers = xmlDoc.getElementsByTagName('text:h');

    let fullText = '';

    // Simple sequential extraction (Note: this loses structure if headers are interspersed, but good enough for generic text)
    // Actually, let's iterate all elements and filter
    const allText = xmlDoc.getElementsByTagName('office:text')[0];
    if (allText) {
      fullText = allText.textContent || '';
    } else {
      // Fallback
      for (let i = 0; i < textParams.length; i++) {
        fullText += textParams[i].textContent + '\n\n';
      }
    }

    return textToPdf(fullText);
  };

  const handleConvert = async () => {
    if (!file && !textContent.trim()) {
      setError('No content to convert');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let pdfBlob: Blob;

      switch (activeOp) {
        case 'text2pdf':
          pdfBlob = await textToPdf(textContent);
          break;
        case 'md2pdf':
          pdfBlob = await textToPdf(textContent, true);
          break;
        case 'html2pdf':
          pdfBlob = await htmlToPdf(textContent);
          break;
        case 'word2pdf':
          if (!file) throw new Error('No file selected');
          pdfBlob = await wordToPdf(file);
          break;
        case 'excel2pdf':
          if (!file) throw new Error('No file selected');
          pdfBlob = await excelToPdf(file);
          break;
        case 'ppt2pdf':
          if (!file) throw new Error('No file selected');
          pdfBlob = await pptToPdf(file);
          break;
        case 'odt2pdf':
          if (!file) throw new Error('No file selected');
          pdfBlob = await odtToPdf(file);
          break;
        default:
          throw new Error('Unknown operation');
      }

      setResult(pdfBlob);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    const ext = file?.name ? file.name.split('.')[0] : 'document';
    a.download = `${ext}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAcceptType = () => {
    switch (activeOp) {
      case 'text2pdf': return '.txt';
      case 'md2pdf': return '.md,.markdown';
      case 'html2pdf': return '.html,.htm';
      case 'word2pdf': return '.docx';
      case 'excel2pdf': return '.xlsx,.xls,.csv';
      case 'ppt2pdf': return '.pptx';
      case 'odt2pdf': return '.odt';
      default: return '*';
    }
  };

  const opConfig = [
    { id: 'text2pdf', label: 'Text → PDF', icon: FileText },
    { id: 'md2pdf', label: 'Markdown → PDF', icon: FileText },
    { id: 'html2pdf', label: 'HTML → PDF', icon: FileText },
    { id: 'word2pdf', label: 'Word → PDF', icon: FileText },
    { id: 'excel2pdf', label: 'Excel → PDF', icon: FileSpreadsheet },
    { id: 'ppt2pdf', label: 'PPT → PDF', icon: Presentation },
    { id: 'odt2pdf', label: 'ODT → PDF', icon: FileText },
    { id: 'info', label: 'Info', icon: Info },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-500" />
          Office & Document Tools
        </h2>

        {/* Tabs */}
        {!hideTabs && (
          <div className="flex gap-2 flex-wrap mb-6">
            {opConfig.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveOp(id as Operation); setResult(null); setError(''); setFile(null); setTextContent(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeOp === id
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

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl mb-4">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Conversion Tools */}
        {activeOp !== 'info' ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Convert {activeOp.replace('2pdf', ' to PDF').toUpperCase()}.
              Processing happens entirely in your browser.
            </p>

            <input
              type="file"
              accept={getAcceptType()}
              onChange={handleFileChange}
              className="input-field"
            />

            {file && (
              <div className="text-sm text-blue-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}

            {(activeOp === 'text2pdf' || activeOp === 'md2pdf' || activeOp === 'html2pdf') && textContent && (
              <div>
                <label className="block text-sm font-medium mb-1">Content Preview</label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={8}
                  className="input-field font-mono text-sm"
                />
              </div>
            )}

            <button
              onClick={handleConvert}
              disabled={(!file && !textContent) || loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin inline mr-2" />
                  Converting...
                </>
              ) : (
                `Convert to PDF`
              )}
            </button>
          </div>
        ) : (
          /* Info Tab */
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <h3 className="font-medium mb-3">Supported Conversions (Client-Side)</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span><strong>Text/MD/HTML → PDF:</strong> Native support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span><strong>Word (.docx) → PDF:</strong> Uses Mammoth.js</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span><strong>Excel (.xlsx) → PDF:</strong> Uses SheetJS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span><strong>PPT (.pptx):</strong> Extract text slides</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span><strong>ODT (.odt):</strong> Extract text content</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Download Result */}
      {result && (
        <div className="card">
          <h3 className="font-medium mb-4">Conversion Complete!</h3>
          <button onClick={handleDownload} className="btn-primary w-full flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
