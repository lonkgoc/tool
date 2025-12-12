import { useState, useRef } from 'react';
import { BookOpen, Download, Upload, AlertCircle, Loader } from 'lucide-react';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToEpub() {
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
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            const zip = new JSZip();
            const mimetype = 'application/epub+zip';
            zip.file('mimetype', mimetype);

            // META-INF
            const containerXml = `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>`;
            zip.folder('META-INF')?.file('container.xml', containerXml);

            let manifestItems = '';
            let spineItems = '';
            let navPoints = '';

            // Extract pages
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const text = textContent.items.map((item: any) => item.str).join(' '); // Simple join

                // Create clean XHTML
                const xhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Page ${i}</title>
</head>
<body>
  <h1>Page ${i}</h1>
  <p>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
</body>
</html>`;

                const filename = `page_${i}.xhtml`;
                zip.file(filename, xhtml);

                manifestItems += `<item id="page_${i}" href="${filename}" media-type="application/xhtml+xml"/>\n`;
                spineItems += `<itemref idref="page_${i}"/>\n`;
                navPoints += `<navPoint id="navPoint-${i}" playOrder="${i}">
    <navLabel><text>Page ${i}</text></navLabel>
    <content src="${filename}"/>
</navPoint>\n`;
            }

            // Create NCX (Navigation)
            const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head>
    <meta name="dtb:uid" content="urn:uuid:12345"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="${pdf.numPages}"/>
    <meta name="dtb:maxPageNumber" content="${pdf.numPages}"/>
</head>
<docTitle><text>${file.name}</text></docTitle>
<navMap>
${navPoints}
</navMap>
</ncx>`;
            zip.file('toc.ncx', ncx);

            // Create OPF
            const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
        <dc:title>${file.name}</dc:title>
        <dc:language>en</dc:language>
        <dc:identifier id="BookId" opf:scheme="UUID">urn:uuid:12345</dc:identifier>
        <dc:creator>Auto Generated</dc:creator>
    </metadata>
    <manifest>
        <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
        ${manifestItems}
    </manifest>
    <spine toc="ncx">
        ${spineItems}
    </spine>
</package>`;
            zip.file('content.opf', opf);

            const content = await zip.generateAsync({ type: 'blob' });
            setResult(content);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error converting PDF to EPUB');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const url = URL.createObjectURL(result);
        const a = document.createElement('a');
        a.href = url;
        a.download = file?.name.replace(/\.pdf$/i, '') + '.epub' || 'document.epub';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                    PDF to EPUB Converter
                </h2>

                <label className="cursor-pointer block mb-6">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-emerald-500 transition-colors">
                        <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-600 dark:text-slate-400">
                                {file ? file.name : 'Click to upload PDF file'}
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
                            'Convert to EPUB'
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
                            Download EPUB
                        </button>
                    </div>
                )}

                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-sm text-slate-500">
                        Note: This converter extracts text from the PDF and creates a simple EPUB. Layout and complex formatting may not be preserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
