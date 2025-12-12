import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generate = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUID());
    }
    setUuids(newUuids);
  };

  const copyToClipboard = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    setCopied(uuid);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Number of UUIDs: {count}
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <button onClick={generate} className="btn-primary w-full flex items-center justify-center space-x-2">
        <RefreshCw className="w-5 h-5" />
        <span>Generate UUIDs</span>
      </button>

      {uuids.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Generated UUIDs
            </span>
            <button onClick={copyAll} className="btn-secondary text-sm">
              {copied === 'all' ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          <div className="space-y-2">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg"
              >
                <code className="font-mono text-sm flex-1">{uuid}</code>
                <button
                  onClick={() => copyToClipboard(uuid)}
                  className="ml-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                  aria-label="Copy UUID"
                >
                  {copied === uuid ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

