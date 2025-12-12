import { useState } from 'react';
import { Copy, Check, Droplets } from 'lucide-react';

export default function GlassmorphismGenerator() {
    const [blur, setBlur] = useState(16);
    const [transparency, setTransparency] = useState(0.6);
    const [saturation, setSaturation] = useState(180);
    const [color, setColor] = useState('#ffffff');
    const [outline, setOutline] = useState(true);
    const [copied, setCopied] = useState(false);

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const backgroundColor = hexToRgba(color, transparency);
    const cssCode = `/* Glassmorphism Card */
background: ${backgroundColor};
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border-radius: 12px;
border: 1px solid rgba(255, 255, 255, 0.125);`;

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
                            <Droplets className="w-5 h-5" />
                            Configuration
                        </h3>
                        <button
                            onClick={() => {
                                setBlur(16); setTransparency(0.6); setSaturation(180); setColor('#ffffff');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blur</label>
                                <span className="text-sm text-slate-500 font-mono">{blur}px</span>
                            </div>
                            <input type="range" min="0" max="40" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Transparency</label>
                                <span className="text-sm text-slate-500 font-mono">{Math.round(transparency * 100)}%</span>
                            </div>
                            <input type="range" min="0" max="1" step="0.01" value={transparency} onChange={(e) => setTransparency(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Saturation</label>
                                <span className="text-sm text-slate-500 font-mono">{saturation}%</span>
                            </div>
                            <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Glass Color</label>
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

                        <div className="pt-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" checked={outline} onChange={(e) => setOutline(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Show Border</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview & Code */}
            <div className="lg:col-span-2 space-y-6">
                <div
                    className="rounded-xl h-[400px] flex items-center justify-center relative overflow-hidden"
                    style={{
                        backgroundImage: 'linear-gradient(45deg, #4f46e5, #06b6d4)',
                    }}
                >
                    {/* Abstract shapes background */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>


                    <div
                        className="w-96 h-64 p-8 flex flex-col justify-between"
                        style={{
                            backgroundColor: backgroundColor,
                            backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                            WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                            borderRadius: '16px',
                            border: outline ? '1px solid rgba(255, 255, 255, 0.125)' : 'none',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                        }}
                    >
                        <div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-200">Glass Card</h2>
                            <p className="mt-2 text-sm text-gray-800 dark:text-gray-100 opacity-90">This is how your glassmorphism effect looks. It blends beautifully with vivid backgrounds.</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="h-2 w-1/3 bg-gray-500/20 rounded-full"></div>
                            <div className="h-2 w-1/4 bg-gray-500/20 rounded-full"></div>
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
