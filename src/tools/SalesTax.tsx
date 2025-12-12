import { useState } from 'react';
import { Receipt, Percent } from 'lucide-react';

export default function SalesTax() {
  const [amount, setAmount] = useState<number>(100);
  const [taxRate, setTaxRate] = useState<number>(8.25);
  const [mode, setMode] = useState<'addTax' | 'extractTax'>('addTax');

  // Common US state tax rates
  const commonRates = [
    { state: 'California', rate: 7.25 },
    { state: 'Texas', rate: 6.25 },
    { state: 'New York', rate: 8.0 },
    { state: 'Florida', rate: 6.0 },
    { state: 'Washington', rate: 6.5 },
    { state: 'Tennessee', rate: 7.0 },
    { state: 'No Tax', rate: 0 },
  ];

  let preTax = 0;
  let taxAmount = 0;
  let total = 0;

  if (mode === 'addTax') {
    preTax = amount;
    taxAmount = amount * (taxRate / 100);
    total = amount + taxAmount;
  } else {
    total = amount;
    preTax = amount / (1 + taxRate / 100);
    taxAmount = total - preTax;
  }

  const formatCurrency = (n: number) => '$' + n.toFixed(2);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Receipt className="w-6 h-6 text-green-500" />
          Sales Tax Calculator
        </h2>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('addTax')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${mode === 'addTax' ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
          >
            ➕ Add Tax to Price
          </button>
          <button
            onClick={() => setMode('extractTax')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${mode === 'extractTax' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
          >
            🔍 Extract Tax from Total
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {mode === 'addTax' ? 'Price (before tax)' : 'Total (with tax)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="input-field pl-8 text-xl font-bold"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tax Rate (%)</label>
            <div className="relative">
              <input
                type="number"
                step="0.25"
                value={taxRate}
                onChange={(e) => setTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
                className="input-field pr-8 text-xl font-bold"
              />
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Quick Rates */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Common Rates</label>
          <div className="flex flex-wrap gap-2">
            {commonRates.map(r => (
              <button
                key={r.state}
                onClick={() => setTaxRate(r.rate)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${taxRate === r.rate ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                  }`}
              >
                {r.state} ({r.rate}%)
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm opacity-80">Before Tax</div>
              <div className="text-2xl font-bold">{formatCurrency(preTax)}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <div className="text-sm opacity-80">Tax ({taxRate}%)</div>
              <div className="text-2xl font-bold">+{formatCurrency(taxAmount)}</div>
            </div>
            <div>
              <div className="text-sm opacity-80">Total</div>
              <div className="text-3xl font-bold">{formatCurrency(total)}</div>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Tax on Common Amounts</h3>
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            {[10, 25, 50, 100].map(a => {
              const tax = a * (taxRate / 100);
              return (
                <div key={a} className="bg-white dark:bg-slate-700 p-2 rounded-lg">
                  <div className="text-slate-500">${a}</div>
                  <div className="font-bold text-green-600">+{formatCurrency(tax)}</div>
                  <div className="text-xs text-slate-400">= ${(a + tax).toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-800 dark:text-green-100">
        <strong>💡 Note:</strong> Sales tax rates vary by state and locality. Many areas have combined state + local rates. Some states (OR, MT, NH, DE) have no sales tax at all!
      </div>
    </div>
  );
}
