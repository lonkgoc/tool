import { useState } from 'react';
import { Receipt, Users, Percent } from 'lucide-react';

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState<number>(50);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [numPeople, setNumPeople] = useState<number>(1);
  const [customTip, setCustomTip] = useState<string>('');

  const tipPresets = [10, 15, 18, 20, 25, 30];
  const activeTip = customTip ? parseFloat(customTip) : tipPercent;

  const tipAmount = billAmount * (activeTip / 100);
  const totalAmount = billAmount + tipAmount;
  const perPerson = numPeople > 0 ? totalAmount / numPeople : totalAmount;
  const tipPerPerson = numPeople > 0 ? tipAmount / numPeople : tipAmount;

  const handlePresetClick = (percent: number) => {
    setTipPercent(percent);
    setCustomTip('');
  };

  const formatCurrency = (n: number) => '$' + n.toFixed(2);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Receipt className="w-6 h-6 text-green-500" />
          Tip Calculator
        </h2>

        {/* Bill Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Bill Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">$</span>
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field pl-8 text-2xl font-bold"
              step="0.01"
            />
          </div>
        </div>

        {/* Tip Percentage */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Tip Percentage
          </label>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {tipPresets.map(percent => (
              <button
                key={percent}
                onClick={() => handlePresetClick(percent)}
                className={`py-3 rounded-lg font-bold transition-all ${tipPercent === percent && !customTip
                    ? 'bg-green-500 text-white shadow-lg scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
              >
                {percent}%
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Custom:</span>
            <input
              type="number"
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              placeholder="Enter %"
              className="input-field w-24"
              step="0.5"
            />
            <Percent className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Number of People */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" /> Split Between
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
              className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 text-2xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              -
            </button>
            <input
              type="number"
              value={numPeople}
              onChange={(e) => setNumPeople(Math.max(1, parseInt(e.target.value) || 1))}
              className="input-field w-20 text-center text-xl font-bold"
              min="1"
            />
            <button
              onClick={() => setNumPeople(numPeople + 1)}
              className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 text-2xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              +
            </button>
            <span className="text-slate-500 dark:text-slate-400">
              {numPeople === 1 ? 'person' : 'people'}
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm opacity-80">Tip Amount</div>
              <div className="text-3xl font-bold">{formatCurrency(tipAmount)}</div>
            </div>
            <div>
              <div className="text-sm opacity-80">Total Bill</div>
              <div className="text-3xl font-bold">{formatCurrency(totalAmount)}</div>
            </div>
          </div>

          {numPeople > 1 && (
            <div className="border-t border-white/30 pt-4 mt-4">
              <div className="text-center">
                <div className="text-sm opacity-80">Each Person Pays</div>
                <div className="text-4xl font-bold">{formatCurrency(perPerson)}</div>
                <div className="text-sm opacity-80 mt-1">
                  (includes {formatCurrency(tipPerPerson)} tip)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Reference */}
        <div className="mt-6 bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Quick Tip Reference</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {[15, 18, 20].map(p => (
              <div key={p} className="text-center p-2 bg-white dark:bg-slate-700 rounded">
                <div className="font-bold text-green-600 dark:text-green-400">{p}%</div>
                <div className="text-slate-600 dark:text-slate-400">{formatCurrency(billAmount * p / 100)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-800 dark:text-green-100">
        <strong>💡 Tipping Guide:</strong> 15-18% for average service, 18-20% for good service, 20%+ for exceptional service. In the US, tips are a significant part of server income.
      </div>
    </div>
  );
}
