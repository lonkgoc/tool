import { useState, useRef } from 'react';
import { FileSearch, Upload, Download, Info, FileType, HardDrive, Calendar } from 'lucide-react';

interface FileInfo {
    name: string;
    size: number;
    type: string;
    extension: string;
    category: string;
    lastModified: Date;
    details: Record<string, string>;
}

const fileSignatures: Record<string, { magic: number[]; name: string; category: string }> = {
    'pdf': { magic: [0x25, 0x50, 0x44, 0x46], name: 'PDF Document', category: 'Document' },
    'png': { magic: [0x89, 0x50, 0x4E, 0x47], name: 'PNG Image', category: 'Image' },
    'jpg': { magic: [0xFF, 0xD8, 0xFF], name: 'JPEG Image', category: 'Image' },
    'gif': { magic: [0x47, 0x49, 0x46, 0x38], name: 'GIF Image', category: 'Image' },
    'webp': { magic: [0x52, 0x49, 0x46, 0x46], name: 'WebP Image', category: 'Image' },
    'zip': { magic: [0x50, 0x4B, 0x03, 0x04], name: 'ZIP Archive', category: 'Archive' },
    'rar': { magic: [0x52, 0x61, 0x72, 0x21], name: 'RAR Archive', category: 'Archive' },
    '7z': { magic: [0x37, 0x7A, 0xBC, 0xAF], name: '7-Zip Archive', category: 'Archive' },
    'mp3': { magic: [0x49, 0x44, 0x33], name: 'MP3 Audio', category: 'Audio' },
    'mp4': { magic: [0x00, 0x00, 0x00], name: 'MP4 Video', category: 'Video' },
    'doc': { magic: [0xD0, 0xCF, 0x11, 0xE0], name: 'MS Office Document', category: 'Document' },
    'exe': { magic: [0x4D, 0x5A], name: 'Windows Executable', category: 'Executable' },
};

export default function FileTypeDetector() {
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [hexPreview, setHexPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    };

    const detectFileType = async (file: File): Promise<{ type: string; category: string }> => {
        const buffer = await file.slice(0, 16).arrayBuffer();
        const bytes = new Uint8Array(buffer);

        // Create hex preview
        const hex = Array.from(bytes.slice(0, 16))
            .map(b => b.toString(16).padStart(2, '0').toUpperCase())
            .join(' ');
        setHexPreview(hex);

        // Check against known signatures
        for (const [ext, sig] of Object.entries(fileSignatures)) {
            const matches = sig.magic.every((byte, i) => bytes[i] === byte);
            if (matches) {
                return { type: sig.name, category: sig.category };
            }
        }

        // Fallback to MIME type
        if (file.type) {
            const category = file.type.split('/')[0];
            return {
                type: file.type,
                category: category.charAt(0).toUpperCase() + category.slice(1)
            };
        }

        return { type: 'Unknown', category: 'Unknown' };
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        try {
            const { type, category } = await detectFileType(file);
            const extension = file.name.includes('.')
                ? file.name.split('.').pop()?.toUpperCase() || 'N/A'
                : 'N/A';

            const details: Record<string, string> = {
                'MIME Type': file.type || 'Unknown',
                'File Extension': extension,
                'Detected Type': type,
            };

            // Add image dimensions for images
            if (file.type.startsWith('image/')) {
                const img = new Image();
                const url = URL.createObjectURL(file);
                await new Promise<void>((resolve) => {
                    img.onload = () => {
                        details['Dimensions'] = `${img.width} × ${img.height} px`;
                        URL.revokeObjectURL(url);
                        resolve();
                    };
                    img.onerror = () => resolve();
                    img.src = url;
                });
            }

            setFileInfo({
                name: file.name,
                size: file.size,
                type,
                extension,
                category,
                lastModified: new Date(file.lastModified),
                details
            });
        } catch (err) {
            console.error('Error detecting file type:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFileInfo(null);
        setHexPreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getCategoryColor = (category: string): string => {
        const colors: Record<string, string> = {
            'Image': 'bg-green-500',
            'Document': 'bg-blue-500',
            'Archive': 'bg-yellow-500',
            'Audio': 'bg-purple-500',
            'Video': 'bg-red-500',
            'Executable': 'bg-orange-500',
        };
        return colors[category] || 'bg-slate-500';
    };

    const exportInfo = () => {
        if (!fileInfo) return;
        let text = '=== File Information ===\n\n';
        text += `Name: ${fileInfo.name}\n`;
        text += `Size: ${formatSize(fileInfo.size)}\n`;
        text += `Type: ${fileInfo.type}\n`;
        text += `Category: ${fileInfo.category}\n`;
        text += `Modified: ${fileInfo.lastModified.toLocaleString()}\n`;
        text += `\nHex Signature: ${hexPreview}\n`;
        text += `\nDetails:\n`;
        for (const [key, value] of Object.entries(fileInfo.details)) {
            text += `  ${key}: ${value}\n`;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileInfo.name}-info.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <FileSearch className="w-6 h-6 text-indigo-500" />
                    File Type Detector
                </h2>

                {/* Upload */}
                <label className="cursor-pointer block mb-6">
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-indigo-500 transition-colors">
                        <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-600 dark:text-slate-400">Click to upload any file</p>
                            <p className="text-sm text-slate-500 mt-1">We'll detect its type from the binary signature</p>
                        </div>
                    </div>
                </label>

                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-slate-600">Analyzing file...</p>
                    </div>
                )}

                {fileInfo && !loading && (
                    <div className="space-y-6">
                        {/* Main Info Card */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-xl ${getCategoryColor(fileInfo.category)} flex items-center justify-center`}>
                                    <FileType className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold truncate">{fileInfo.name}</h3>
                                    <p className="opacity-80">{fileInfo.type}</p>
                                </div>
                                <div className="text-right">
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{fileInfo.category}</span>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                    <HardDrive className="w-4 h-4" /> Size
                                </div>
                                <div className="font-bold text-lg">{formatSize(fileInfo.size)}</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                    <FileType className="w-4 h-4" /> Extension
                                </div>
                                <div className="font-bold text-lg">.{fileInfo.extension}</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                    <Calendar className="w-4 h-4" /> Modified
                                </div>
                                <div className="font-bold text-sm">{fileInfo.lastModified.toLocaleDateString()}</div>
                            </div>
                        </div>

                        {/* Hex Signature */}
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                            <div className="text-sm font-medium mb-2">Binary Signature (First 16 bytes)</div>
                            <code className="block bg-slate-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                                {hexPreview}
                            </code>
                        </div>

                        {/* All Details */}
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-medium">All Details</span>
                                <button onClick={exportInfo} className="btn-secondary text-sm flex items-center gap-1">
                                    <Download className="w-4 h-4" /> Export
                                </button>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(fileInfo.details).map(([key, value]) => (
                                    <div key={key} className="flex justify-between p-2 bg-white dark:bg-slate-900 rounded">
                                        <span className="text-slate-500">{key}</span>
                                        <span className="font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleClear} className="btn-secondary w-full">
                            Analyze Another File
                        </button>
                    </div>
                )}
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <p className="font-medium mb-2">How it works:</p>
                <p>Files have "magic bytes" at the beginning that identify their type, regardless of file extension. This tool reads those bytes to detect the actual file format.</p>
            </div>
        </div>
    );
}
