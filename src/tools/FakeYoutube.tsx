import { useState, useRef } from 'react';
import { Upload, Download, Copy, Check, X } from 'lucide-react';

export default function FakeYoutube() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('Amazing Video Title');
  const [channel, setChannel] = useState('Channel Name');
  const [views, setViews] = useState(1000000);
  const [timeAgo, setTimeAgo] = useState('2 days ago');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const copyThumbnail = () => {
    const thumbnailText = `${title}\n${channel} • ${views.toLocaleString()} views • ${timeAgo}`;
    navigator.clipboard.writeText(thumbnailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadThumbnail = () => {
    if (imageUrl) {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Add YouTube-style overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(title, 20, canvas.height - 60);
        ctx.font = '16px Arial';
        ctx.fillText(`${channel} • ${views.toLocaleString()} views • ${timeAgo}`, 20, canvas.height - 30);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'youtube-thumbnail.png';
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      };
      img.src = imageUrl;
    }
  };

  const clear = () => {
    setFile(null);
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Fake YouTube Thumbnail</h2>

        {!imageUrl ? (
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
                    Click to upload thumbnail image
                  </p>
                </div>
              </div>
            </label>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Views
                  </label>
                  <input
                    type="number"
                    value={views}
                    onChange={(e) => setViews(Math.max(0, Number(e.target.value)))}
                    className="w-full input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Time Ago
                  </label>
                  <input
                    type="text"
                    value={timeAgo}
                    onChange={(e) => setTimeAgo(e.target.value)}
                    placeholder="2 days ago"
                    className="w-full input-field"
                  />
                </div>
              </div>
            </div>

            <div className="bg-black rounded-xl overflow-hidden mb-6 relative">
              <img src={imageUrl} alt="Thumbnail" className="w-full" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="text-white font-semibold text-lg mb-1">{title}</div>
                <div className="text-gray-300 text-sm">
                  {channel} • {views.toLocaleString()} views • {timeAgo}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={downloadThumbnail} className="btn-primary flex-1 flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              <button onClick={copyThumbnail} className="btn-secondary flex items-center space-x-2">
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button onClick={clear} className="btn-secondary flex items-center space-x-2">
                <X className="w-5 h-5" />
                <span>Clear</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


