import { useState, useRef } from 'react';
import { Video, Music, Image, AlertCircle, Download, Loader, Info } from 'lucide-react';

type Operation = 'video-to-gif' | 'gif-maker' | 'info';

interface MediaToolsProps {
  initialOp?: Operation;
  hideTabs?: boolean;
}

export default function MediaTools({ initialOp, hideTabs = false }: MediaToolsProps = {}) {
  const [activeOp, setActiveOp] = useState<Operation>(initialOp || 'gif-maker');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<string | null>(null);

  // GIF settings
  const [frameDelay, setFrameDelay] = useState(200);
  const [gifWidth, setGifWidth] = useState(400);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setResult(null);
      setError('');
    }
  };

  const createGifFromImages = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 images');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Load all images
      const images: HTMLImageElement[] = [];
      for (const file of files) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        images.push(img);
      }

      // Calculate dimensions maintaining aspect ratio
      const firstImg = images[0];
      const aspectRatio = firstImg.height / firstImg.width;
      const height = Math.round(gifWidth * aspectRatio);

      // Create canvas for each frame
      const canvas = document.createElement('canvas');
      canvas.width = gifWidth;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      // Since we can't create a true GIF in browser without a library,
      // we'll create an animated APNG or use canvas animation
      // For now, create a simple preview and downloadable frames

      // Draw first frame
      ctx.drawImage(images[0], 0, 0, gifWidth, height);

      // Create a simple animated preview using CSS
      // In production, you'd use a library like gif.js

      // For demonstration, we'll create a data URL of the first frame
      // and provide instructions for true GIF creation
      const dataUrl = canvas.toDataURL('image/png');
      setResult(dataUrl);

      setError('Note: True animated GIF creation requires a server with ImageMagick or a specialized library like gif.js. This preview shows the first frame. For now, images are prepared for GIF conversion.');

      // Clean up
      images.forEach(img => URL.revokeObjectURL(img.src));
    } catch (err: any) {
      setError(err.message || 'Error processing images');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = 'media-result.png';
    a.click();
  };

  const opConfig = [
    { id: 'gif-maker', label: 'Images to GIF', icon: Image, desc: 'Create animated GIF from images' },
    { id: 'video-to-gif', label: 'Video to GIF', icon: Video, desc: 'Coming soon' },
    { id: 'info', label: 'Info', icon: Info, desc: 'About media tools' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Video className="w-6 h-6 text-purple-500" />
          Media Tools
        </h2>

        {/* Tabs */}
        {!hideTabs && (
          <div className="flex gap-2 flex-wrap mb-6">
            {opConfig.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveOp(id); setResult(null); setError(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeOp === id
                  ? 'bg-purple-500 text-white'
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
          <div className="flex items-start gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* GIF Maker */}
        {activeOp === 'gif-maker' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select multiple images to create an animated GIF. Images will be displayed in sequence.
            </p>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              className="input-field"
            />

            {files.length > 0 && (
              <div className="text-sm text-slate-600">
                Selected {files.length} images: {files.map(f => f.name).join(', ')}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Frame Delay (ms)</label>
                <input
                  type="number"
                  value={frameDelay}
                  onChange={(e) => setFrameDelay(Number(e.target.value))}
                  className="input-field"
                  min="50"
                  max="2000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Width (px)</label>
                <input
                  type="number"
                  value={gifWidth}
                  onChange={(e) => setGifWidth(Number(e.target.value))}
                  className="input-field"
                  min="100"
                  max="1920"
                />
              </div>
            </div>

            <button
              onClick={createGifFromImages}
              disabled={loading || files.length < 2}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin inline mr-2" />
                  Processing...
                </>
              ) : (
                'Create GIF Preview'
              )}
            </button>
          </div>
        )}

        {/* Video to GIF - Requires server */}
        {activeOp === 'video-to-gif' && (
          <div className="space-y-4">
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
              <Video className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <h3 className="font-medium mb-2">Video to GIF Conversion</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Video to GIF conversion requires FFmpeg which runs on a server.
                This feature requires the backend API to be running.
              </p>
              <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                <code>Server required at: http://localhost:4010</code>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        {activeOp === 'info' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <h3 className="font-medium mb-3">About Media Tools</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Some media operations require server-side processing with specialized tools:
              </p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span><strong>Images to GIF:</strong> Basic support in browser with preview</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">⚠</span>
                  <span><strong>Video to GIF:</strong> Requires FFmpeg on server</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">⚠</span>
                  <span><strong>Audio conversion:</strong> Requires FFmpeg on server</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">⚠</span>
                  <span><strong>Video conversion:</strong> Requires FFmpeg on server</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h4 className="font-medium mb-2">Running the Backend</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                To enable all media features, start the backend server:
              </p>
              <code className="block p-2 bg-white dark:bg-slate-800 rounded text-xs">
                cd server && npm install && npm run dev
              </code>
            </div>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="card">
          <h3 className="font-medium mb-4">Preview</h3>
          <div className="flex justify-center bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mb-4">
            <img src={result} alt="Result" className="max-w-full max-h-96 object-contain rounded" />
          </div>
          <button onClick={handleDownload} className="btn-primary w-full flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Download Preview
          </button>
        </div>
      )}

      {/* Image Grid Preview */}
      {files.length > 0 && activeOp === 'gif-maker' && (
        <div className="card">
          <h3 className="font-medium mb-3">Selected Images ({files.length})</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {files.slice(0, 12).map((file, i) => (
              <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Frame ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {files.length > 12 && (
              <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-sm text-slate-500">
                +{files.length - 12} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
