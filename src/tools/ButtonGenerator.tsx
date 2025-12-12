import { useState } from 'react';
import { Copy, Check, MousePointerClick } from 'lucide-react';

export default function ButtonGenerator() {
  const [text, setText] = useState('Click Me');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [paddingY, setPaddingY] = useState(12);
  const [paddingX, setPaddingX] = useState(24);
  const [borderRadius, setBorderRadius] = useState(8);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#2563eb');
  const [fontSize, setFontSize] = useState(16);
  const [copied, setCopied] = useState(false);
  const [hasShadow, setHasShadow] = useState(true);

  const cssCode = `.custom-btn {
  background-color: ${bgColor};
  color: ${textColor};
  padding: ${paddingY}px ${paddingX}px;
  border-radius: ${borderRadius}px;
  border: ${borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none'};
  font-size: ${fontSize}px;
  cursor: pointer;
  transition: all 0.2s ease;
  ${hasShadow ? 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);' : ''}
}

.custom-btn:hover {
  filter: brightness(110%);
  transform: translateY(-1px);
  ${hasShadow ? 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);' : ''}
}

.custom-btn:active {
  transform: translateY(0);
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
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MousePointerClick className="w-5 h-5" />
            Button Styles
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Button Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                <span className="text-xs font-mono text-slate-500">{bgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                <span className="text-xs font-mono text-slate-500">{textColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vertical Padding</label>
                <span className="text-sm text-slate-500 font-mono">{paddingY}px</span>
              </div>
              <input type="range" min="4" max="40" value={paddingY} onChange={(e) => setPaddingY(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Horizontal Padding</label>
                <span className="text-sm text-slate-500 font-mono">{paddingX}px</span>
              </div>
              <input type="range" min="8" max="80" value={paddingX} onChange={(e) => setPaddingX(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Border Radius</label>
                <span className="text-sm text-slate-500 font-mono">{borderRadius}px</span>
              </div>
              <input type="range" min="0" max="50" value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Font Size</label>
                <span className="text-sm text-slate-500 font-mono">{fontSize}px</span>
              </div>
              <input type="range" min="10" max="32" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Border Width</label>
                <span className="text-sm text-slate-500 font-mono">{borderWidth}px</span>
              </div>
              <input type="range" min="0" max="10" value={borderWidth} onChange={(e) => setBorderWidth(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
            </div>

            {borderWidth > 0 && (
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Border Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                  <span className="text-xs font-mono text-slate-500">{borderColor}</span>
                </div>
              </div>
            )}

            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={hasShadow} onChange={(e) => setHasShadow(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Add Shadow</span>
            </label>
          </div>
        </div>
      </div>

      {/* Preview & Code */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 h-[400px] flex items-center justify-center relative">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />

          <button
            style={{
              backgroundColor: bgColor,
              color: textColor,
              padding: `${paddingY}px ${paddingX}px`,
              borderRadius: `${borderRadius}px`,
              border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
              fontSize: `${fontSize}px`,
              boxShadow: hasShadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            className="hover:brightness-110 active:translate-y-0 hover:-translate-y-[1px] shadow-sm hover:shadow-md"
          >
            {text}
          </button>
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
