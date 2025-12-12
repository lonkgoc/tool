import { Presentation } from 'lucide-react';

export default function PdfToPpt() {
    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Presentation className="w-6 h-6 text-orange-600" />
                    PDF to PPT
                </h2>
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                    <p>Converting PDF slides back to editable PowerPoint presentation is widely supported by desktop PDF editors.</p>
                </div>
            </div>
        </div>
    );
}
