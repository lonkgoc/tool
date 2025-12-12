import { useState, useRef } from 'react';
import { Upload, Download, Type, X } from 'lucide-react';

export default function MemeCaption() {
  const [file, setFile] = useState<File | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      createMeme(url);
    }
  };

  const createMeme = (imageUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Draw top text
      if (topText) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.font = 'bold 48px Impact';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(topText, canvas.width / 2, 20);
        ctx.strokeText(topText, canvas.width / 2, 20);
      }

      // Draw bottom text
      if (bottomText) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.font = 'bold 48px Impact';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
        ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setMemeUrl(url);
        }
      }, 'image/png');
    };
    img.src = imageUrl;
  };

  const handleTextChange = () => {
    if (file) {
      createMeme(URL.createObjectURL(file));
    }
  };

  const handleDownload = () => {
    if (memeUrl) {
      const a = document.createElement('a');
      a.href = memeUrl;
      a.download = 'meme.png';
      a.click();
    }
  };

  const handleClear = () => {
    setFile(null);
    setTopText('');
    setBottomText('');
    setMemeUrl(null);
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
          <div className="card">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Top Text
                </label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => {
                    setTopText(e.target.value);
                    setTimeout(handleTextChange, 100);
                  }}
                  placeholder="Top caption"
                  className="w-full input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Bottom Text
                </label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => {
                    setBottomText(e.target.value);
                    setTimeout(handleTextChange, 100);
                  }}
                  placeholder="Bottom caption"
                  className="w-full input-field"
                />
              </div>
            </div>
          </div>

          {memeUrl && (
            <div className="card">
              <img
                src={memeUrl}
                alt="Meme"
                className="w-full rounded-xl mb-4"
              />
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
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}


