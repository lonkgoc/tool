import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

export default function JavaScriptFormatter() {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJavaScript = (code: string): string => {
    // Basic JavaScript formatting
    let formatted = code
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\s*:\s*/g, ': ')
      .replace(/,\s*/g, ', ')
      .replace(/\n\s*\n/g, '\n');
    
    // Add indentation
    let lines = formatted.split('\n');
    let indent = 0;
    lines = lines.map(line => {
      if (line.includes('}')) indent = Math.max(0, indent - 1);
      const indented = '  '.repeat(indent) + line.trim();
      if (line.includes('{')) indent++;
      return indented;
    });
    
    return lines.join('\n').trim();
  };

  const handleFormat = () => {
    setError('');
    if (!input.trim()) {
      setFormatted('');
      return;
    }
    try {
      setFormatted(formatJavaScript(input));
    } catch (err) {
      setError('Error formatting JavaScript');
      setFormatted('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([formatted], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">JavaScript Formatter</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              JavaScript Code
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JavaScript code here..."
              className="w-full input-field font-mono text-sm h-48"
            />
          </div>
          <button onClick={handleFormat} className="btn-primary w-full">
            Format JavaScript
          </button>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-800 dark:text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {formatted && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Formatted JavaScript</h3>
            <div className="flex gap-2">
              <button onClick={copyToClipboard} className="btn-secondary flex items-center space-x-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button onClick={download} className="btn-secondary flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <textarea
            value={formatted}
            readOnly
            className="w-full input-field font-mono text-sm h-96"
          />
        </div>
      )}
    </div>
  );
}


