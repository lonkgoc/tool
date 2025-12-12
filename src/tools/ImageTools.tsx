import { useState, useRef } from 'react';
import { Upload, Download, AlertCircle, Loader, Image as ImageIcon, X } from 'lucide-react';

type Operation = 'compress' | 'resize' | 'crop' | 'convert' | 'text' | 'svg2png' | 'png2ico';

interface ImageToolsProps {
  initialOp?: 'compress' | 'resize' | 'crop' | 'convert' | 'text' | 'svg2png' | 'png2ico';
  hideTabs?: boolean;
}

export default function ImageTools({ initialOp, hideTabs = false }: ImageToolsProps = {}) {
  const [activeOp, setActiveOp] = useState<Operation>(initialOp || 'compress');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  // Crop
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(100);
  const [cropH, setCropH] = useState(100);

  // Convert
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('png');

  // Compress
  const [quality, setQuality] = useState(0.8);

  // Text
  const [textContent, setTextContent] = useState('Your Text');
  const [textX, setTextX] = useState(50);
  const [textY, setTextY] = useState(50);
  const [textSize, setTextSize] = useState(32);
  const [textColor, setTextColor] = useState('#FFFFFF');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setError('');
      setResult(null);
      const url = URL.createObjectURL(f);
      setPreview(url);

      // Get dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
        setCropW(img.width);
        setCropH(img.height);
      };
      img.src = url;
    } else if (f) {
      setError('Please select a valid image file');
    }
  };

  const processImage = async () => {
    if (!file) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const img = new Image();
      img.src = preview!;
      await new Promise((resolve) => img.onload = resolve);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      switch (activeOp) {
        case 'compress': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality)
          );
          setResult(URL.createObjectURL(blob));
          break;
        }

        case 'resize': {
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), file.type, 0.95)
          );
          setResult(URL.createObjectURL(blob));
          break;
        }

        case 'crop': {
          canvas.width = cropW;
          canvas.height = cropH;
          ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), file.type, 0.95)
          );
          setResult(URL.createObjectURL(blob));
          break;
        }

        case 'convert': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const mimeType = `image/${format}`;
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), mimeType, 0.95)
          );
          setResult(URL.createObjectURL(blob));
          break;
        }

        case 'text': {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          ctx.font = `${textSize}px Arial`;
          ctx.fillStyle = textColor;
          ctx.textAlign = 'left';
          const x = (textX / 100) * canvas.width;
          const y = (textY / 100) * canvas.height;
          ctx.fillText(textContent, x, y);
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), file.type, 0.95)
          );
          setResult(URL.createObjectURL(blob));
          break;
        }

        case 'svg2png': {
          canvas.width = width || 512;
          canvas.height = height || 512;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), 'image/png', 1.0)
          );
          setResult(URL.createObjectURL(blob));
          break;
        }

        case 'png2ico': {
          // Generate multiple sizes for ICO (16, 32, 48)
          const sizes = [16, 32, 48];
          const images: ImageData[] = [];

          for (const size of sizes) {
            canvas.width = size;
            canvas.height = size;
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
            images.push(ctx.getImageData(0, 0, size, size));
          }

          // For ICO, we'll just output the 32x32 as PNG (true ICO requires binary format)
          canvas.width = 32;
          canvas.height = 32;
          ctx.drawImage(img, 0, 0, 32, 32);
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), 'image/png', 1.0)
          );
          setResult(URL.createObjectURL(blob));
          break;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error processing image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    const ext = activeOp === 'convert' ? format :
      activeOp === 'compress' ? 'jpg' :
        activeOp === 'png2ico' ? 'png' : 'png';
    a.download = `${file?.name.split('.')[0] || 'image'}-${activeOp}.${ext}`;
    a.click();
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspect && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Image Tools</h2>

      {/* Operation Tabs */}
      {!hideTabs && (
        <div className="flex gap-2 flex-wrap">
          {(['compress', 'resize', 'crop', 'convert', 'text', 'svg2png', 'png2ico'] as const).map(op => (
            <button
              key={op}
              onClick={() => { setActiveOp(op); setResult(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeOp === op
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
            >
              {op === 'svg2png' ? 'SVG → PNG' :
                op === 'png2ico' ? 'PNG → ICO' :
                  op.charAt(0).toUpperCase() + op.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* File Upload */}
      <label className="cursor-pointer block">
        <input
          ref={fileInputRef}
          type="file"
          accept={activeOp === 'svg2png' ? '.svg,image/svg+xml' : 'image/*'}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 transition-colors">
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600 dark:text-slate-400">
              Click to upload {activeOp === 'svg2png' ? 'SVG' : 'image'} or drag and drop
            </p>
            {file && (
              <p className="text-sm text-blue-600 mt-2">{file.name}</p>
            )}
          </div>
        </div>
      </label>

      {/* Operation Options */}
      {file && (
        <div className="card space-y-4">
          {activeOp === 'compress' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {activeOp === 'resize' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Width</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Height</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="input-field"
                    disabled={maintainAspect}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                />
                <span className="text-sm">Maintain aspect ratio</span>
              </label>
            </div>
          )}

          {activeOp === 'crop' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">X Position</label>
                <input type="number" value={cropX} onChange={(e) => setCropX(Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Y Position</label>
                <input type="number" value={cropY} onChange={(e) => setCropY(Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Width</label>
                <input type="number" value={cropW} onChange={(e) => setCropW(Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Height</label>
                <input type="number" value={cropH} onChange={(e) => setCropH(Number(e.target.value))} className="input-field" />
              </div>
            </div>
          )}

          {activeOp === 'convert' && (
            <div>
              <label className="block text-sm font-medium mb-2">Output Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="input-field"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
          )}

          {activeOp === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Text</label>
                <input
                  type="text"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">X Position: {textX}%</label>
                  <input type="range" min="0" max="100" value={textX} onChange={(e) => setTextX(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Y Position: {textY}%</label>
                  <input type="range" min="0" max="100" value={textY} onChange={(e) => setTextY(Number(e.target.value))} className="w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Font Size: {textSize}px</label>
                  <input type="range" min="12" max="120" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-10 rounded" />
                </div>
              </div>
            </div>
          )}

          {(activeOp === 'svg2png' || activeOp === 'png2ico') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Width</label>
                <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Height</label>
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="input-field" />
              </div>
            </div>
          )}

          <button
            onClick={processImage}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2 inline" />
                Processing...
              </>
            ) : (
              `Process Image`
            )}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="card space-y-4">
          <h3 className="font-semibold">Result</h3>
          <div className="flex justify-center bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
            <img src={result} alt="Result" className="max-w-full max-h-96 object-contain rounded" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleDownload} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download
            </button>
            <button onClick={handleClear} className="btn-secondary">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
