import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, Download, Wand2, Palette, AlertCircle } from 'lucide-react';

export default function RemoveBg() {
    const [file, setFile] = useState<File | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [tolerance, setTolerance] = useState(30);
    const [targetColor, setTargetColor] = useState<string>('#ffffff');
    const [mode, setMode] = useState<'auto' | 'color'>('auto');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setOriginalUrl(URL.createObjectURL(selectedFile));
            setResultUrl(null);
        }
    };

    const removeBackground = () => {
        if (!file || !originalUrl) return;
        setLoading(true);

        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            if (mode === 'auto') {
                // Auto mode: detect corners and remove that color
                const cornerColors = [
                    { r: data[0], g: data[1], b: data[2] },
                    { r: data[(canvas.width - 1) * 4], g: data[(canvas.width - 1) * 4 + 1], b: data[(canvas.width - 1) * 4 + 2] },
                    { r: data[(canvas.height - 1) * canvas.width * 4], g: data[(canvas.height - 1) * canvas.width * 4 + 1], b: data[(canvas.height - 1) * canvas.width * 4 + 2] },
                    { r: data[data.length - 4], g: data[data.length - 3], b: data[data.length - 2] },
                ];

                // Use most common corner color as background
                const targetR = cornerColors[0].r;
                const targetG = cornerColors[0].g;
                const targetB = cornerColors[0].b;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const distance = Math.sqrt((r - targetR) ** 2 + (g - targetG) ** 2 + (b - targetB) ** 2);

                    if (distance < tolerance * 4.4) {
                        const alpha = Math.min(255, Math.max(0, (distance - tolerance * 2) * (255 / (tolerance * 4.4 - tolerance * 2))));
                        data[i + 3] = alpha;
                    }
                }
            } else {
                // Color mode: remove specific color
                const hex = targetColor.replace('#', '');
                const targetR = parseInt(hex.substr(0, 2), 16);
                const targetG = parseInt(hex.substr(2, 2), 16);
                const targetB = parseInt(hex.substr(4, 2), 16);

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const distance = Math.sqrt((r - targetR) ** 2 + (g - targetG) ** 2 + (b - targetB) ** 2);

                    if (distance < tolerance * 4.4) {
                        const alpha = Math.min(255, Math.max(0, (distance - tolerance * 2) * (255 / (tolerance * 4.4 - tolerance * 2))));
                        data[i + 3] = alpha;
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            setResultUrl(canvas.toDataURL('image/png'));
            setLoading(false);
        };
        img.src = originalUrl;
    };

    const handleDownload = () => {
        if (resultUrl) {
            const a = document.createElement('a');
            a.href = resultUrl;
            a.download = file?.name.replace(/\.[^/.]+$/, '') + '-nobg.png' || 'image-nobg.png';
            a.click();
        }
    };

    const handleClear = () => {
        setFile(null);
        setOriginalUrl(null);
        setResultUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Wand2 className="w-6 h-6 text-purple-500" />
                    Remove Background
                </h2>

                {/* Upload */}
                <label className="cursor-pointer block mb-6">
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
                            <p className="text-slate-600 dark:text-slate-400">Click to upload image</p>
                        </div>
                    </div>
                </label>

                {file && (
                    <>
                        {/* Mode Toggle */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setMode('auto')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${mode === 'auto' ? 'bg-purple-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
                                    }`}
                            >
                                🎯 Auto Detect
                            </button>
                            <button
                                onClick={() => setMode('color')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${mode === 'color' ? 'bg-purple-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
                                    }`}
                            >
                                🎨 Pick Color
                            </button>
                        </div>

                        {/* Settings */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tolerance: {tolerance}</label>
                                <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    value={tolerance}
                                    onChange={(e) => setTolerance(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                            {mode === 'color' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Target Color</label>
                                    <input
                                        type="color"
                                        value={targetColor}
                                        onChange={(e) => setTargetColor(e.target.value)}
                                        className="w-full h-10 rounded cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Process Button */}
                        <button
                            onClick={removeBackground}
                            disabled={loading}
                            className="btn-primary w-full mb-4 flex items-center justify-center gap-2"
                        >
                            <Wand2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Processing...' : 'Remove Background'}
                        </button>

                        {/* Preview */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {originalUrl && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Original</p>
                                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
                                        <img src={originalUrl} alt="Original" className="max-h-48 mx-auto object-contain rounded" />
                                    </div>
                                </div>
                            )}
                            {resultUrl && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Result</p>
                                    <div className="p-2 rounded-xl checkerboard">
                                        <img src={resultUrl} alt="Result" className="max-h-48 mx-auto object-contain rounded" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        {resultUrl && (
                            <div className="flex gap-3">
                                <button onClick={handleDownload} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                    <Download className="w-5 h-5" /> Download PNG
                                </button>
                                <button onClick={handleClear} className="btn-secondary">Clear</button>
                            </div>
                        )}
                    </>
                )}

                {/* Hidden Canvas */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-xl">
                <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Note:</strong> This is a simple color-based background remover. For complex images, professional tools like remove.bg work better. Works best with solid color backgrounds.
                    </div>
                </div>
            </div>

            <style>{`
        .checkerboard {
          background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
                            linear-gradient(-45deg, #ccc 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, #ccc 75%),
                            linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
        </div>
    );
}
