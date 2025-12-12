import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';

export default function FakeTweet() {
  const [username, setUsername] = useState('@username');
  const [name, setName] = useState('Display Name');
  const [text, setText] = useState('What\'s happening?');
  const [likes, setLikes] = useState(0);
  const [retweets, setRetweets] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyTweet = () => {
    const tweetText = `${name} (@${username.replace('@', '')})\n${text}\n\n❤️ ${likes}  🔄 ${retweets}`;
    navigator.clipboard.writeText(tweetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTweet = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(name, 20, 30);
    ctx.fillStyle = '#536471';
    ctx.font = '14px Arial';
    ctx.fillText(username, 20, 50);
    ctx.fillStyle = '#0F1419';
    ctx.font = '16px Arial';
    ctx.fillText(text, 20, 80, 560);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tweet.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Fake Tweet Generator</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.startsWith('@') ? e.target.value : '@' + e.target.value)}
              className="w-full input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tweet Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={280}
              className="w-full input-field h-24"
              placeholder="What's happening?"
            />
            <div className="text-xs text-slate-500 mt-1">{text.length}/280</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Likes
              </label>
              <input
                type="number"
                value={likes}
                onChange={(e) => setLikes(Math.max(0, Number(e.target.value)))}
                className="w-full input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Retweets
              </label>
              <input
                type="number"
                value={retweets}
                onChange={(e) => setRetweets(Math.max(0, Number(e.target.value)))}
                className="w-full input-field"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {name[0].toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">{name}</div>
              <div className="text-sm text-slate-500">{username}</div>
            </div>
          </div>
          <div className="text-slate-900 dark:text-slate-100 mb-4 whitespace-pre-wrap">{text}</div>
          <div className="flex items-center space-x-6 text-slate-500 text-sm">
            <span>❤️ {likes}</span>
            <span>🔄 {retweets}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={downloadTweet} className="btn-primary flex-1 flex items-center justify-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
          <button onClick={copyTweet} className="btn-secondary flex items-center space-x-2">
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


