import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<{ header: any; payload: any } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const decode = () => {
    try {
      setError('');
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      setDecoded({ header, payload });
    } catch (e) {
      setError((e as Error).message);
      setDecoded(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          JWT Token
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste JWT token here..."
          className="w-full h-32 input-field font-mono text-sm"
        />
      </div>

      <button onClick={decode} className="btn-primary w-full">
        Decode JWT
      </button>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {decoded && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Header</h3>
              <button
                onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2))}
                className="btn-secondary p-2"
                aria-label="Copy header"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-xs overflow-x-auto">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Payload</h3>
              <button
                onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2))}
                className="btn-secondary p-2"
                aria-label="Copy payload"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-xs overflow-x-auto">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

