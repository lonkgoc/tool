import { useState } from 'react';
import { Globe, Calculator } from 'lucide-react';

export default function Vat() {
  const [amount, setAmount] = useState<number>(100);
  const [vatRate, setVatRate] = useState<number>(20);
  const [mode, setMode] = useState<'addVat' | 'extractVat'>('addVat');

  const commonRates = [
    { country: 'UK', rate: 20 },
    { country: 'Germany', rate: 19 },
    { country: 'France', rate: 20 },
    { country: 'Italy', rate: 22 },
    { country: 'Spain', rate: 21 },
    { country: 'Netherlands', rate: 21 },
    { country: 'Sweden', rate: 25 },
    { country: 'Canada (HST)', rate: 13 },
  ];

  let netAmount = 0;
  let vatAmount = 0;
  let grossAmount = 0;

  if (mode === 'addVat') {
    netAmount = amount;
    vatAmount = amount * (vatRate / 100);
    grossAmount = amount + vatAmount;
  } else {
    grossAmount = amount;
    netAmount = amount / (1 + vatRate / 100);
    vatAmount = grossAmount - netAmount;
  }

  const formatCurrency = (n: number) => '$' + n.toFixed(2);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-500" />
          VAT Calculator
        </h2>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('addVat')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${mode === 'addVat' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
          >
            ➕ Add VAT to Price
          </button>
          <button
            onClick={() => setMode('extractVat')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${mode === 'extractVat' ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
          >
            🔍 Extract VAT from Total
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {mode === 'addVat' ? 'Net Amount (excl. VAT)' : 'Gross Amount (incl. VAT)'}
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field text-xl font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">VAT Rate (%)</label>
            <input
              type="number"
              step="0.5"
              value={vatRate}
              onChange={(e) => setVatRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field text-xl font-bold"
            />
          </div>
        </div>

        {/* Common Rates */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Common VAT Rates</label>
          <div className="flex flex-wrap gap-2">
            {commonRates.map(r => (
              <button
                key={r.country}
                onClick={() => setVatRate(r.rate)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${vatRate === r.rate ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                  }`}
              >
                {r.country} ({r.rate}%)
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm opacity-80">Net (excl. VAT)</div>
              <div className="text-2xl font-bold">{formatCurrency(netAmount)}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-sm opacity-80">VAT ({vatRate}%)</div>
              <div className="text-2xl font-bold">+{formatCurrency(vatAmount)}</div>
            </div>
            <div>
              <div className="text-sm opacity-80">Gross (incl. VAT)</div>
              <div className="text-3xl font-bold">{formatCurrency(grossAmount)}</div>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4" /> VAT at {vatRate}% for Common Amounts
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            {[50, 100, 250, 500].map(a => {
              const vat = a * (vatRate / 100);
              return (
                <div key={a} className="bg-white dark:bg-slate-700 p-2 rounded-lg">
                  <div className="text-slate-500">Net ${a}</div>
                  <div className="font-bold text-blue-600">+ ${vat.toFixed(2)}</div>
                  <div className="text-xs text-slate-400">= ${(a + vat).toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 VAT (Value Added Tax):</strong> Similar to sales tax but applied at each stage of production. Standard rates vary by country: UK 20%, Germany 19%, Ireland 23%, Switzerland 7.7%.
      </div>
    </div>
  );
}
