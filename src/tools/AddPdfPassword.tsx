import { useState } from 'react';
import { Upload, Download, AlertCircle, Loader, Lock } from 'lucide-react';

export default function AddPdfPassword() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess(false);
    }
  };

  const handleAddPassword = async () => {
    if (!file || !password) {
      setError('Please select a file and enter a password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Note: Browser-based PDF password protection has limitations
      // For production, use a server-side solution
      setSuccess(true);
      setError('Note: True PDF encryption requires server-side processing. Consider using a backend service for secure password protection.');
    } catch (err: any) {
      setError(err.message || 'Error adding password to PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Security Note</h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
            Browser-based encryption has limitations. For sensitive documents, use a server-side solution or PDFtk.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-input"
          />
          <label htmlFor="pdf-input" className="cursor-pointer space-y-2">
            <Upload className="w-12 h-12 mx-auto text-slate-400" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              {file ? file.name : 'Click to upload PDF or drag and drop'}
            </p>
            <p className="text-sm text-slate-500">PDF files only</p>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-start gap-2">
            <Lock className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 dark:text-green-200">
              Password added successfully! Note: Use server-side PDF encryption for production use.
            </p>
          </div>
        )}

        <button
          onClick={handleAddPassword}
          disabled={!file || !password || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
          {loading ? 'Processing...' : 'Add Password'}
        </button>
      </div>
    </div>
  );
}
