import { useState } from 'react';
import { Copy, Check, Layout, RotateCw } from 'lucide-react';

export default function FlexboxPlayground() {
  const [direction, setDirection] = useState('row');
  const [wrap, setWrap] = useState('nowrap');
  const [justify, setJustify] = useState('flex-start');
  const [align, setAlign] = useState('stretch');
  const [gap, setGap] = useState(4);
  const [items, setItems] = useState([1, 2, 3, 4]);
  const [copied, setCopied] = useState(false);

  const cssCode = `.container {
  display: flex;
  flex-direction: ${direction};
  flex-wrap: ${wrap};
  justify-content: ${justify};
  align-items: ${align};
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
              <Layout className="w-5 h-5" />
              Flex Container
            </h3>
            <button
              onClick={() => {
                setDirection('row'); setWrap('nowrap'); setJustify('flex-start'); setAlign('stretch'); setGap(4); setItems([1, 2, 3, 4]);
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Flex Direction</label>
              <select value={direction} onChange={(e) => setDirection(e.target.value)} className="input-field">
                <option value="row">row</option>
                <option value="row-reverse">row-reverse</option>
                <option value="column">column</option>
                <option value="column-reverse">column-reverse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Flex Wrap</label>
              <select value={wrap} onChange={(e) => setWrap(e.target.value)} className="input-field">
                <option value="nowrap">nowrap</option>
                <option value="wrap">wrap</option>
                <option value="wrap-reverse">wrap-reverse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Justify Content</label>
              <select value={justify} onChange={(e) => setJustify(e.target.value)} className="input-field">
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
                <option value="center">center</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Align Items</label>
              <select value={align} onChange={(e) => setAlign(e.target.value)} className="input-field">
                <option value="stretch">stretch</option>
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
                <option value="center">center</option>
                <option value="baseline">baseline</option>
              </select>
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
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Items ({items.length})</label>
                <div className="flex gap-2">
                  <button onClick={() => items.length > 1 && setItems(items.slice(0, -1))} className="text-xl leading-none px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600">-</button>
                  <button onClick={() => items.length < 20 && setItems([...items, items.length + 1])} className="text-xl leading-none px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600">+</button>
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
            className="h-full w-full min-h-[350px] bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg"
            style={{
              display: 'flex',
              flexDirection: direction as any,
              flexWrap: wrap as any,
              justifyContent: justify,
              alignItems: align,
              gap: `${gap * 0.25}rem`
            }}
          >
            {items.map((item) => (
              <div
                key={item}
                className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center font-bold rounded-lg shadow-sm"
                style={{
                  minWidth: '4rem',
                  minHeight: '4rem',
                  // Random slightly varying heights for align items demo
                  height: align === 'stretch' ? 'auto' : `${4 + (item % 3)}rem`
                }}
              >
                {item}
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
