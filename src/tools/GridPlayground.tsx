import { useState } from 'react';
import { Copy, Check, Grid } from 'lucide-react';

export default function GridPlayground() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(4);
  const [items, setItems] = useState(9);
  const [copied, setCopied] = useState(false);

  const cssCode = `.container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${gap * 0.25}rem;
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Grid className="w-5 h-5" />
              Grid Layout
            </h3>
            <button
              onClick={() => {
                setColumns(3); setRows(3); setGap(4); setItems(9);
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Columns</label>
                <span className="text-sm text-slate-500 font-mono">{columns}</span>
              </div>
              <input type="range" min="1" max="12" value={columns} onChange={(e) => setColumns(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rows</label>
                <span className="text-sm text-slate-500 font-mono">{rows}</span>
              </div>
              <input type="range" min="1" max="12" value={rows} onChange={(e) => setRows(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gap</label>
                <span className="text-sm text-slate-500 font-mono">{gap * 0.25}rem</span>
              </div>
              <input type="range" min="0" max="16" value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Items</label>
                <div className="flex gap-2">
                  <button onClick={() => items > 1 && setItems(items - 1)} className="text-xl leading-none px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600">-</button>
                  <span className="w-8 text-center">{items}</span>
                  <button onClick={() => items < 50 && setItems(items + 1)} className="text-xl leading-none px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview & Code */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 min-h-[400px] p-6 overflow-hidden">
          <div
            className="h-full w-full min-h-[350px] bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gap: `${gap * 0.25}rem`
            }}
          >
            {Array.from({ length: items }).map((_, i) => (
              <div
                key={i}
                className="bg-indigo-500 text-white flex items-center justify-center font-bold rounded shadow-sm min-h-[3rem]"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
            <span className="text-sm font-medium text-slate-300">CSS Code</span>
            <button
              onClick={handleCopy}
              className="text-xs flex items-center gap-1.5 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-4 font-mono text-sm text-blue-300 overflow-x-auto whitespace-pre">
            {cssCode}
          </div>
        </div>
      </div>
    </div>
  );
}
