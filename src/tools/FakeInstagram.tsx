import { useState, useRef } from 'react';
import { Upload, Download, Copy, Check, X } from 'lucide-react';

export default function FakeInstagram() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [username, setUsername] = useState('username');
  const [caption, setCaption] = useState('Add a caption...');
  const [likes, setLikes] = useState(0);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const copyPost = () => {
    const postText = `${username}\n${caption}\n\n❤️ ${likes} likes`;
    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPost = () => {
    // In a real implementation, you'd render the full Instagram post UI to canvas
    alert('Download feature - would render Instagram post design to image');
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
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Fake Instagram Post</h2>

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
                    Click to upload image
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
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full input-field h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Likes: {likes}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  value={likes}
                  onChange={(e) => setLikes(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-6">
              <div className="p-3 flex items-center space-x-3 border-b border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {username[0].toUpperCase()}
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">{username}</div>
              </div>
              <img src={imageUrl} alt="Post" className="w-full" />
              <div className="p-3">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-xl">❤️</span>
                  <span className="text-xl">💬</span>
                  <span className="text-xl">📤</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {likes.toLocaleString()} likes
                </div>
                <div className="text-slate-900 dark:text-slate-100">
                  <span className="font-semibold">{username}</span> {caption}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={downloadPost} className="btn-primary flex-1 flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              <button onClick={copyPost} className="btn-secondary flex items-center space-x-2">
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


