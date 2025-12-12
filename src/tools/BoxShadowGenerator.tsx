import { useState } from 'react';
import { Copy, Check, RefreshCw, Sliders } from 'lucide-react';

export default function BoxShadowGenerator() {
    const [offsetX, setOffsetX] = useState(10);
    const [offsetY, setOffsetY] = useState(10);
    const [blur, setBlur] = useState(20);
    const [spread, setSpread] = useState(0);
    const [color, setColor] = useState('#000000');
    const [opacity, setOpacity] = useState(0.25);
    const [inset, setInset] = useState(false);
    const [copied, setCopied] = useState(false);
    const [canvasColor, setCanvasColor] = useState('#ffffff');
    const [boxColor, setBoxColor] = useState('#3b82f6');

    // Convert hex color + opacity to rgba
    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const shadowValue = `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;

    const cssCode = `box-shadow: ${shadowValue};
-webkit-box-shadow: ${shadowValue};
-moz-box-shadow: ${shadowValue};`;

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
                            <Sliders className="w-5 h-5" />
                            Configuration
                        </h3>
                        <button
                            onClick={() => {
                                setOffsetX(10); setOffsetY(10); setBlur(20); setSpread(0);
                                setColor('#000000'); setOpacity(0.25); setInset(false);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Horizontal Length</label>
                                <span className="text-sm text-slate-500 font-mono">{offsetX}px</span>
                            </div>
                            <input
                                type="range"
                                min="-100"
                                max="100"
                                value={offsetX}
                                onChange={(e) => setOffsetX(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vertical Length</label>
                                <span className="text-sm text-slate-500 font-mono">{offsetY}px</span>
                            </div>
                            <input
                                type="range"
                                min="-100"
                                max="100"
                                value={offsetY}
                                onChange={(e) => setOffsetY(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blur Radius</label>
                                <span className="text-sm text-slate-500 font-mono">{blur}px</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                value={blur}
                                onChange={(e) => setBlur(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Spread Radius</label>
                                <span className="text-sm text-slate-500 font-mono">{spread}px</span>
                            </div>
                            <input
                                type="range"
                                min="-50"
                                max="100"
                                value={spread}
                                onChange={(e) => setSpread(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Opacity</label>
                                <span className="text-sm text-slate-500 font-mono">{Math.round(opacity * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={opacity}
                                onChange={(e) => setOpacity(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Shadow Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="h-10 w-10 rounded cursor-pointer border-0 p-0"
                                    />
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono dark:bg-slate-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={inset}
                                        onChange={(e) => setInset(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ms-3 text-sm font-medium text-slate-700 dark:text-slate-300">Inset</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colors config */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-sm">Preview Colors</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Background</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={canvasColor} onChange={(e) => setCanvasColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                                <span className="text-xs font-mono text-slate-500">{canvasColor}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Box</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                                <span className="text-xs font-mono text-slate-500">{boxColor}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview & Code */}
            <div className="lg:col-span-2 space-y-6">
                <div
                    className="bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 h-[400px] flex items-center justify-center overflow-hidden relative"
                    style={{ backgroundColor: canvasColor }}
                >
                    {/* Grid pattern overlay for transparency check */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    />

                    <div
                        className="w-48 h-48 rounded-xl flex items-center justify-center text-white font-medium relative z-10"
                        style={{
                            backgroundColor: boxColor,
                            boxShadow: shadowValue,
                            color: parseInt(boxColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff'
                        }}
                    >
                        Preview Box
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
