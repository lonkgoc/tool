import { useState, useRef } from 'react';
import { Upload, Copy, X, Pipette } from 'lucide-react';

export default function ColorPicker() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [colorFormat, setColorFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setImageUrl(url);
      setFile(selectedFile);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageUrl || !canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const rect = e.currentTarget.getBoundingClientRect();
      const imageAspect = img.width / img.height;
      const rectAspect = rect.width / rect.height;

      let renderWidth = rect.width;
      let renderHeight = rect.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imageAspect > rectAspect) {
        // Image is wider than container - fits width, gaps on top/bottom
        renderHeight = rect.width / imageAspect;
        offsetY = (rect.height - renderHeight) / 2;
      } else {
        // Image is taller than container - fits height, gaps on left/right
        renderWidth = rect.height * imageAspect;
        offsetX = (rect.width - renderWidth) / 2;
      }

      const clickX = e.clientX - rect.left - offsetX;
      const clickY = e.clientY - rect.top - offsetY;

      // Check if click is within the actual image area
      if (clickX < 0 || clickX > renderWidth || clickY < 0 || clickY > renderHeight) {
        return;
      }

      const x = Math.floor(clickX * (img.width / renderWidth));
      const y = Math.floor(clickY * (img.height / renderHeight));

      const imageData = ctx.getImageData(x, y, 1, 1);
      const [r, g, b] = imageData.data;

      setSelectedColor(`rgb(${r}, ${g}, ${b})`);
    };
    img.src = imageUrl;
  };

  const rgbToHex = (rgb: string) => {
    const match = rgb.match(/\d+/g);
    if (!match) return '';
    const r = parseInt(match[0]).toString(16).padStart(2, '0');
    const g = parseInt(match[1]).toString(16).padStart(2, '0');
    const b = parseInt(match[2]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  const rgbToHsl = (rgb: string) => {
    const match = rgb.match(/\d+/g);
    if (!match) return '';
    let r = parseInt(match[0]) / 255;
    let g = parseInt(match[1]) / 255;
    let b = parseInt(match[2]) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const getColorValue = () => {
    if (!selectedColor) return '';
    if (colorFormat === 'hex') return rgbToHex(selectedColor);
    if (colorFormat === 'hsl') return rgbToHsl(selectedColor);
    return selectedColor;
  };

  const handleCopy = () => {
    const colorValue = getColorValue();
    if (colorValue) {
      navigator.clipboard.writeText(colorValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setFile(null);
    setImageUrl(null);
    setSelectedColor(null);
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

      {imageUrl && (
        <>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center space-x-2">
              <Pipette className="w-4 h-4" />
              <span>Click anywhere on the image to pick a color</span>
            </p>
          </div>

          <div className="relative">
            <img
              src={imageUrl}
              alt="Color picker"
              onClick={handleImageClick}
              className="w-full max-h-96 object-contain rounded-xl border border-slate-200 dark:border-slate-700 cursor-crosshair"
            />
          </div>

          {selectedColor && (
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-20 h-20 rounded-xl border-2 border-slate-300 dark:border-slate-600"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <select
                        value={colorFormat}
                        onChange={(e) => setColorFormat(e.target.value as 'hex' | 'rgb' | 'hsl')}
                        className="input-field text-sm"
                      >
                        <option value="hex">HEX</option>
                        <option value="rgb">RGB</option>
                        <option value="hsl">HSL</option>
                      </select>
                      <button
                        onClick={handleCopy}
                        className="btn-secondary text-sm flex items-center space-x-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {getColorValue()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="card text-center">
                  <div className="text-slate-600 dark:text-slate-400 mb-1">HEX</div>
                  <div className="font-mono font-semibold">{rgbToHex(selectedColor)}</div>
                </div>
                <div className="card text-center">
                  <div className="text-slate-600 dark:text-slate-400 mb-1">RGB</div>
                  <div className="font-mono font-semibold">{selectedColor}</div>
                </div>
                <div className="card text-center">
                  <div className="text-slate-600 dark:text-slate-400 mb-1">HSL</div>
                  <div className="font-mono font-semibold">{rgbToHsl(selectedColor)}</div>
                </div>
              </div>

              <button onClick={handleClear} className="btn-secondary flex items-center space-x-2">
                <X className="w-5 h-5" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

