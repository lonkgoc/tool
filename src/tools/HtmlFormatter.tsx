import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

export default function HtmlFormatter() {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [copied, setCopied] = useState(false);

  const formatHtml = (html: string): string => {
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    
    html.split(/>\s*</).forEach(node => {
      if (node.match(/^\/\w/)) indent--;
      formatted += tab.repeat(Math.max(0, indent)) + '<' + node.trim() + '>\r\n';
      if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('!')) indent++;
    });
    
    return formatted.substring(1, formatted.length - 3);
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setFormatted('');
      return;
    }
    try {
      setFormatted(formatHtml(input));
    } catch {
      setFormatted(input);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([formatted], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">HTML Formatter</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              HTML Code
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your HTML here..."
              className="w-full input-field font-mono text-sm h-48"
            />
          </div>
          <button onClick={handleFormat} className="btn-primary w-full">
            Format HTML
          </button>
        </div>
      </div>

      {formatted && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Formatted HTML</h3>
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


