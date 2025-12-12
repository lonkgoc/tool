import { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      alert('Please select at least one character type');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (password.length < 8) return { level: 'Weak', color: 'text-red-500' };
    if (password.length < 12) return { level: 'Medium', color: 'text-yellow-500' };
    if (password.length < 16) return { level: 'Strong', color: 'text-green-500' };
    return { level: 'Very Strong', color: 'text-green-600' };
  };

  const strength = password ? getStrength() : null;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Password Length: {length}
        </label>
        <input
          type="range"
          min="4"
          max="128"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <span className="text-slate-700 dark:text-slate-300">Include Uppercase (A-Z)</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <span className="text-slate-700 dark:text-slate-300">Include Lowercase (a-z)</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <span className="text-slate-700 dark:text-slate-300">Include Numbers (0-9)</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <span className="text-slate-700 dark:text-slate-300">Include Symbols (!@#$%...)</span>
        </label>
      </div>

      <button
        onClick={generatePassword}
        className="btn-primary w-full flex items-center justify-center space-x-2"
      >
        <RefreshCw className="w-5 h-5" />
        <span>Generate Password</span>
      </button>

      {password && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={password}
              readOnly
              className="flex-1 input-field font-mono text-lg"
            />
            <button
              onClick={copyToClipboard}
              className="btn-secondary p-3"
              aria-label="Copy password"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          {strength && (
            <div className="text-center">
              <span className={`font-semibold ${strength.color}`}>
                Strength: {strength.level}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

