import { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

export default function BreakEven() {
  const [fixedCosts, setFixedCosts] = useState<number>(10000);
  const [pricePerUnit, setPricePerUnit] = useState<number>(50);
  const [costPerUnit, setCostPerUnit] = useState<number>(30);
  const [projectedUnits, setProjectedUnits] = useState<number>(1000);

  const contributionMargin = pricePerUnit - costPerUnit;
  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;

  const projectedRevenue = projectedUnits * pricePerUnit;
  const projectedCosts = fixedCosts + (projectedUnits * costPerUnit);
  const projectedProfit = projectedRevenue - projectedCosts;
  const marginOfSafety = projectedUnits > 0 ? ((projectedUnits - breakEvenUnits) / projectedUnits) * 100 : 0;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const formatNumber = (n: number) => n.toLocaleString();

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-500" />
          Break-Even Calculator
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fixed Costs (Total)</label>
            <input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
            <p className="text-xs text-slate-500 mt-1">Rent, salaries, insurance, etc.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price Per Unit</label>
            <input type="number" step="0.01" value={pricePerUnit} onChange={(e) => setPricePerUnit(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Variable Cost Per Unit</label>
            <input type="number" step="0.01" value={costPerUnit} onChange={(e) => setCostPerUnit(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
            <p className="text-xs text-slate-500 mt-1">Materials, labor per unit, etc.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Projected Units (for analysis)</label>
            <input type="number" value={projectedUnits} onChange={(e) => setProjectedUnits(Math.max(0, parseInt(e.target.value) || 0))} className="input-field" />
          </div>
        </div>

        {/* Break-Even Result */}
        <div className={`rounded-xl p-6 text-center mb-6 ${contributionMargin > 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'} text-white`}>
          {contributionMargin > 0 ? (
            <>
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <div className="text-sm opacity-80">Break-Even Point</div>
              <div className="text-5xl font-bold">{formatNumber(breakEvenUnits)} units</div>
              <div className="text-xl opacity-80">{formatCurrency(breakEvenRevenue)} revenue</div>
            </>
          ) : (
            <>
              <div className="text-xl">❌ Cannot calculate</div>
              <div className="opacity-80">Price must be higher than variable cost</div>
            </>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-blue-700 dark:text-blue-300">Contribution Margin</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(contributionMargin)}</div>
            <div className="text-xs text-blue-500">per unit</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-purple-700 dark:text-purple-300">Margin Ratio</div>
            <div className="text-2xl font-bold text-purple-600">
              {pricePerUnit > 0 ? ((contributionMargin / pricePerUnit) * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className={`p-4 rounded-xl text-center ${marginOfSafety >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
            <div className={`text-sm ${marginOfSafety >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>Margin of Safety</div>
            <div className={`text-2xl font-bold ${marginOfSafety >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {marginOfSafety.toFixed(1)}%
            </div>
          </div>
          <div className={`p-4 rounded-xl text-center ${projectedProfit >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
            <div className={`text-sm ${projectedProfit >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>Projected Profit</div>
            <div className={`text-2xl font-bold ${projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(projectedProfit)}
            </div>
          </div>
        </div>

        {/* Visual Chart */}
        {contributionMargin > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
            <h3 className="font-semibold mb-4">Break-Even Analysis</h3>
            <div className="relative h-48">
              {/* Grid */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="border-b border-slate-200 dark:border-slate-700" />
                ))}
              </div>

              {/* Break-even line */}
              <div
                className="absolute left-0 right-0 border-t-2 border-dashed border-green-500"
                style={{ bottom: '50%' }}
              >
                <span className="absolute right-0 -top-5 text-xs text-green-600 bg-slate-50 dark:bg-slate-800 px-1">Break-even</span>
              </div>

              {/* Current position indicator */}
              <div
                className={`absolute w-4 h-4 rounded-full ${projectedUnits >= breakEvenUnits ? 'bg-green-500' : 'bg-red-500'}`}
                style={{
                  left: `${Math.min(90, (projectedUnits / (breakEvenUnits * 2)) * 100)}%`,
                  bottom: `${Math.min(90, Math.max(10, ((projectedUnits - breakEvenUnits) / breakEvenUnits + 1) * 50))}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>0 units</span>
              <span>{formatNumber(breakEvenUnits)} (BE)</span>
              <span>{formatNumber(breakEvenUnits * 2)} units</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Break-Even Point:</strong> Where total revenue equals total costs (no profit, no loss). Contribution Margin = Price - Variable Cost per unit. Break-Even Units = Fixed Costs ÷ Contribution Margin.
      </div>
    </div>
  );
}
