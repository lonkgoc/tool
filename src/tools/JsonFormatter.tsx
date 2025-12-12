import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJSON = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      setOutput('');
    }
  };

  const minifyJSON = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJSON = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          JSON Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"key": "value"}'
          className="w-full h-64 input-field font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={formatJSON} className="btn-primary">
          Format JSON
        </button>
        <button onClick={minifyJSON} className="btn-secondary">
          Minify JSON
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {output && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Formatted Output
            </label>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="btn-secondary p-2"
                aria-label="Copy"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
              <button
                onClick={downloadJSON}
                className="btn-secondary p-2"
                aria-label="Download"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 input-field font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}

