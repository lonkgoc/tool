import { useState, useRef } from 'react';
import { Book, Download, Upload, AlertCircle, Loader } from 'lucide-react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';

export default function EpubToPdf() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<Blob | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setResult(null);
            setError('');
        }
    };

    const handleConvert = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const zip = new JSZip();
            const content = await zip.loadAsync(arrayBuffer);

            // 1. Find container.xml to locate OPF
            const containerXml = await content.file('META-INF/container.xml')?.async('text');
            if (!containerXml) throw new Error('Invalid EPUB: META-INF/container.xml not found');

            const parser = new DOMParser();
            const containerDoc = parser.parseFromString(containerXml, 'text/xml');
            const rootFile = containerDoc.querySelector('rootfile');
            const fullPath = rootFile?.getAttribute('full-path');

            if (!fullPath) throw new Error('Invalid EPUB: OPF path not found');

            // 2. Read OPF file
            const opfXml = await content.file(fullPath)?.async('text');
            if (!opfXml) throw new Error('OPF file not found');

            const opfDoc = parser.parseFromString(opfXml, 'text/xml');
            const manifest = opfDoc.getElementsByTagName('manifest')[0];
            const spine = opfDoc.getElementsByTagName('spine')[0];

            if (!manifest || !spine) throw new Error('Invalid OPF: Missing manifest or spine');

            // 3. Map items
            const itemMap: Record<string, string> = {};
            Array.from(manifest.getElementsByTagName('item')).forEach(item => {
                const id = item.getAttribute('id');
                const href = item.getAttribute('href');
                if (id && href) itemMap[id] = href;
            });

            // 4. Iterate spine to get read order
            const itemRefs = Array.from(spine.getElementsByTagName('itemref'));
            const opfDir = fullPath.substring(0, fullPath.lastIndexOf('/') + 1);

            const doc = new jsPDF();
            const margin = 20;
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const maxWidth = pageWidth - margin * 2;
            let firstPage = true;

            doc.setFontSize(11);

            for (const itemRef of itemRefs) {
                const idref = itemRef.getAttribute('idref');
                if (!idref || !itemMap[idref]) continue;

                const href = itemMap[idref];
                const filePath = opfDir + href;

                // Read HTML/XHTML file
                // Note: file path might be relative or absolute, assume relative to OPF for now
                // Also handle special chars in paths if needed (usually EPUBs are simple)
                // Try to find file in zip
                // JSZip paths don't use ./ usually
                const zipPath = filePath.startsWith('./') ? filePath.slice(2) : filePath;
                const htmlContent = await content.file(zipPath)?.async('text');

                if (htmlContent) {
                    const htmlDoc = parser.parseFromString(htmlContent, 'text/html');
                    const text = htmlDoc.body.textContent || '';

                    if (text.trim().length > 0) {
                        if (!firstPage) doc.addPage();
                        firstPage = false;

                        // Add headers/footers
                        const pageCount = doc.getNumberOfPages();
                        doc.setFontSize(9);
                        doc.text(`Page ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

                        doc.setFontSize(11);
                        const lines = doc.splitTextToSize(text.trim().replace(/\n\s*\n/g, '\n\n'), maxWidth);
                        let y = margin;
                        const lineHeight = 7;

                        lines.forEach((line: string) => {
                            if (y > pageHeight - margin - 10) {
                                doc.addPage();
                                y = margin;
                                const pCount = doc.getNumberOfPages();
                                doc.setFontSize(9);
                                doc.text(`Page ${pCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                                doc.setFontSize(11);
                            }
                            doc.text(line, margin, y);
                            y += lineHeight;
                        });
                    }
                }
            }

            setResult(doc.output('blob'));

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error converting EPUB. File might be protected or invalid.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const url = URL.createObjectURL(result);
        const a = document.createElement('a');
        a.href = url;
        a.download = file?.name.replace(/\.epub$/i, '') + '.pdf' || 'ebook.pdf';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Book className="w-6 h-6 text-emerald-600" />
                    EPUB to PDF Converter
                </h2>

                <label className="cursor-pointer block mb-6">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".epub"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-emerald-500 transition-colors">
                        <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-600 dark:text-slate-400">
                                {file ? file.name : 'Click to upload EPUB file'}
                            </p>
                        </div>
                    </div>
                </label>

                {file && (
                    <button
                        onClick={handleConvert}
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin inline mr-2" />
                                Converting...
                            </>
                        ) : (
                            'Convert to PDF'
                        )}
                    </button>
                )}

                {error && (
                    <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <h3 className="text-emerald-800 dark:text-emerald-200 font-medium mb-4">Conversion Success!</h3>
                        <button
                            onClick={handleDownload}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Download PDF
                        </button>
                    </div>
                )}

                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <h3 className="font-medium mb-2">About this tool</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Extracts text content from EPUB chapters and generates a PDF.
                        Images and complex formatting may not be preserved in this basic converter.
                        DRM-protected files are not supported.
                    </p>
                </div>
            </div>
        </div>
    );
}
