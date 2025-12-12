import { useState } from 'react';
import { Copy, Check, Download, Upload, AlertCircle, Loader } from 'lucide-react';

export default function HashGenerator() {
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const hashAlgorithms = ['SHA-256', 'SHA-1', 'SHA-512', 'SHA-384'];

  const generateHash = async () => {
    setError('');
    setHashes({});
    setLoading(true);

    try {
      let data: ArrayBuffer | Uint8Array;

      if (inputType === 'text') {
        if (!text.trim()) {
          setError('Please enter text to hash');
          setLoading(false);
          return;
        }
        const encoder = new TextEncoder();
        data = encoder.encode(text).buffer;
      } else {
        if (!file) {
          setError('Please select a file');
          setLoading(false);
          return;
        }
        data = await file.arrayBuffer();
      }

      const results: Record<string, string> = {};

      for (const algorithm of hashAlgorithms) {
        const hashBuffer = await crypto.subtle.digest(algorithm, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        results[algorithm] = hashHex;
      }

      setHashes(results);
    } catch (err: any) {
      setError(err.message || 'Error generating hash');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (hash: string, algorithm: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(algorithm);
    setTimeout(() => setCopied(''), 2000);
  };

  const downloadHashes = () => {
    let content = '';
    if (inputType === 'text') {
      content = `Text: ${text}\n\n`;
    } else {
      content = `File: ${file?.name}\n\n`;
    }
    content += Object.entries(hashes)
      .map(([algo, hash]) => `${algo}: ${hash}`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hashes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            setInputType('text');
            setFile(null);
            setHashes({});
          }}
          className={`p-4 rounded-lg font-medium transition-colors ${inputType === 'text'
            ? 'bg-blue-600 text-white'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
        >
          Text Input
        </button>
        <button
          onClick={() => {
            setInputType('file');
            setText('');
            setHashes({});
          }}
          className={`p-4 rounded-lg font-medium transition-colors ${inputType === 'file'
            ? 'bg-blue-600 text-white'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
        >
          File Input
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        {inputType === 'text' ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Text to Hash
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text here..."
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white font-mono text-sm"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                  setHashes({});
                }
              }}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer space-y-2 block">
              <Upload className="w-12 h-12 mx-auto text-slate-400" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                {file ? file.name : 'Click to upload file or drag and drop'}
              </p>
              <p className="text-sm text-slate-500">Any file type</p>
            </label>
          </div>
        )}

        <button
          onClick={generateHash}
          disabled={loading || (!text && inputType === 'text') || (!file && inputType === 'file')}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader className="w-5 h-5 animate-spin" /> : null}
          {loading ? 'Generating...' : 'Generate Hashes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {Object.keys(hashes).length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Generated Hashes</h3>
            <button
              onClick={downloadHashes}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          <div className="space-y-3">
            {hashAlgorithms.map((algorithm) => (
              <div key={algorithm} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {algorithm}
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hashes[algorithm] || ''}
                    readOnly
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(hashes[algorithm], algorithm)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {copied === algorithm ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
