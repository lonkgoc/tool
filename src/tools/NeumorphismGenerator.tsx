import { useState } from 'react';
import { Copy, Check, Moon, Sun } from 'lucide-react';

export default function NeumorphismGenerator() {
    const [color, setColor] = useState('#e0e5ec');
    const [size, setSize] = useState(200);
    const [radius, setRadius] = useState(50);
    const [distance, setDistance] = useState(20);
    const [intensity, setIntensity] = useState(0.15);
    const [blur, setBlur] = useState(60);
    const [shape, setShape] = useState<'flat' | 'concave' | 'convex' | 'pressed'>('flat');
    const [copied, setCopied] = useState(false);

    // Helper to adjust color brightness
    const adjustColor = (hex: string, percent: number) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1);
    };

    const darkColor = adjustColor(color, -intensity * 100);
    const lightColor = adjustColor(color, intensity * 100);

    let gradient = '';
    switch (shape) {
        case 'concave': gradient = `linear-gradient(145deg, ${darkColor}, ${lightColor})`; break;
        case 'convex': gradient = `linear-gradient(145deg, ${lightColor}, ${darkColor})`; break;
        default: gradient = color; break;
    }

    let boxShadow = '';
    if (shape === 'pressed') {
        boxShadow = `inset ${distance}px ${distance}px ${blur}px ${darkColor}, inset -${distance}px -${distance}px ${blur}px ${lightColor}`;
    } else {
        boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
    }

    const cssCode = `border-radius: ${radius}px;
background: ${shape === 'flat' || shape === 'pressed' ? color : gradient};
box-shadow: ${boxShadow};`;

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
                            <div className="flex -space-x-1">
                                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                                <div className="w-3 h-3 rounded-full bg-slate-800 border border-white"></div>
                            </div>
                            Configuration
                        </h3>
                        <button
                            onClick={() => {
                                setColor('#e0e5ec'); setSize(200); setRadius(50); setDistance(20); setIntensity(0.15); setBlur(60); setShape('flat');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Base Color</label>
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

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Size</label>
                                <span className="text-sm text-slate-500 font-mono">{size}px</span>
                            </div>
                            <input type="range" min="50" max="400" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Border Radius</label>
                                <span className="text-sm text-slate-500 font-mono">{radius}px</span>
                            </div>
                            <input type="range" min="0" max={size / 2} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Distance</label>
                                <span className="text-sm text-slate-500 font-mono">{distance}px</span>
                            </div>
                            <input type="range" min="5" max="50" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Intensity</label>
                                <span className="text-sm text-slate-500 font-mono">{Math.round(intensity * 100)}%</span>
                            </div>
                            <input type="range" min="0.01" max="0.6" step="0.01" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blur</label>
                                <span className="text-sm text-slate-500 font-mono">{blur}px</span>
                            </div>
                            <input type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Shape</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['flat', 'concave', 'convex', 'pressed'] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setShape(s)}
                                        className={`px-2 py-2 text-xs font-medium rounded capitalize ${shape === s
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview & Code */}
            <div className="lg:col-span-2 space-y-6">
                <div
                    className="rounded-xl h-[500px] flex items-center justify-center relative overflow-hidden transition-colors duration-300"
                    style={{ backgroundColor: color }}
                >
                    <div
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            borderRadius: `${radius}px`,
                            background: shape === 'flat' || shape === 'pressed' ? color : gradient,
                            boxShadow: boxShadow
                        }}
                        className="flex items-center justify-center text-slate-500"
                    >
                        {/* Optional Icon/Text inside */}
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
