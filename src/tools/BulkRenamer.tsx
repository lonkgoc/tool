import { useState, useRef } from 'react';
import { FolderEdit, Upload, Download, Plus, Trash2, RefreshCw, Check } from 'lucide-react';

interface FileItem {
    id: string;
    originalName: string;
    newName: string;
    file: File;
}

export default function BulkRenamer() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [prefix, setPrefix] = useState('');
    const [suffix, setSuffix] = useState('');
    const [find, setFind] = useState('');
    const [replace, setReplace] = useState('');
    const [numbering, setNumbering] = useState(false);
    const [startNumber, setStartNumber] = useState(1);
    const [padding, setPadding] = useState(2);
    const [lowerCase, setLowerCase] = useState(false);
    const [upperCase, setUpperCase] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []).map(file => ({
            id: Date.now().toString() + Math.random(),
            originalName: file.name,
            newName: file.name,
            file
        }));
        setFiles(prev => [...prev, ...newFiles]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const updateNewNames = () => {
        setFiles(prev => prev.map((item, index) => {
            let newName = item.originalName;
            const ext = newName.lastIndexOf('.') > 0 ? newName.slice(newName.lastIndexOf('.')) : '';
            let baseName = ext ? newName.slice(0, newName.lastIndexOf('.')) : newName;

            // Find & Replace
            if (find) {
                baseName = baseName.split(find).join(replace);
            }

            // Case conversion
            if (lowerCase) {
                baseName = baseName.toLowerCase();
            } else if (upperCase) {
                baseName = baseName.toUpperCase();
            }

            // Add numbering
            if (numbering) {
                const num = (startNumber + index).toString().padStart(padding, '0');
                baseName = `${num}_${baseName}`;
            }

            // Add prefix & suffix
            baseName = `${prefix}${baseName}${suffix}`;

            return { ...item, newName: baseName + ext };
        }));
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const clearAll = () => {
        setFiles([]);
    };

    const downloadAll = async () => {
        for (const item of files) {
            const url = URL.createObjectURL(item.file);
            const a = document.createElement('a');
            a.href = url;
            a.download = item.newName;
            a.click();
            URL.revokeObjectURL(url);
            await new Promise(r => setTimeout(r, 100));
        }
    };

    const hasChanges = files.some(f => f.originalName !== f.newName);

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <FolderEdit className="w-6 h-6 text-blue-500" />
                    Bulk File Renamer
                </h2>

                {/* Upload */}
                <label className="cursor-pointer block mb-6">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFilesChange}
                        className="hidden"
                    />
                    <div className="flex items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 transition-colors">
                        <div className="text-center">
                            <Plus className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                            <p className="text-slate-600 dark:text-slate-400">Click to add files</p>
                        </div>
                    </div>
                </label>

                {/* Rename Options */}
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-6">
                    <h3 className="font-semibold mb-4">Rename Options</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Prefix</label>
                            <input
                                type="text"
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                                className="input-field"
                                placeholder="Add before name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Suffix</label>
                            <input
                                type="text"
                                value={suffix}
                                onChange={(e) => setSuffix(e.target.value)}
                                className="input-field"
                                placeholder="Add after name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Find</label>
                            <input
                                type="text"
                                value={find}
                                onChange={(e) => setFind(e.target.value)}
                                className="input-field"
                                placeholder="Text to find"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Replace</label>
                            <input
                                type="text"
                                value={replace}
                                onChange={(e) => setReplace(e.target.value)}
                                className="input-field"
                                placeholder="Replace with"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={numbering}
                                onChange={(e) => setNumbering(e.target.checked)}
                            />
                            <span className="text-sm">Add Numbering</span>
                            {numbering && (
                                <input
                                    type="number"
                                    value={startNumber}
                                    onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                                    className="input-field w-16 text-sm p-1"
                                    min="0"
                                />
                            )}
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={lowerCase}
                                onChange={(e) => { setLowerCase(e.target.checked); setUpperCase(false); }}
                            />
                            <span className="text-sm">lowercase</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={upperCase}
                                onChange={(e) => { setUpperCase(e.target.checked); setLowerCase(false); }}
                            />
                            <span className="text-sm">UPPERCASE</span>
                        </label>
                    </div>

                    <button onClick={updateNewNames} className="btn-primary mt-4 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Apply Rename Rules
                    </button>
                </div>

                {/* Files List */}
                {files.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Files ({files.length})</span>
                            <button onClick={clearAll} className="text-red-500 text-sm hover:underline">
                                Clear All
                            </button>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {files.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-slate-500 truncate">{item.originalName}</div>
                                        <div className={`font-medium truncate ${item.originalName !== item.newName ? 'text-blue-600' : ''}`}>
                                            → {item.newName}
                                            {item.originalName !== item.newName && <Check className="inline w-4 h-4 ml-1 text-green-500" />}
                                        </div>
                                    </div>
                                    <button onClick={() => removeFile(item.id)} className="text-red-400 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Download */}
                {files.length > 0 && (
                    <button
                        onClick={downloadAll}
                        disabled={!hasChanges}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Download className="w-5 h-5" />
                        Download All Renamed Files
                    </button>
                )}
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <p className="font-medium mb-2">How it works:</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Upload files you want to rename</li>
                    <li>Configure rename options (prefix, suffix, find/replace, etc.)</li>
                    <li>Click "Apply Rename Rules" to preview new names</li>
                    <li>Download all files with their new names</li>
                </ol>
            </div>
        </div>
    );
}
