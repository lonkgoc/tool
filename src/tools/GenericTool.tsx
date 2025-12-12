// Generic tool component for tools that need basic implementation
import { useState } from 'react';
import { Info } from 'lucide-react';

interface GenericToolProps {
  title: string;
  description: string;
  placeholder?: string;
  onProcess?: (input: string) => string | Promise<string>;
  outputLabel?: string;
}

export default function GenericTool({ 
  title, 
  description, 
  placeholder = "Enter input...",
  onProcess,
  outputLabel = "Output"
}: GenericToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    if (!onProcess) return;
    setProcessing(true);
    try {
      const result = await onProcess(input);
      setOutput(result);
    } catch (error) {
      setOutput('Error processing input');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{description}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="w-full input-field h-32"
            />
          </div>

          {onProcess && (
            <button
              onClick={handleProcess}
              disabled={processing || !input.trim()}
              className="btn-primary w-full"
            >
              {processing ? 'Processing...' : 'Process'}
            </button>
          )}

          {output && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {outputLabel}
              </label>
              <textarea
                value={output}
                readOnly
                className="w-full input-field h-32"
              />
            </div>
          )}

          {!onProcess && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This tool is currently in development. Full functionality will be available soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


