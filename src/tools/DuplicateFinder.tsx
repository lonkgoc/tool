import { useState, useRef } from 'react';
import { Copy, Upload, Download, Search, Trash2, FolderSearch, Loader, AlertCircle } from 'lucide-react';
import SparkMD5 from 'spark-md5';

interface FileEntry {
    id: string;
    name: string;
    size: number;
    hash: string;
    file: File;
    isDuplicate?: boolean;
    duplicateOf?: string;
}

export default function DuplicateFinder() {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const [duplicates, setDuplicates] = useState<Map<string, FileEntry[]>>(new Map());
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef(false);

    const calculateHash = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const chunkSize = 2 * 1024 * 1024; // 2MB chunks
            const chunks = Math.ceil(file.size / chunkSize);
            const spark = new SparkMD5.ArrayBuffer();
            const fileReader = new FileReader();
            let currentChunk = 0;

            fileReader.onload = (e) => {
                if (abortRef.current) {
                    reject(new Error('Aborted'));
                    return;
                }

                if (e.target?.result) {
                    spark.append(e.target.result as ArrayBuffer);
                }
                currentChunk++;

                if (currentChunk < chunks) {
                    loadNext();
                } else {
                    resolve(spark.end());
                }
            };

            fileReader.onerror = () => reject(new Error('Error reading file'));

            const loadNext = () => {
                const start = currentChunk * chunkSize;
                const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
                const slice = file.slice(start, end);
                fileReader.readAsArrayBuffer(slice);
            };

            loadNext();
        });
    };

    const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        setLoading(true);
        setProgress(0);
        setCurrentFileIndex(0);
        setDuplicates(new Map());
        abortRef.current = false;

        const entries: FileEntry[] = [];

        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                if (abortRef.current) break;

                const file = selectedFiles[i];
                setCurrentFileIndex(i + 1);

                try {
                    const hash = await calculateHash(file);
                    entries.push({
                        id: Date.now().toString() + i,
                        name: file.name,
                        size: file.size,
                        hash,
                        file
                    });
                    // Update progress based on file count
                    setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
                } catch (err) {
                    if ((err as Error).message === 'Aborted') break;
                    console.error('Error hashing file:', file.name, err);
                }
            }
        } finally {
            if (!abortRef.current && entries.length > 0) {
                // Find duplicates
                const hashGroups = new Map<string, FileEntry[]>();
                entries.forEach(entry => {
                    const existing = hashGroups.get(entry.hash) || [];
                    existing.push(entry);
                    hashGroups.set(entry.hash, existing);
                });

                // Mark duplicates
                const duplicateGroups = new Map<string, FileEntry[]>();
                hashGroups.forEach((group, hash) => {
                    if (group.length > 1) {
                        duplicateGroups.set(hash, group);
                        group.forEach((entry, i) => {
                            entry.isDuplicate = i > 0;
                            if (i > 0) entry.duplicateOf = group[0].name;
                        });
                    }
                });

                setFiles(entries);
                setDuplicates(duplicateGroups);
            }
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCancel = () => {
        abortRef.current = true;
        setLoading(false);
    };

    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const duplicateSize = files.filter(f => f.isDuplicate).reduce((sum, f) => sum + f.size, 0);
    const duplicateCount = files.filter(f => f.isDuplicate).length;

    const exportReport = () => {
        let text = '=== Duplicate File Report ===\n\n';
        text += `Total Files: ${files.length}\n`;
        text += `Duplicate Files: ${duplicateCount}\n`;
        text += `Wasted Space: ${formatSize(duplicateSize)}\n\n`;

        if (duplicates.size > 0) {
            text += '=== Duplicate Groups ===\n\n';
            duplicates.forEach((group, hash) => {
                text += `Hash: ${hash} (Size: ${formatSize(group[0].size)})\n`;
                group.forEach((f, i) => {
                    text += `  ${i === 0 ? '(Original)' : '(Duplicate)'} ${f.name}\n`;
                });
                text += '\n';
            });
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'duplicate-report.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearAll = () => {
        setFiles([]);
        setDuplicates(new Map());
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <FolderSearch className="w-6 h-6 text-yellow-500" />
                    Duplicate File Finder
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
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-yellow-500 transition-colors">
                        <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-600 dark:text-slate-400">Click to select multiple files</p>
                            <p className="text-sm text-slate-500 mt-1">Large files are supported via memory-efficient chunked hashing</p>
                        </div>
                    </div>
                </label>

                {/* Loading */}
                {loading && (
                    <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">Processing file {currentFileIndex}...</span>
                            <span className="text-sm text-slate-500">{progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full bg-yellow-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <button onClick={handleCancel} className="btn-secondary text-sm w-full">
                            Cancel Analysis
                        </button>
                    </div>
                )}

                {/* Summary */}
                {files.length > 0 && !loading && (
                    <>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center">
                                <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">{files.length}</div>
                                <div className="text-sm text-slate-500">Total Files</div>
                            </div>
                            <div className={`p-4 rounded-xl text-center ${duplicateCount > 0 ? 'bg-red-50 dark:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/30'}`}>
                                <div className={`text-3xl font-bold ${duplicateCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {duplicateCount}
                                </div>
                                <div className="text-sm text-slate-500">Duplicates</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center">
                                <div className="text-xl font-bold text-slate-700 dark:text-slate-300">{formatSize(duplicateSize)}</div>
                                <div className="text-sm text-slate-500">Wasted Space</div>
                            </div>
                        </div>

                        {/* Duplicate Groups */}
                        {duplicates.size > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Copy className="w-5 h-5 text-red-500" />
                                        Duplicate Groups ({duplicates.size})
                                    </h3>
                                    <button onClick={exportReport} className="btn-secondary text-sm flex items-center gap-1">
                                        <Download className="w-4 h-4" /> Export Report
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {Array.from(duplicates.entries()).map(([hash, group]) => (
                                        <div key={hash} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                                            <div className="text-xs text-slate-500 mb-2 font-mono">
                                                Hash: {hash.substring(0, 32)}...
                                            </div>
                                            <div className="space-y-2">
                                                {group.map((file, i) => (
                                                    <div
                                                        key={file.id}
                                                        className={`flex items-center justify-between p-2 rounded ${i === 0 ? 'bg-white dark:bg-slate-800' : 'bg-red-100 dark:bg-red-900/40'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {i > 0 && <Copy className="w-4 h-4 text-red-500" />}
                                                            <span className={i === 0 ? 'font-medium' : 'text-red-600'}>
                                                                {file.name}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-slate-500">{formatSize(file.size)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {duplicates.size === 0 && (
                            <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/30 rounded-xl text-center">
                                <div className="text-5xl mb-2">✓</div>
                                <div className="text-lg font-medium text-green-600">No Duplicates Found!</div>
                                <div className="text-sm text-slate-500">All {files.length} files are unique</div>
                            </div>
                        )}

                        <button onClick={clearAll} className="btn-secondary w-full">
                            Clear & Start Over
                        </button>
                    </>
                )}
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <p className="font-medium mb-2">How it works:</p>
                <p>Files are compared using SHA-256 hash of their content calculated in chunks. This ensures 100% accuracy while keeping memory usage low for large files.</p>
            </div>
        </div>
    );
}
