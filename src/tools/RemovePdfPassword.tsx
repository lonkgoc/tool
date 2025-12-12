import { useState, useRef } from 'react';
import { Upload, Loader, Unlock, AlertCircle } from 'lucide-react';
// @ts-ignore
import { PDFDocument } from 'pdf-lib/dist/pdf-lib.esm.js';

export default function RemovePdfPassword() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f && f.type === 'application/pdf') {
            setFile(f);
            setError('');
        }
    };

    const handleUnlock = async () => {
        if (!file || !password) return;

        setLoading(true);
        setError('');

        try {
            const arrayBuffer = await file.arrayBuffer();

            // Try to load document with provided password
            let pdfDoc;
            try {
                // Cast options to any to bypass type check
                pdfDoc = await PDFDocument.load(arrayBuffer, { password } as any);
            } catch (loadErr) {
                throw new Error('Incorrect password or unable to decrypt.');
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `unlocked-${file.name}`;
            a.click();
            URL.revokeObjectURL(url);

        } catch (err: any) {
            setError('Error processing PDF: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFile(null);
        setPassword('');
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Unlock className="w-6 h-6 text-green-500" />
                    Remove PDF Password
                </h2>

                <label className="cursor-pointer block mb-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-green-500 transition-colors">
                        <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-600 dark:text-slate-400">
                                {file ? file.name : 'Click to upload protected PDF'}
                            </p>
                        </div>
                    </div>
                </label>

                {file && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Current Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="Enter the PDF password..."
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Note: You must know the password to unlock the file. This tool removes the restriction so you can open it without a password in the future.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-red-600 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleUnlock}
                        disabled={!file || !password || loading}
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Unlock className="w-5 h-5" />}
                        {loading ? 'Unlocking...' : 'Remove Password & Download'}
                    </button>
                    {file && (
                        <button onClick={handleClear} className="btn-secondary">Clear</button>
                    )}
                </div>
            </div>
        </div>
    );
}
