import { useState } from 'react';
import { Copy, Check, Square } from 'lucide-react';

export default function BorderRadiusGenerator() {
    const [topLeft, setTopLeft] = useState(20);
    const [topRight, setTopRight] = useState(20);
    const [bottomRight, setBottomRight] = useState(20);
    const [bottomLeft, setBottomLeft] = useState(20);
    const [linked, setLinked] = useState(true);
    const [copied, setCopied] = useState(false);
    const [unit, setUnit] = useState<'px' | '%'>('px');

    const updateRadius = (val: number, corner?: string) => {
        if (linked) {
            setTopLeft(val);
            setTopRight(val);
            setBottomRight(val);
            setBottomLeft(val);
        } else {
            switch (corner) {
                case 'tl': setTopLeft(val); break;
                case 'tr': setTopRight(val); break;
                case 'br': setBottomRight(val); break;
                case 'bl': setBottomLeft(val); break;
            }
        }
    };

    const cssValue = `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`;

    // Condense CSS if values are same
    let optimizedCssValue = cssValue;
    if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
        optimizedCssValue = `${topLeft}${unit}`;
    } else if (topLeft === bottomRight && topRight === bottomLeft) {
        optimizedCssValue = `${topLeft}${unit} ${topRight}${unit}`;
    }

    const cssCode = `border-radius: ${optimizedCssValue};`;

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
                            <Square className="w-5 h-5" />
                            Configuration
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setLinked(!linked)}
                                className={`p-1.5 rounded transition-colors ${linked ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                title={linked ? "Unlink corners" : "Link corners"}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            </button>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value as any)}
                                className="text-xs bg-slate-100 dark:bg-slate-700 border-none rounded px-2 py-1 cursor-pointer outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="px">px</option>
                                <option value="%">%</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                        {/* Top Left */}
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Top Left</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max={unit === 'px' ? 200 : 50}
                                    value={topLeft}
                                    onChange={(e) => updateRadius(Number(e.target.value), 'tl')}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                                />
                                <span className="text-xs font-mono w-8 text-right">{topLeft}</span>
                            </div>
                        </div>

                        {/* Top Right */}
                        <div className="col-span-1 text-right">
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Top Right</label>
                            <div className="flex items-center gap-2 flex-row-reverse">
                                <input
                                    type="range"
                                    min="0"
                                    max={unit === 'px' ? 200 : 50}
                                    value={topRight}
                                    onChange={(e) => updateRadius(Number(e.target.value), 'tr')}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                                />
                                <span className="text-xs font-mono w-8 text-left">{topRight}</span>
                            </div>
                        </div>

                        {/* Bottom Left */}
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Bottom Left</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max={unit === 'px' ? 200 : 50}
                                    value={bottomLeft}
                                    onChange={(e) => updateRadius(Number(e.target.value), 'bl')}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                                />
                                <span className="text-xs font-mono w-8 text-right">{bottomLeft}</span>
                            </div>
                        </div>

                        {/* Bottom Right */}
                        <div className="col-span-1 text-right">
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Bottom Right</label>
                            <div className="flex items-center gap-2 flex-row-reverse">
                                <input
                                    type="range"
                                    min="0"
                                    max={unit === 'px' ? 200 : 50}
                                    value={bottomRight}
                                    onChange={(e) => updateRadius(Number(e.target.value), 'br')}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                                />
                                <span className="text-xs font-mono w-8 text-left">{bottomRight}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview & Code */}
            <div className="lg:col-span-2 space-y-6">
                <div
                    className="bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 h-[400px] flex items-center justify-center overflow-hidden relative"
                >
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    />

                    <div
                        className="w-64 h-64 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl flex items-center justify-center text-white"
                        style={{
                            borderRadius: cssValue
                        }}
                    >
                        <div className="text-center font-mono text-sm opacity-80">
                            border-radius
                        </div>
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
