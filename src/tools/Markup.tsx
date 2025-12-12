import { useState } from 'react';
import { TrendingUp, Calculator } from 'lucide-react';

export default function Markup() {
  const [cost, setCost] = useState<number>(50);
  const [markupPercent, setMarkupPercent] = useState<number>(50);
  const [mode, setMode] = useState<'calculate' | 'target'>('calculate');
  const [targetPrice, setTargetPrice] = useState<number>(100);

  // Calculate mode
  const markupAmount = cost * (markupPercent / 100);
  const sellingPrice = cost + markupAmount;
  const profitMargin = sellingPrice > 0 ? (markupAmount / sellingPrice) * 100 : 0;

  // Target mode - calculate markup from target price
  const targetMarkupAmount = targetPrice - cost;
  const targetMarkupPercent = cost > 0 ? (targetMarkupAmount / cost) * 100 : 0;
  const targetProfitMargin = targetPrice > 0 ? (targetMarkupAmount / targetPrice) * 100 : 0;

  const formatCurrency = (n: number) => '$' + n.toFixed(2);
  const quickMarkups = [25, 50, 75, 100, 150, 200];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-500" />
          Markup Calculator
        </h2>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('calculate')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium ${mode === 'calculate' ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            <Calculator className="w-4 h-4 inline mr-2" /> Calculate Price
          </button>
          <button
            onClick={() => setMode('target')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium ${mode === 'target' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            🎯 Find Markup %
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost</label>
            <input type="number" step="0.01" value={cost} onChange={(e) => setCost(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          {mode === 'calculate' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Markup (%)</label>
              <input type="number" step="1" value={markupPercent} onChange={(e) => setMarkupPercent(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Selling Price</label>
              <input type="number" step="0.01" value={targetPrice} onChange={(e) => setTargetPrice(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
            </div>
          )}
        </div>

        {mode === 'calculate' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quick Markup</label>
            <div className="flex flex-wrap gap-2">
              {quickMarkups.map(m => (
                <button
                  key={m}
                  onClick={() => setMarkupPercent(m)}
                  className={`px-3 py-2 rounded-lg font-medium ${markupPercent === m ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}
                >
                  {m}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {mode === 'calculate' ? (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white text-center mb-6">
            <div className="text-sm opacity-80">Selling Price</div>
            <div className="text-5xl font-bold">{formatCurrency(sellingPrice)}</div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="opacity-80">Cost</div>
                <div className="font-bold">{formatCurrency(cost)}</div>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="opacity-80">Markup</div>
                <div className="font-bold">+{formatCurrency(markupAmount)}</div>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="opacity-80">Margin</div>
                <div className="font-bold">{profitMargin.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center mb-6">
            <div className="text-sm opacity-80">Required Markup</div>
            <div className="text-5xl font-bold">{targetMarkupPercent.toFixed(1)}%</div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="opacity-80">Cost</div>
                <div className="font-bold">{formatCurrency(cost)}</div>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="opacity-80">Profit</div>
                <div className="font-bold">+{formatCurrency(targetMarkupAmount)}</div>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="opacity-80">Margin</div>
                <div className="font-bold">{targetProfitMargin.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Reference Table */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Markup vs Margin Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2">Markup %</th>
                  <th className="text-center py-2">Price ({formatCurrency(cost)} cost)</th>
                  <th className="text-right py-2">Margin %</th>
                </tr>
              </thead>
              <tbody>
                {[25, 50, 100, 150, 200].map(m => {
                  const price = cost * (1 + m / 100);
                  const margin = (m / (100 + m)) * 100;
                  return (
                    <tr key={m} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-2 font-medium">{m}%</td>
                      <td className="text-center py-2">{formatCurrency(price)}</td>
                      <td className="text-right py-2 text-green-600">{margin.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-800 dark:text-green-100">
        <strong>💡 Markup vs Margin:</strong> Markup is based on cost (Cost × Markup% = Profit). Margin is based on price (Price × Margin% = Profit). A 50% markup = 33.3% margin. A 100% markup = 50% margin.
      </div>
    </div>
  );
}
