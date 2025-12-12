import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function Glassmorphism() {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.3);
  const [borderWidth, setBorderWidth] = useState(1);
  const [copied, setCopied] = useState(false);

  const css = `
.glass {
  background: rgba(255, 255, 255, ${opacity});
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border: ${borderWidth}px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
  `.trim();

  const copyCss = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Glassmorphism Generator</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Blur: {blur}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Opacity: {opacity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Border Width: {borderWidth}px
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={borderWidth}
              onChange={(e) => setBorderWidth(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-xl mb-6 relative overflow-hidden">
          <div
            className="p-6 rounded-xl"
            style={{
              background: `rgba(255, 255, 255, ${opacity})`,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              border: `${borderWidth}px solid rgba(255, 255, 255, 0.18)`,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}
          >
            <div className="text-slate-900 font-semibold text-lg">Glassmorphism Effect</div>
            <div className="text-slate-700 text-sm mt-2">This is a preview of the glass effect</div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Generated CSS</span>
            <button onClick={copyCss} className="btn-secondary text-sm flex items-center space-x-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-slate-900 dark:text-slate-100 overflow-x-auto">
            {css}
          </pre>
        </div>
      </div>
    </div>
  );
}


