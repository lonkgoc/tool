import { useState } from 'react';
import { Copy, Check, Type } from 'lucide-react';

export default function TextShadowGenerator() {
    const [offsetX, setOffsetX] = useState(2);
    const [offsetY, setOffsetY] = useState(2);
    const [blur, setBlur] = useState(4);
    const [color, setColor] = useState('#000000');
    const [opacity, setOpacity] = useState(0.5);
    const [copied, setCopied] = useState(false);
    const [text, setText] = useState('Awesome Text');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [textColor, setTextColor] = useState('#3b82f6');

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const shadowValue = `${offsetX}px ${offsetY}px ${blur}px ${hexToRgba(color, opacity)}`;

    const cssCode = `text-shadow: ${shadowValue};`;

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
                            <Type className="w-5 h-5" />
                            Configuration
                        </h3>
                        <button
                            onClick={() => {
                                setOffsetX(2); setOffsetY(2); setBlur(4);
                                setColor('#000000'); setOpacity(0.5);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preview Text</label>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        <hr className="border-slate-200 dark:border-slate-700" />

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Horizontal Offset</label>
                                <span className="text-sm text-slate-500 font-mono">{offsetX}px</span>
                            </div>
                            <input
                                type="range"
                                min="-50"
                                max="50"
                                value={offsetX}
                                onChange={(e) => setOffsetX(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vertical Offset</label>
                                <span className="text-sm text-slate-500 font-mono">{offsetY}px</span>
                            </div>
                            <input
                                type="range"
                                min="-50"
                                max="50"
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
                                max="50"
                                value={blur}
                                onChange={(e) => setBlur(Number(e.target.value))}
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

                        <div className="pt-4">
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
                    </div>
                </div>

                {/* Colors config */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-sm">Appearance</h4>
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
                </div>
            </div>

            {/* Preview & Code */}
            <div className="lg:col-span-2 space-y-6">
                <div
                    className="bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 h-[400px] flex items-center justify-center overflow-hidden relative"
                    style={{ backgroundColor: bgColor }}
                >
                    <h1
                        className="text-5xl md:text-7xl font-bold transition-all duration-200 text-center px-4"
                        style={{
                            color: textColor,
                            textShadow: shadowValue
                        }}
                    >
                        {text}
                    </h1>
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
