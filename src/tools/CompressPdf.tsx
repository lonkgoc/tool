import { useState, useRef } from 'react';
import { Upload, Download, Loader, Minimize2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function CompressPdf() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<Blob | null>(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f && f.type === 'application/pdf') {
            setFile(f);
            setOriginalSize(f.size);
            setError('');
            setResult(null);
            setCompressedSize(0);
        }
    };

    const handleCompress = async () => {
        if (!file) return;
        setLoading(true);
        setError('');

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);

            // Remove metadata to reduce size
            pdf.setTitle('');
            pdf.setAuthor('');
            pdf.setSubject('');
            pdf.setKeywords([]);
            pdf.setProducer('');
            pdf.setCreator('');

            const bytes = await pdf.save({
                useObjectStreams: true,
                addDefaultPage: false,
            });

            const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
            setResult(blob);
            setCompressedSize(blob.size);
        } catch (err: any) {
            setError(err.message || 'Error compressing PDF');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const url = URL.createObjectURL(result);
        const a = document.createElement('a');
        a.href = url;
        a.download = file?.name.replace('.pdf', '_compressed.pdf') || 'compressed.pdf';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        setFile(null);
        setResult(null);
        setOriginalSize(0);
        setCompressedSize(0);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const compressionRate = originalSize && compressedSize
        ? Math.round((1 - compressedSize / originalSize) * 100)
        : 0;

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Minimize2 className="w-6 h-6 text-pink-500" />
                    Compress PDF
                </h2>

                <label className="cursor-pointer block mb-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-pink-500 transition-colors">
                        <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-600 dark:text-slate-400">
                                {file ? file.name : 'Click to upload PDF'}
                            </p>
                            {originalSize > 0 && <p className="text-sm text-slate-500">Original: {formatSize(originalSize)}</p>}
                        </div>
                    </div>
                </label>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl">{error}</div>
                )}

                <button
                    onClick={handleCompress}
                    disabled={!file || loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Minimize2 className="w-5 h-5" />}
                    {loading ? 'Compressing...' : 'Compress PDF'}
                </button>

                {result && (
                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                <div className="font-bold text-lg">{formatSize(originalSize)}</div>
                                <div className="text-sm text-slate-500">Original</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                <div className="font-bold text-lg">{formatSize(compressedSize)}</div>
                                <div className="text-sm text-slate-500">Compressed</div>
                            </div>
                            <div className={`p-4 rounded-xl ${compressionRate > 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-yellow-50 dark:bg-yellow-900/30'}`}>
                                <div className={`font-bold text-lg ${compressionRate > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {compressionRate > 0 ? `-${compressionRate}%` : '0%'}
                                </div>
                                <div className="text-sm text-slate-500">Saved</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleDownload} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                <Download className="w-5 h-5" /> Download
                            </button>
                            <button onClick={handleClear} className="btn-secondary">Clear</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="text-sm text-slate-500 bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-xl">
                <strong>Note:</strong> This removes metadata and uses object streams to reduce file size. For heavy compression of images inside PDFs, professional tools like Adobe Acrobat are required.
            </div>
        </div>
    );
}
