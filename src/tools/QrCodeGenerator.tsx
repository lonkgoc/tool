import { useState, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';

export default function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(200);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (text.trim()) {
      const encoded = encodeURIComponent(text);
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`);
    } else {
      setQrUrl('');
    }
  }, [text, size]);

  const handleDownload = () => {
    if (qrUrl) {
      const a = document.createElement('a');
      a.href = qrUrl;
      a.download = 'qrcode.png';
      a.click();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Enter text or URL
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text, URL, or any data..."
          className="w-full h-32 input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Size: {size}px
        </label>
        <input
          type="range"
          min="100"
          max="500"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {qrUrl && (
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-xl shadow-lg">
            <img src={qrUrl} alt="QR Code" className="w-full h-auto" />
          </div>
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download QR Code</span>
          </button>
        </div>
      )}

      {!text && (
        <div className="text-center py-12 text-slate-400">
          <p>Enter text above to generate QR code</p>
        </div>
      )}
    </div>
  );
}

