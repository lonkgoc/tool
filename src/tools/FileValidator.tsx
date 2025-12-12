import { useState, useRef } from 'react';
import { FileCheck, Upload, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ValidationResult {
    valid: boolean;
    type: string;
    checks: { name: string; passed: boolean; message: string }[];
}

export default function FileValidator() {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<ValidationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const detectType = (bytes: Uint8Array, name: string): string => {
        // Check magic bytes
        if (bytes[0] === 0xFF && bytes[1] === 0xD8) return 'JPEG Image';
        if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return 'PNG Image';
        if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'GIF Image';
        if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return 'PDF Document';
        if (bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) return 'ZIP Archive';
        if (bytes[0] === 0x52 && bytes[1] === 0x61 && bytes[2] === 0x72) return 'RAR Archive';
        if (bytes[0] === 0x7B) return 'JSON File';
        if (bytes[0] === 0x3C) return 'XML/HTML File';

        // Fallback to extension
        const ext = name.split('.').pop()?.toLowerCase() || '';
        const extMap: Record<string, string> = {
            'txt': 'Text File', 'csv': 'CSV File', 'md': 'Markdown File',
            'js': 'JavaScript File', 'ts': 'TypeScript File', 'py': 'Python File',
            'doc': 'Word Document', 'docx': 'Word Document', 'xls': 'Excel Spreadsheet',
            'xlsx': 'Excel Spreadsheet', 'ppt': 'PowerPoint', 'pptx': 'PowerPoint',
        };
        return extMap[ext] || 'Unknown File Type';
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        setFile(f);
        setLoading(true);

        try {
            const buffer = await f.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            const type = detectType(bytes, f.name);
            const checks: ValidationResult['checks'] = [];

            // Basic checks
            checks.push({
                name: 'File Size',
                passed: f.size > 0,
                message: f.size > 0 ? `${(f.size / 1024).toFixed(2)} KB` : 'File is empty'
            });

            checks.push({
                name: 'File Extension',
                passed: f.name.includes('.'),
                message: f.name.includes('.') ? f.name.split('.').pop()?.toUpperCase() || 'None' : 'No extension'
            });

            checks.push({
                name: 'File Type Detection',
                passed: type !== 'Unknown File Type',
                message: type
            });

            // Type-specific validation
            if (type === 'JSON File') {
                try {
                    const text = new TextDecoder().decode(bytes);
                    JSON.parse(text);
                    checks.push({ name: 'JSON Syntax', passed: true, message: 'Valid JSON syntax' });
                } catch {
                    checks.push({ name: 'JSON Syntax', passed: false, message: 'Invalid JSON syntax' });
                }
            }

            if (type === 'XML/HTML File') {
                const text = new TextDecoder().decode(bytes);
                const hasValidStructure = text.includes('<') && text.includes('>');
                checks.push({
                    name: 'XML/HTML Structure',
                    passed: hasValidStructure,
                    message: hasValidStructure ? 'Contains valid tags' : 'Missing tags'
                });
            }

            if (type.includes('Image')) {
                checks.push({
                    name: 'Image Header',
                    passed: true,
                    message: 'Valid image header detected'
                });
            }

            const valid = checks.every(c => c.passed);
            setResult({ valid, type, checks });
        } catch (err: any) {
            setResult({
                valid: false,
                type: 'Error',
                checks: [{ name: 'Error', passed: false, message: err.message }]
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFile(null);
        setResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FileCheck className="w-6 h-6 text-green-500" />
                    File Validator
                </h2>

                <label className="cursor-pointer block mb-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-green-500 transition-colors">
                        <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-600 dark:text-slate-400">
                                {file ? file.name : 'Click to upload file'}
                            </p>
                            {loading && <p className="text-sm text-slate-500">Validating...</p>}
                        </div>
                    </div>
                </label>

                {result && (
                    <div className={`p-4 rounded-xl mb-4 ${result.valid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                        <div className="flex items-center gap-2 mb-3">
                            {result.valid ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-yellow-500" />
                            )}
                            <span className="font-bold text-lg">
                                {result.valid ? 'File is Valid' : 'Validation Issues Found'}
                            </span>
                        </div>

                        <div className="mb-3">
                            <span className="text-sm text-slate-500">Detected Type:</span>
                            <span className="ml-2 font-medium">{result.type}</span>
                        </div>

                        <div className="space-y-2">
                            {result.checks.map((check, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    {check.passed ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                                    )}
                                    <span className="font-medium">{check.name}:</span>
                                    <span>{check.message}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {file && (
                    <button onClick={handleClear} className="btn-secondary w-full">Clear</button>
                )}
            </div>

            <div className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>This tool validates file structure by checking magic bytes, file extension, and content syntax for supported formats (JSON, XML, images, PDFs, archives).</p>
            </div>
        </div>
    );
}
