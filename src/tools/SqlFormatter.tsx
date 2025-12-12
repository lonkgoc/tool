import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [copied, setCopied] = useState(false);

  const formatSql = (sql: string): string => {
    // Basic SQL formatting
    return sql
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*\(\s*/g, ' (')
      .replace(/\s*\)\s*/g, ') ')
      .replace(/\bSELECT\b/gi, '\nSELECT')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bJOIN\b/gi, '\nJOIN')
      .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
      .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
      .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
      .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
      .replace(/\bORDER BY\b/gi, '\nORDER BY')
      .replace(/\bHAVING\b/gi, '\nHAVING')
      .replace(/\bUNION\b/gi, '\nUNION')
      .trim();
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setFormatted('');
      return;
    }
    setFormatted(formatSql(input));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([formatted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">SQL Formatter</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              SQL Query
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onBlur={handleFormat}
              placeholder="Paste your SQL query here..."
              className="w-full input-field font-mono text-sm h-48"
            />
          </div>
          <button onClick={handleFormat} className="btn-primary w-full">
            Format SQL
          </button>
        </div>
      </div>

      {formatted && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Formatted SQL</h3>
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


