import { useState, useRef } from 'react';
import { Upload, Download, X, Image as ImageIcon } from 'lucide-react';

const sizes = [16, 32, 48, 64, 128, 256];

export default function FaviconGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [favicons, setFavicons] = useState<Record<number, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      generateFavicons(selectedFile);
    }
  };

  const generateFavicons = (imageFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const newFavicons: Record<number, string> = {};
        
        sizes.forEach(size => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = size;
          canvas.height = size;
          ctx.drawImage(img, 0, 0, size, size);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                newFavicons[size] = url;
                setFavicons({ ...newFavicons });
              }
            },
            'image/png',
            1.0
          );
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  };

  const handleDownload = (size: number) => {
    const url = favicons[size];
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `favicon-${size}x${size}.png`;
      a.click();
    }
  };

  const handleDownloadAll = () => {
    sizes.forEach(size => {
      setTimeout(() => handleDownload(size), size * 10);
    });
  };

  const handleClear = () => {
    setFile(null);
    setFavicons({});
    Object.values(favicons).forEach(url => URL.revokeObjectURL(url));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 transition-colors">
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400">
                Click to upload image or drag and drop
              </p>
            </div>
          </div>
        </label>
      </div>

      {file && (
        <>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> For best results, use a square image (1:1 aspect ratio). 
              The tool will generate favicons in multiple standard sizes.
            </p>
          </div>

          {Object.keys(favicons).length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Generated Favicons</h3>
                <button onClick={handleDownloadAll} className="btn-primary text-sm">
                  Download All
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sizes.map(size => (
                  <div key={size} className="card text-center">
                    <div className="mb-3">
                      {favicons[size] ? (
                        <img
                          src={favicons[size]}
                          alt={`${size}x${size}`}
                          className="w-16 h-16 mx-auto object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {size} × {size}px
                    </p>
                    {favicons[size] && (
                      <button
                        onClick={() => handleDownload(size)}
                        className="btn-secondary text-xs w-full"
                      >
                        Download
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">HTML Code</p>
                <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 overflow-x-auto">
{`<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-128x128.png">`}
                </pre>
              </div>

              <div className="flex gap-3">
                <button onClick={handleClear} className="btn-secondary flex items-center space-x-2">
                  <X className="w-5 h-5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}


