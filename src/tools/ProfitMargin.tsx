import { useState } from 'react';
import { Percent, Calculator } from 'lucide-react';

export default function ProfitMargin() {
  const [cost, setCost] = useState<number>(50);
  const [revenue, setRevenue] = useState<number>(100);
  const [mode, setMode] = useState<'calculate' | 'target'>('calculate');
  const [targetMargin, setTargetMargin] = useState<number>(30);

  // Calculate mode
  const grossProfit = revenue - cost;
  const grossMarginPercent = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const markupPercent = cost > 0 ? (grossProfit / cost) * 100 : 0;

  // Target mode - calculate required price for target margin
  const requiredPrice = cost / (1 - targetMargin / 100);
  const requiredProfit = requiredPrice - cost;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const getMarginColor = (margin: number) => {
    if (margin >= 50) return 'text-green-600';
    if (margin >= 30) return 'text-blue-600';
    if (margin >= 15) return 'text-yellow-600';
    if (margin >= 0) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Percent className="w-6 h-6 text-green-500" />
          Profit Margin Calculator
        </h2>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('calculate')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${mode === 'calculate' ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
          >
            <Calculator className="w-4 h-4 inline mr-2" /> Calculate Margin
          </button>
          <button
            onClick={() => setMode('target')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${mode === 'target' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
          >
            🎯 Find Target Price
          </button>
        </div>

        {mode === 'calculate' ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost / Purchase Price</label>
                <input type="number" step="0.01" value={cost} onChange={(e) => setCost(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Selling Price / Revenue</label>
                <input type="number" step="0.01" value={revenue} onChange={(e) => setRevenue(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
              </div>
            </div>

            {/* Results */}
            <div className={`rounded-xl p-6 text-center mb-6 ${grossProfit >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'} text-white`}>
              <div className="text-sm opacity-80">Gross Profit Margin</div>
              <div className="text-5xl font-bold">{grossMarginPercent.toFixed(1)}%</div>
              <div className="text-lg opacity-80">{formatCurrency(grossProfit)} profit per sale</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
                <div className="text-sm text-blue-700 dark:text-blue-300">Cost</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(cost)}</div>
              </div>
              <div className={`p-4 rounded-xl text-center ${grossProfit >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
                <div className={`text-sm ${grossProfit >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>Profit</div>
                <div className={`text-2xl font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(grossProfit)}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl text-center">
                <div className="text-sm text-purple-700 dark:text-purple-300">Markup</div>
                <div className="text-2xl font-bold text-purple-600">{markupPercent.toFixed(1)}%</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost / Purchase Price</label>
                <input type="number" step="0.01" value={cost} onChange={(e) => setCost(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Margin (%)</label>
                <input type="number" step="1" value={targetMargin} onChange={(e) => setTargetMargin(Math.min(99, Math.max(0, parseFloat(e.target.value) || 0)))} className="input-field" />
              </div>
            </div>

            {/* Target Results */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-center text-white mb-6">
              <div className="text-sm opacity-80">Required Selling Price</div>
              <div className="text-5xl font-bold">{formatCurrency(requiredPrice)}</div>
              <div className="text-lg opacity-80">for {targetMargin}% margin</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
                <div className="text-sm text-blue-700 dark:text-blue-300">Cost</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(cost)}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl text-center">
                <div className="text-sm text-green-700 dark:text-green-300">Required Profit</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(requiredProfit)}</div>
              </div>
            </div>
          </>
        )}

        {/* Reference Table */}
        <div className="mt-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Margin Reference (Cost: {formatCurrency(cost)})</h3>
          <div className="grid grid-cols-5 gap-2 text-center text-sm">
            {[10, 20, 30, 40, 50].map(margin => {
              const price = cost / (1 - margin / 100);
              return (
                <div key={margin} className="bg-white dark:bg-slate-700 p-2 rounded-lg">
                  <div className={`font-bold ${getMarginColor(margin)}`}>{margin}%</div>
                  <div className="text-slate-600 dark:text-slate-400">{formatCurrency(price)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-800 dark:text-green-100">
        <strong>💡 Margin vs Markup:</strong> Profit Margin = (Revenue - Cost) / Revenue. Markup = (Revenue - Cost) / Cost. A 50% margin means you keep half of revenue as profit. They're related but different!
      </div>
    </div>
  );
}
