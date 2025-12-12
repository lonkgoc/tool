import { useState, useRef } from 'react';
import { Upload, Download, Loader, Image as ImageIcon, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PdfToImages() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [scale, setScale] = useState(2);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f && f.type === 'application/pdf') {
            setFile(f);
            setError('');
            setImages([]);
            setProgress(0);
        }
    };

    const handleConvert = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        setImages([]);
        setProgress(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const totalPages = pdf.numPages;
            const newImages: string[] = [];

            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d')!;
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: context, viewport }).promise;

                const imageUrl = canvas.toDataURL('image/png');
                newImages.push(imageUrl);
                setProgress(Math.round((pageNum / totalPages) * 100));
            }

            setImages(newImages);
        } catch (err: any) {
            setError(err.message || 'Error converting PDF');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (index: number) => {
        const a = document.createElement('a');
        a.href = images[index];
        a.download = `${file?.name.replace('.pdf', '')}_page_${index + 1}.png`;
        a.click();
    };

    const handleDownloadAll = () => {
        images.forEach((img, index) => {
            setTimeout(() => {
                const a = document.createElement('a');
                a.href = img;
                a.download = `${file?.name.replace('.pdf', '')}_page_${index + 1}.png`;
                a.click();
            }, index * 200);
        });
    };

    const handleClear = () => {
        setFile(null);
        setImages([]);
        setError('');
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-blue-500" />
                    PDF to Images
                </h2>

                <label className="cursor-pointer block mb-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 transition-colors">
                        <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-600 dark:text-slate-400">
                                {file ? file.name : 'Click to upload PDF'}
                            </p>
                        </div>
                    </div>
                </label>

                {file && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Quality Scale: {scale}x</label>
                        <input
                            type="range"
                            min="1"
                            max="4"
                            step="0.5"
                            value={scale}
                            onChange={(e) => setScale(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Low (1x)</span>
                            <span>High (4x)</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <button
                    onClick={handleConvert}
                    disabled={!file || loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mb-4"
                >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                    {loading ? `Converting... ${progress}%` : 'Convert to Images'}
                </button>

                {loading && (
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                )}

                {images.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="font-medium">{images.length} Pages Converted</p>
                            <div className="flex gap-2">
                                <button onClick={handleDownloadAll} className="btn-secondary text-sm">
                                    Download All
                                </button>
                                <button onClick={handleClear} className="btn-secondary text-sm">
                                    Clear
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={img}
                                        alt={`Page ${index + 1}`}
                                        className="rounded border border-slate-200 dark:border-slate-700 w-full"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                                        <button
                                            onClick={() => handleDownload(index)}
                                            className="bg-white text-slate-900 px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            <Download className="w-4 h-4 inline mr-1" /> Page {index + 1}
                                        </button>
                                    </div>
                                    <div className="text-center text-sm text-slate-500 mt-1">Page {index + 1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
