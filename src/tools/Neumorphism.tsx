import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function Neumorphism() {
  const [size, setSize] = useState(20);
  const [intensity, setIntensity] = useState(0.5);
  const [copied, setCopied] = useState(false);

  const css = `
.neumorphism {
  background: #e0e0e0;
  border-radius: ${size}px;
  box-shadow: 
    ${size * intensity}px ${size * intensity}px ${size * 2}px #bebebe,
    -${size * intensity}px -${size * intensity}px ${size * 2}px #ffffff;
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
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Neumorphism Generator</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Size: {size}px
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Intensity: {intensity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="bg-slate-200 p-8 rounded-xl mb-6 flex items-center justify-center">
          <div
            className="p-8 rounded-xl"
            style={{
              background: '#e0e0e0',
              borderRadius: `${size}px`,
              boxShadow: `
                ${size * intensity}px ${size * intensity}px ${size * 2}px #bebebe,
                -${size * intensity}px -${size * intensity}px ${size * 2}px #ffffff
              `
            }}
          >
            <div className="text-slate-700 font-semibold">Neumorphism</div>
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


