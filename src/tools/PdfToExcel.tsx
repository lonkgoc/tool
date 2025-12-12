import { FileSpreadsheet } from 'lucide-react';

export default function PdfToExcel() {
    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    PDF to Excel
                </h2>
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                    <p>Extracting tabular data from PDF to Excel requires advanced table recognition.</p>
                </div>
            </div>
        </div>
    );
}
