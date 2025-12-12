import { useState } from 'react';
import { Image as ImageIcon, ArrowRight, Download, Upload } from 'lucide-react';

export default function Base64ToImage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError('');
  };

  const getImageSrc = () => {
    if (!input.trim()) return '';
    if (input.startsWith('data:image')) return input.trim();
    // Try to guess mime type or default to png
    return `data:image/png;base64,${input.trim()}`;
  };

  const handleDownload = () => {
    const src = getImageSrc();
    if (!src) {
      setError("Invalid Base64 string");
      return;
    }
    const a = document.createElement('a');
    a.href = src;
    a.download = 'decoded-image.png';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-purple-500" />
          Base64 to Image
        </h2>

        <div className="mb-4">
          <label className="font-medium block mb-2">Base64 String</label>
          <textarea
            value={input}
            onChange={handleInputChange}
            className="input-field h-40 font-mono text-sm"
            placeholder="Paste your Base64 encoded image string here..."
          />
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl">{error}</div>}

        {input.trim() && (
          <>
            <div className="mb-4">
              <label className="font-medium block mb-2">Preview</label>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl flex justify-center">
                <img src={getImageSrc()} alt="Decoded" className="max-w-full max-h-96 object-contain" onError={() => setError('Invalid image data')} />
              </div>
            </div>

            <button onClick={handleDownload} className="btn-primary w-full flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> Download Image
            </button>
          </>
        )}
      </div>
    </div>
  );
}
