import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const cursors = [
  'auto', 'default', 'none', 'context-menu', 'help', 'pointer', 'progress', 'wait',
  'cell', 'crosshair', 'text', 'vertical-text', 'alias', 'copy', 'move', 'no-drop',
  'not-allowed', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize',
  'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize',
  'se-resize', 'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize',
  'zoom-in', 'zoom-out'
];

export default function CssCursor() {
  const [selectedCursor, setSelectedCursor] = useState('pointer');
  const [copied, setCopied] = useState(false);

  const copyCss = () => {
    const css = `cursor: ${selectedCursor};`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">CSS Cursor Generator</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Select Cursor Type
          </label>
          <select
            value={selectedCursor}
            onChange={(e) => setSelectedCursor(e.target.value)}
            className="w-full input-field"
          >
            {cursors.map(cursor => (
              <option key={cursor} value={cursor}>{cursor}</option>
            ))}
          </select>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl mb-6 text-center">
          <div
            className="inline-block p-6 bg-blue-500 text-white rounded-lg"
            style={{ cursor: selectedCursor }}
          >
            Hover me to see cursor
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">CSS Code</span>
            <button onClick={copyCss} className="btn-secondary text-sm flex items-center space-x-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <code className="text-sm font-mono text-slate-900 dark:text-slate-100">
            cursor: {selectedCursor};
          </code>
        </div>
      </div>
    </div>
  );
}


