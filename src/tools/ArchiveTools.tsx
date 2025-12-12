import { useState, useRef } from 'react';
import { Upload, Download, AlertCircle, Loader, Archive, FileText, Hash, GitCompare, Check, X, AlertTriangle } from 'lucide-react';
import JSZip from 'jszip';

type Operation = 'zip' | 'extract' | 'hash' | 'compare' | 'merge' | 'split';

interface ArchiveToolsProps {
  initialOp?: 'zip' | 'extract' | 'hash' | 'compare' | 'merge' | 'split';
  hideTabs?: boolean;
}

// Simple Text File Detection based on extension
const isTextFile = (name: string) => {
  const textExts = ['.txt', '.md', '.csv', '.json', '.xml', '.html', '.css', '.js', '.ts', '.py', '.java'];
  return textExts.some(ext => name.toLowerCase().endsWith(ext));
};

// Simple Tar Parser
// Header: 512 bytes
// File name: 0-100
// Size: 124-135 (octal string)
// Type: 156 ('0' or '\0' = normal file, '5' = dir)
// Magic: 257-262 ('ustar')
async function untar(arrayBuffer: ArrayBuffer) {
  const files: { name: string; blob: Blob }[] = [];
  const view = new DataView(arrayBuffer);
  let offset = 0;

  while (offset + 512 <= arrayBuffer.byteLength) {
    // Check for empty block (end of archive)
    if (view.getUint32(offset, true) === 0 && view.getUint32(offset + 4, true) === 0) {
      // Often 2 empty blocks mark end, but we can stop at one usually
      // Check next block just in case
      offset += 512;
      continue;
    }

    // Read name
    const nameBytes = new Uint8Array(arrayBuffer, offset, 100);
    // Find null terminator
    let nameEnd = 0;
    while (nameEnd < 100 && nameBytes[nameEnd] !== 0) nameEnd++;
    const name = new TextDecoder().decode(nameBytes.subarray(0, nameEnd));

    // Read size (octal) at 124, length 11 + space
    const sizeBytes = new Uint8Array(arrayBuffer, offset + 124, 12);
    let sizeStr = new TextDecoder().decode(sizeBytes).trim();
    // Remove nulls just in case
    sizeStr = sizeStr.replace(/\0/g, '');
    const size = parseInt(sizeStr, 8);

    // Read type flag at 156
    const typeFlag = view.getUint8(offset + 156);

    // '0' (48) or '\0' (0) is normal file
    // '5' (53) is directory
    const isFile = typeFlag === 0 || typeFlag === 48;

    offset += 512; // Advance past header

    if (isNaN(size)) {
      // Invalid size, probably end or corrupt
      break;
    }

    if (isFile && size >= 0) {
      const fileData = new Uint8Array(arrayBuffer, offset, size);
      files.push({ name, blob: new Blob([fileData]) });
    }

    // Advance past content, rounded up to 512
    offset += Math.ceil(size / 512) * 512;
  }
  return files;
}

export default function ArchiveTools({ initialOp, hideTabs = false }: ArchiveToolsProps = {}) {
  const [activeOp, setActiveOp] = useState<Operation>(initialOp || 'zip');
  const [files, setFiles] = useState<File[]>([]);
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [result, setResult] = useState<any>(null);
  const [chunkSize, setChunkSize] = useState(1048576); // 1MB
  const [extractedFiles, setExtractedFiles] = useState<{ name: string; blob: Blob }[]>([]);

  const handleZipCreate = async () => {
    if (files.length === 0) {
      setError('Please select files to zip');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const zip = new JSZip();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        zip.file(file.name, arrayBuffer);
      }

      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // Download the zip
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'archive.zip';
      a.click();
      URL.revokeObjectURL(url);

      setResult({ type: 'zip', message: `Created ZIP with ${files.length} files` });
    } catch (err: any) {
      setError(err.message || 'Error creating ZIP');
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async () => {
    if (!singleFile) {
      setError('Please select an archive file');
      return;
    }
    setLoading(true);
    setError('');
    setWarning('');
    setResult(null);
    setExtractedFiles([]);

    try {
      const arrayBuffer = await singleFile.arrayBuffer();
      let extracted: { name: string; blob: Blob }[] = [];
      let type = 'archive';

      if (singleFile.name.toLowerCase().endsWith('.tar') || singleFile.type === 'application/x-tar') {
        extracted = await untar(arrayBuffer);
        type = 'Tar';
      } else if (singleFile.name.toLowerCase().endsWith('.rar') || singleFile.name.toLowerCase().endsWith('.7z')) {
        throw new Error('RAR and 7z extraction is not currently supported in the browser. Please use a ZIP or TAR file tool.');
      } else {
        // Assume Zip
        try {
          const zip = new JSZip();
          const contents = await zip.loadAsync(arrayBuffer);
          for (const [filename, file] of Object.entries(contents.files)) {
            if (!file.dir) {
              const blob = await file.async('blob');
              extracted.push({ name: filename, blob });
            }
          }
          type = 'Zip';
        } catch (zErr) {
          throw new Error('Could not read archive. Ensure it is a valid ZIP file.');
        }
      }

      setExtractedFiles(extracted);
      setResult({ type: 'extract', message: `Extracted ${extracted.length} files from ${type} archive` });
    } catch (err: any) {
      setError(err.message || 'Error extracting archive.');
    } finally {
      setLoading(false);
    }
  };

  const downloadExtractedFile = (file: { name: string; blob: Blob }) => {
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.split('/').pop() || file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllExtracted = async () => {
    for (const file of extractedFiles) {
      downloadExtractedFile(file);
      await new Promise(r => setTimeout(r, 100));
    }
  };

  const handleHash = async () => {
    if (!singleFile) {
      setError('Please select a file');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const arrayBuffer = await singleFile.arrayBuffer();

      // Calculate multiple hashes using Web Crypto API
      const sha256Buffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const sha1Buffer = await crypto.subtle.digest('SHA-1', arrayBuffer);

      const toHex = (buffer: ArrayBuffer) =>
        Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

      setResult({
        type: 'hash',
        data: {
          filename: singleFile.name,
          size: singleFile.size,
          'SHA-256': toHex(sha256Buffer),
          'SHA-1': toHex(sha1Buffer),
        }
      });
    } catch (err: any) {
      setError(err.message || 'Error generating hash');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (files.length < 2) {
      setError('Please select exactly 2 files to compare');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const [file1, file2] = files;
      const buffer1 = await file1.arrayBuffer();
      const buffer2 = await file2.arrayBuffer();

      const arr1 = new Uint8Array(buffer1);
      const arr2 = new Uint8Array(buffer2);

      let identical = arr1.length === arr2.length;
      if (identical) {
        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i]) {
            identical = false;
            break;
          }
        }
      }

      // Also calculate hashes for comparison
      const hash1 = await crypto.subtle.digest('SHA-256', buffer1);
      const hash2 = await crypto.subtle.digest('SHA-256', buffer2);
      const toHex = (buffer: ArrayBuffer) =>
        Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

      setResult({
        type: 'compare',
        data: {
          file1: { name: file1.name, size: file1.size, hash: toHex(hash1) },
          file2: { name: file2.name, size: file2.size, hash: toHex(hash2) },
          identical,
          sizeDiff: Math.abs(file1.size - file2.size),
        }
      });
    } catch (err: any) {
      setError(err.message || 'Error comparing files');
    } finally {
      setLoading(false);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 files to merge');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Check if all files are PDFs
      const isPdfMerge = files.every(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');

      // Check if all files are Text
      const isTextMerge = files.every(f => isTextFile(f.name) || f.type.startsWith('text/'));

      if (isPdfMerge) {
        try {
          // Dynamic import to prevent crash if pdf-lib integration issue
          const { PDFDocument } = await import('pdf-lib');
          const mergedPdf = await PDFDocument.create();
          for (const file of files) {
            const buffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(buffer);
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(page => mergedPdf.addPage(page));
          }
          const pdfBytes = await mergedPdf.save();
          const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'merged.pdf';
          a.click();
          URL.revokeObjectURL(url);

          setResult({ type: 'merge', message: `Merged ${files.length} PDF files` });
          return;
        } catch (pdfErr) {
          console.warn("PDF merge failed, falling back to binary merge", pdfErr);
        }
      }

      if (isTextMerge) {
        const texts = await Promise.all(files.map(f => f.text()));
        const mergedText = texts.join('\n\n');
        const blob = new Blob([mergedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged.txt';
        a.click();
        URL.revokeObjectURL(url);
        setResult({ type: 'merge', message: `Merged ${files.length} text files` });
        return;
      }

      // Default Binary Merge
      const buffers = await Promise.all(files.map(f => f.arrayBuffer()));
      const totalSize = buffers.reduce((sum, b) => sum + b.byteLength, 0);
      const merged = new Uint8Array(totalSize);

      let offset = 0;
      for (const buffer of buffers) {
        merged.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
      }

      const blob = new Blob([merged]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isPdfMerge ? 'merged.pdf' : 'merged_file.bin';
      a.click();
      URL.revokeObjectURL(url);

      setResult({ type: 'merge', message: `Merged ${files.length} files (${(totalSize / 1024).toFixed(1)} KB)` });
    } catch (err: any) {
      setError(err.message || 'Error merging files');
    } finally {
      setLoading(false);
    }
  };

  const handleSplit = async () => {
    if (!singleFile) {
      setError('Please select a file');
      return;
    }
    if (chunkSize < 1024) {
      setError('Chunk size must be at least 1 KB');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const buffer = await singleFile.arrayBuffer();
      const arr = new Uint8Array(buffer);
      const chunks: Blob[] = [];

      for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        chunks.push(new Blob([chunk]));
      }

      // Download each chunk
      for (let i = 0; i < chunks.length; i++) {
        const url = URL.createObjectURL(chunks[i]);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${singleFile.name}.part${(i + 1).toString().padStart(3, '0')}`;
        a.click();
        URL.revokeObjectURL(url);
        await new Promise(r => setTimeout(r, 100));
      }

      setResult({ type: 'split', message: `Split into ${chunks.length} parts` });
    } catch (err: any) {
      setError(err.message || 'Error splitting file');
    } finally {
      setLoading(false);
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setResult(null);
    }
  };

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSingleFile(file);
    setResult(null);
    setExtractedFiles([]);
    setError('');
    setWarning('');

    if (file && (file.name.toLowerCase().endsWith('.rar') || file.name.toLowerCase().endsWith('.7z'))) {
      setWarning('Note: You selected a RAR or 7Z file. These formats are not supported in the browser due to technical limitations. Please convert to ZIP or TAR if possible.');
    }
  };

  const opConfig = [
    { id: 'zip', label: 'Create ZIP', icon: Archive },
    { id: 'extract', label: 'Extract', icon: FileText },
    { id: 'hash', label: 'Hash', icon: Hash },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'merge', label: 'Merge', icon: Archive },
    { id: 'split', label: 'Split', icon: FileText },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Archive className="w-6 h-6 text-blue-500" />
          Archive & File Tools
        </h2>

        {/* Tabs */}
        {!hideTabs && (
          <div className="flex gap-2 flex-wrap mb-6">
            {opConfig.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveOp(id); setResult(null); setError(''); setWarning(''); setExtractedFiles([]); }}
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

        {/* Error & Warning */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl mb-4">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {warning && (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl mb-4">
            <AlertTriangle className="w-5 h-5" />
            {warning}
          </div>
        )}

        {/* ZIP Create */}
        {activeOp === 'zip' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select multiple files to compress into a ZIP archive.
            </p>
            <input type="file" multiple onChange={handleFilesChange} className="input-field" />
            {files.length > 0 && (
              <div className="text-sm text-slate-600">Selected {files.length} files</div>
            )}
            <button onClick={handleZipCreate} disabled={loading || files.length === 0} className="btn-primary w-full disabled:opacity-50">
              {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Creating...</> : 'Create ZIP'}
            </button>
          </div>
        )}

        {/* Extract */}
        {activeOp === 'extract' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Extract files from a ZIP or TAR archive.
            </p>
            <input type="file" accept=".zip,.tar,.gz,.rar,.7z" onChange={handleSingleFileChange} className="input-field" />
            <button onClick={handleExtract} disabled={loading || !singleFile || !!warning} className="btn-primary w-full disabled:opacity-50">
              {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Extracting...</> : 'Extract Archive'}
            </button>

            {extractedFiles.length > 0 && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Extracted Files ({extractedFiles.length})</span>
                  <button onClick={downloadAllExtracted} className="btn-secondary text-sm">
                    Download All
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {extractedFiles.map((file, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <button onClick={() => downloadExtractedFile(file)} className="btn-secondary p-1">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hash */}
        {activeOp === 'hash' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Calculate SHA-256 and SHA-1 hashes of a file.
            </p>
            <input type="file" onChange={handleSingleFileChange} className="input-field" />
            <button onClick={handleHash} disabled={loading || !singleFile} className="btn-primary w-full disabled:opacity-50">
              {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Calculating...</> : 'Generate Hash'}
            </button>
          </div>
        )}

        {/* Compare */}
        {activeOp === 'compare' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Compare two files to check if they are identical.
            </p>
            <input type="file" multiple onChange={handleFilesChange} className="input-field" />
            {files.length > 0 && (
              <div className="text-sm text-slate-600">Selected {files.length} files (need exactly 2)</div>
            )}
            <button onClick={handleCompare} disabled={loading || files.length !== 2} className="btn-primary w-full disabled:opacity-50">
              {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Comparing...</> : 'Compare Files'}
            </button>
          </div>
        )}

        {/* Merge */}
        {activeOp === 'merge' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Merge multiple files. smart-merge for PDFs and Text files. Binary concatenation for others.
            </p>
            <input type="file" multiple onChange={handleFilesChange} className="input-field" />
            {files.length > 0 && (
              <div className="text-sm text-slate-600">Selected {files.length} files</div>
            )}
            <button onClick={handleMerge} disabled={loading || files.length < 2} className="btn-primary w-full disabled:opacity-50">
              {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Merging...</> : 'Merge Files'}
            </button>
          </div>
        )}

        {/* Split */}
        {activeOp === 'split' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Split a large file into smaller chunks.
            </p>
            <input type="file" onChange={handleSingleFileChange} className="input-field" />
            <div>
              <label className="block text-sm font-medium mb-2">
                Chunk Size: {(chunkSize / 1024 / 1024).toFixed(1)} MB
              </label>
              <input
                type="range"
                min={102400}
                max={10485760}
                step={102400}
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <button onClick={handleSplit} disabled={loading || !singleFile} className="btn-primary w-full disabled:opacity-50">
              {loading ? <><Loader className="w-5 h-5 animate-spin inline mr-2" />Splitting...</> : 'Split File'}
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="card mt-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {result.message && (
              <div className="text-green-600 font-medium mb-2">{result.message}</div>
            )}
            {result.type === 'hash' && result.data && (
              <div className="space-y-2 mt-2">
                <div className="text-sm"><strong>File:</strong> {result.data.filename}</div>
                <div className="text-sm"><strong>Size:</strong> {(result.data.size / 1024).toFixed(1)} KB</div>
                <div className="mt-3">
                  <div className="text-sm font-medium">SHA-256:</div>
                  <code className="block p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs break-all">{result.data['SHA-256']}</code>
                </div>
                <div>
                  <div className="text-sm font-medium">SHA-1:</div>
                  <code className="block p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs break-all">{result.data['SHA-1']}</code>
                </div>
              </div>
            )}
            {result.type === 'compare' && result.data && (
              <div className="space-y-3 mt-2">
                <div className={`flex items-center gap-2 text-lg font-bold ${result.data.identical ? 'text-green-600' : 'text-red-600'}`}>
                  {result.data.identical ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                  {result.data.identical ? 'Files are identical' : 'Files are different'}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>{result.data.file1.name}</strong><br />
                    Size: {(result.data.file1.size / 1024).toFixed(1)} KB
                  </div>
                  <div>
                    <strong>{result.data.file2.name}</strong><br />
                    Size: {(result.data.file2.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
