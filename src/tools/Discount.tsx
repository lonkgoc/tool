import { useState } from 'react';
import { Tag, Percent } from 'lucide-react';

export default function Discount() {
  const [originalPrice, setOriginalPrice] = useState<number>(100);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [mode, setMode] = useState<'percent' | 'amount' | 'final'>('percent');
  const [discountAmount, setDiscountAmount] = useState<number>(20);
  const [finalPrice, setFinalPrice] = useState<number>(80);

  let calculatedDiscount = 0;
  let calculatedFinal = 0;
  let calculatedPercent = 0;

  switch (mode) {
    case 'percent':
      calculatedDiscount = originalPrice * (discountPercent / 100);
      calculatedFinal = originalPrice - calculatedDiscount;
      calculatedPercent = discountPercent;
      break;
    case 'amount':
      calculatedDiscount = discountAmount;
      calculatedFinal = originalPrice - discountAmount;
      calculatedPercent = originalPrice > 0 ? (discountAmount / originalPrice) * 100 : 0;
      break;
    case 'final':
      calculatedDiscount = originalPrice - finalPrice;
      calculatedFinal = finalPrice;
      calculatedPercent = originalPrice > 0 ? (calculatedDiscount / originalPrice) * 100 : 0;
      break;
  }

  const savings = calculatedDiscount;

  const formatCurrency = (n: number) => '$' + n.toFixed(2);
  const quickDiscounts = [10, 15, 20, 25, 30, 40, 50, 75];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Tag className="w-6 h-6 text-red-500" />
          Discount Calculator
        </h2>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setMode('percent')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${mode === 'percent' ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
            <Percent className="w-4 h-4 inline mr-1" /> By Percent
          </button>
          <button onClick={() => setMode('amount')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${mode === 'amount' ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
            💵 By Amount
          </button>
          <button onClick={() => setMode('final')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${mode === 'final' ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
            🏷️ By Final Price
          </button>
        </div>

        {/* Original Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Original Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">$</span>
            <input
              type="number"
              step="0.01"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field pl-8 text-xl font-bold"
            />
          </div>
        </div>

        {/* Discount Input based on mode */}
        {mode === 'percent' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Discount Percentage</label>
            <div className="flex gap-2 flex-wrap mb-3">
              {quickDiscounts.map(d => (
                <button
                  key={d}
                  onClick={() => setDiscountPercent(d)}
                  className={`px-3 py-2 rounded-lg font-medium ${discountPercent === d ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}
                >
                  {d}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-2xl font-bold text-red-600 mt-2">{discountPercent}% OFF</div>
          </div>
        )}

        {mode === 'amount' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Discount Amount</label>
            <input
              type="number"
              step="0.01"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field"
            />
          </div>
        )}

        {mode === 'final' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Final Price After Discount</label>
            <input
              type="number"
              step="0.01"
              value={finalPrice}
              onChange={(e) => setFinalPrice(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field"
            />
          </div>
        )}

        {/* Results */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white text-center mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm opacity-80">Original</div>
              <div className="text-xl font-bold line-through opacity-70">{formatCurrency(originalPrice)}</div>
            </div>
            <div>
              <div className="text-sm opacity-80">You Save</div>
              <div className="text-2xl font-bold">{formatCurrency(savings)}</div>
              <div className="text-sm opacity-80">({calculatedPercent.toFixed(1)}% off)</div>
            </div>
            <div>
              <div className="text-sm opacity-80">Final Price</div>
              <div className="text-3xl font-bold">{formatCurrency(calculatedFinal)}</div>
            </div>
          </div>
        </div>

        {/* Price Comparison Table */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Quick Reference ({formatCurrency(originalPrice)})</h3>
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            {[10, 20, 30, 50].map(d => (
              <div key={d} className="bg-white dark:bg-slate-700 p-2 rounded-lg">
                <div className="font-bold text-red-600">{d}% off</div>
                <div className="text-slate-600 dark:text-slate-400">{formatCurrency(originalPrice * (1 - d / 100))}</div>
                <div className="text-xs text-green-600">Save {formatCurrency(originalPrice * d / 100)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-800 dark:text-red-100">
        <strong>🛒 Shopping Tip:</strong> A 50% discount doubles your purchasing power! Compare the savings to see if a bigger discount on a more expensive item is actually a better deal.
      </div>
    </div>
  );
}
