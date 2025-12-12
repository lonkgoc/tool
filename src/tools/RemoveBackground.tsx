import { useState, useRef } from 'react';
import { Upload, Download, X, Wand2 } from 'lucide-react';

export default function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      removeBackground(selectedFile);
    }
  };

  const removeBackground = (imageFile: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple background removal using edge detection and color similarity
        // This is a basic implementation - for production, use a proper ML model
        const threshold = 30;
        const edgeThreshold = 50;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Get surrounding pixels for edge detection
          const x = (i / 4) % canvas.width;
          const y = Math.floor((i / 4) / canvas.width);

          if (x > 0 && x < canvas.width - 1 && y > 0 && y < canvas.height - 1) {
            const neighbors = [
              data[((y - 1) * canvas.width + x) * 4],
              data[((y + 1) * canvas.width + x) * 4],
              data[(y * canvas.width + (x - 1)) * 4],
              data[(y * canvas.width + (x + 1)) * 4],
            ];

            const avgR = neighbors.reduce((sum, val) => sum + val, 0) / neighbors.length;
            const diff = Math.abs(r - avgR);

            // If pixel is similar to neighbors and close to white/light colors, make transparent
            if (diff < edgeThreshold && (r + g + b) / 3 > 200) {
              data[i + 3] = 0; // Make transparent
            } else if (r > 240 && g > 240 && b > 240) {
              // Remove very light/white backgrounds
              data[i + 3] = 0;
            }
          } else {
            // Edge pixels - remove if light
            if ((r + g + b) / 3 > 200) {
              data[i + 3] = 0;
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setProcessedUrl(url);
            }
            setIsProcessing(false);
          },
          'image/png'
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  };

  const handleDownload = () => {
    if (processedUrl) {
      const a = document.createElement('a');
      a.href = processedUrl;
      a.download = file?.name.replace(/\.[^/.]+$/, '') + '-no-bg.png' || 'no-background.png';
      a.click();
    }
  };

  const handleClear = () => {
    setFile(null);
    setProcessedUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> This is a basic background removal tool. For best results with complex images, 
          consider using professional AI-powered services.
        </p>
      </div>

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

      {isProcessing && (
        <div className="text-center py-8">
          <Wand2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-pulse" />
          <p className="text-slate-600 dark:text-slate-400">Processing image...</p>
        </div>
      )}

      {file && processedUrl && !isProcessing && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Original</p>
              <img
                src={URL.createObjectURL(file)}
                alt="Original"
                className="w-full max-h-96 object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white"
              />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Background Removed</p>
              <div className="w-full max-h-96 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-4">
                <img
                  src={processedUrl}
                  alt="Processed"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleDownload} className="btn-primary flex-1 flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
            <button onClick={handleClear} className="btn-secondary flex items-center space-x-2">
              <X className="w-5 h-5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


