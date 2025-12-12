import { useState } from 'react';
import { Copy, Check, MousePointer2 } from 'lucide-react';

export default function CssCursorGenerator() {
    const [selectedCursor, setSelectedCursor] = useState('default');
    const [copied, setCopied] = useState(false);

    const cursors = [
        { value: 'auto', label: 'Auto' },
        { value: 'default', label: 'Default' },
        { value: 'none', label: 'None' },
        { value: 'context-menu', label: 'Context Menu' },
        { value: 'help', label: 'Help' },
        { value: 'pointer', label: 'Pointer' },
        { value: 'progress', label: 'Progress' },
        { value: 'wait', label: 'Wait' },
        { value: 'cell', label: 'Cell' },
        { value: 'crosshair', label: 'Crosshair' },
        { value: 'text', label: 'Text' },
        { value: 'vertical-text', label: 'Vertical Text' },
        { value: 'alias', label: 'Alias' },
        { value: 'copy', label: 'Copy' },
        { value: 'move', label: 'Move' },
        { value: 'no-drop', label: 'No Drop' },
        { value: 'not-allowed', label: 'Not Allowed' },
        { value: 'grab', label: 'Grab' },
        { value: 'grabbing', label: 'Grabbing' },
        { value: 'all-scroll', label: 'All Scroll' },
        { value: 'col-resize', label: 'Col Resize' },
        { value: 'row-resize', label: 'Row Resize' },
        { value: 'n-resize', label: 'N Resize' },
        { value: 'e-resize', label: 'E Resize' },
        { value: 's-resize', label: 'S Resize' },
        { value: 'w-resize', label: 'W Resize' },
        { value: 'ne-resize', label: 'NE Resize' },
        { value: 'nw-resize', label: 'NW Resize' },
        { value: 'se-resize', label: 'SE Resize' },
        { value: 'sw-resize', label: 'SW Resize' },
        { value: 'ew-resize', label: 'EW Resize' },
        { value: 'ns-resize', label: 'NS Resize' },
        { value: 'nesw-resize', label: 'NESW Resize' },
        { value: 'nwse-resize', label: 'NWSE Resize' },
        { value: 'zoom-in', label: 'Zoom In' },
        { value: 'zoom-out', label: 'Zoom Out' },
    ];

    const cssCode = `cursor: ${selectedCursor};`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 h-[600px] flex flex-col">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4 flex-shrink-0">
                        <MousePointer2 className="w-5 h-5" />
                        Select Cursor
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                        {cursors.map((cursor) => (
                            <button
                                key={cursor.value}
                                onClick={() => setSelectedCursor(cursor.value)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selectedCursor === cursor.value
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-transparent'
                                    }`}
                            >
                                <span>{cursor.label}</span>
                                <span className="font-mono text-xs opacity-50">{cursor.value}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preview & Code */}
            <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Interactive Preview Area</h3>
                    <div
                        className="bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 h-[400px] flex items-center justify-center hover:border-blue-500 transition-colors"
                        style={{ cursor: selectedCursor }}
                    >
                        <div className="text-center p-8 pointer-events-none">
                            <div className="text-4xl mb-4">Hover Here</div>
                            <div className="text-slate-500 dark:text-slate-400">
                                Current cursor: <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedCursor}</span>
                            </div>
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
