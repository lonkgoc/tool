import { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Info, MapPin, Camera, Calendar } from 'lucide-react';

interface ExifData {
    [key: string]: string | number | undefined;
}

export default function ExifViewer() {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [exifData, setExifData] = useState<ExifData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        setFile(selectedFile);
        setError('');
        setLoading(true);

        // Create preview URL
        const url = URL.createObjectURL(selectedFile);
        setImageUrl(url);

        try {
            const exif = await extractExif(selectedFile);
            setExifData(exif);
        } catch (err: any) {
            setError('Could not extract EXIF data. This image may not contain metadata.');
            setExifData(null);
        } finally {
            setLoading(false);
        }
    };

    const extractExif = async (file: File): Promise<ExifData> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const view = new DataView(e.target?.result as ArrayBuffer);

                // Check for JPEG
                if (view.getUint16(0) !== 0xFFD8) {
                    resolve(getBasicInfo(file));
                    return;
                }

                const exif: ExifData = getBasicInfo(file);
                let offset = 2;

                while (offset < view.byteLength) {
                    if (view.getUint8(offset) !== 0xFF) break;

                    const marker = view.getUint8(offset + 1);

                    // APP1 marker (EXIF)
                    if (marker === 0xE1) {
                        const length = view.getUint16(offset + 2);
                        const exifOffset = offset + 4;

                        // Check for EXIF header
                        const exifHeader = String.fromCharCode(
                            view.getUint8(exifOffset),
                            view.getUint8(exifOffset + 1),
                            view.getUint8(exifOffset + 2),
                            view.getUint8(exifOffset + 3)
                        );

                        if (exifHeader === 'Exif') {
                            const tiffOffset = exifOffset + 6;
                            const littleEndian = view.getUint16(tiffOffset) === 0x4949;

                            const ifdOffset = view.getUint32(tiffOffset + 4, littleEndian);
                            const numEntries = view.getUint16(tiffOffset + ifdOffset, littleEndian);

                            for (let i = 0; i < numEntries; i++) {
                                const entryOffset = tiffOffset + ifdOffset + 2 + (i * 12);
                                const tag = view.getUint16(entryOffset, littleEndian);
                                const type = view.getUint16(entryOffset + 2, littleEndian);
                                const count = view.getUint32(entryOffset + 4, littleEndian);

                                // Common EXIF tags
                                switch (tag) {
                                    case 0x010F: exif.Make = readString(view, tiffOffset, entryOffset, littleEndian); break;
                                    case 0x0110: exif.Model = readString(view, tiffOffset, entryOffset, littleEndian); break;
                                    case 0x0112: exif.Orientation = view.getUint16(entryOffset + 8, littleEndian); break;
                                    case 0x011A: exif.XResolution = readRational(view, tiffOffset, entryOffset + 8, littleEndian); break;
                                    case 0x011B: exif.YResolution = readRational(view, tiffOffset, entryOffset + 8, littleEndian); break;
                                    case 0x0132: exif.DateTime = readString(view, tiffOffset, entryOffset, littleEndian); break;
                                }
                            }
                        }
                        break;
                    }

                    const length = view.getUint16(offset + 2);
                    offset += 2 + length;
                }

                resolve(exif);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const getBasicInfo = (file: File): ExifData => {
        return {
            FileName: file.name,
            FileSize: formatFileSize(file.size),
            FileType: file.type,
            LastModified: new Date(file.lastModified).toLocaleString(),
        };
    };

    const readString = (view: DataView, tiffOffset: number, entryOffset: number, littleEndian: boolean): string => {
        try {
            const count = view.getUint32(entryOffset + 4, littleEndian);
            let valueOffset = entryOffset + 8;

            if (count > 4) {
                valueOffset = tiffOffset + view.getUint32(entryOffset + 8, littleEndian);
            }

            let str = '';
            for (let i = 0; i < count - 1; i++) {
                str += String.fromCharCode(view.getUint8(valueOffset + i));
            }
            return str;
        } catch {
            return '';
        }
    };

    const readRational = (view: DataView, tiffOffset: number, offset: number, littleEndian: boolean): number => {
        try {
            const valueOffset = tiffOffset + view.getUint32(offset, littleEndian);
            const num = view.getUint32(valueOffset, littleEndian);
            const den = view.getUint32(valueOffset + 4, littleEndian);
            return den ? num / den : 0;
        } catch {
            return 0;
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const handleClear = () => {
        setFile(null);
        setImageUrl(null);
        setExifData(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const exportExif = () => {
        if (!exifData) return;
        let text = '=== EXIF Data ===\n\n';
        for (const [key, value] of Object.entries(exifData)) {
            text += `${key}: ${value}\n`;
        }
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file?.name || 'image'}-exif.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Info className="w-6 h-6 text-blue-500" />
                    EXIF Data Viewer
                </h2>

                {/* Upload */}
                <label className="cursor-pointer block mb-6">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 transition-colors">
                        <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-600 dark:text-slate-400">Click to upload image or drag and drop</p>
                            <p className="text-sm text-slate-500 mt-1">JPG, PNG, TIFF, HEIC</p>
                        </div>
                    </div>
                </label>

                {error && (
                    <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-xl">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-slate-600">Reading EXIF data...</p>
                    </div>
                )}

                {imageUrl && exifData && !loading && (
                    <div className="space-y-6">
                        {/* Image Preview */}
                        <div className="text-center">
                            <img
                                src={imageUrl}
                                alt="Preview"
                                className="max-h-64 mx-auto rounded-xl border border-slate-200 dark:border-slate-700"
                            />
                        </div>

                        {/* EXIF Data */}
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Camera className="w-5 h-5" /> Image Metadata
                                </h3>
                                <button onClick={exportExif} className="btn-secondary text-sm flex items-center gap-1">
                                    <Download className="w-4 h-4" /> Export
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(exifData).map(([key, value]) => (
                                    <div key={key} className="flex justify-between p-3 bg-white dark:bg-slate-900 rounded-lg">
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{key}</span>
                                        <span className="text-sm text-slate-900 dark:text-slate-100 text-right max-w-[60%] truncate">
                                            {String(value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleClear} className="btn-secondary w-full">
                            Clear & Upload New Image
                        </button>
                    </div>
                )}
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <p className="font-medium mb-2">What is EXIF data?</p>
                <p>EXIF (Exchangeable Image File Format) contains metadata about images including camera model, date taken, exposure settings, GPS coordinates, and more. Not all images contain EXIF data.</p>
            </div>
        </div>
    );
}
