import { useState, useRef } from 'react';
import { Image as ImageIcon, Copy, Check, Download, Upload } from 'lucide-react';

export default function ImageToBase64() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64, setBase64] = useState('');
  const [includeDataUrl, setIncludeDataUrl] = useState(true);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setBase64(dataUrl);
      };
      reader.readAsDataURL(f);
    }
  };

  const getOutput = () => {
    if (!base64) return '';
    return includeDataUrl ? base64 : base64.split(',')[1] || '';
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([getOutput()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image_base64.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setBase64('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-purple-500" />
          Image to Base64
        </h2>

        <label className="cursor-pointer block mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-purple-500 transition-colors">
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400">
                {file ? file.name : 'Click to upload image'}
              </p>
              {file && <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>}
            </div>
          </div>
        </label>

        {previewUrl && (
          <div className="mb-4 text-center">
            <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded border" />
          </div>
        )}

        {base64 && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="includeDataUrl"
                checked={includeDataUrl}
                onChange={(e) => setIncludeDataUrl(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="includeDataUrl" className="text-sm">
                Include data URL prefix (data:image/...)
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium">Base64 Output</label>
                <div className="flex gap-2">
                  <button onClick={handleDownload} className="btn-secondary p-2"><Download className="w-4 h-4" /></button>
                  <button onClick={handleCopy} className="btn-secondary p-2">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <textarea
                value={getOutput()}
                readOnly
                className="input-field h-32 font-mono text-xs"
              />
              <p className="text-sm text-slate-500 mt-1">
                {getOutput().length.toLocaleString()} characters
              </p>
            </div>

            <button onClick={handleClear} className="btn-secondary w-full mt-4">Clear</button>
          </>
        )}
      </div>
    </div>
  );
}
