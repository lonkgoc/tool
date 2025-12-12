import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Calculator, BarChart3 } from 'lucide-react';

export default function Inflation() {
  const [mode, setMode] = useState<'future' | 'past' | 'rate'>('future');
  const [amount, setAmount] = useState<number>(1000);
  const [rate, setRate] = useState<number>(3);
  const [years, setYears] = useState<number>(10);
  const [pastAmount, setPastAmount] = useState<number>(500);
  const [currentAmount, setCurrentAmount] = useState<number>(650);

  // Future value (how much will $X be worth to buy same goods)
  const futureValue = amount * Math.pow(1 + rate / 100, years);

  // Present value (what is future $X worth today)
  const presentValue = amount / Math.pow(1 + rate / 100, years);

  // Purchasing power loss
  const purchasingPowerLoss = ((futureValue - amount) / amount) * 100;
  const annualLoss = rate;

  // Real rate of inflation between two values
  const calculatedRate = years > 0 && pastAmount > 0
    ? (Math.pow(currentAmount / pastAmount, 1 / years) - 1) * 100
    : 0;

  // Year by year breakdown
  const yearlyBreakdown = [];
  for (let i = 0; i <= years; i++) {
    const value = amount * Math.pow(1 + rate / 100, i);
    const realValue = amount / Math.pow(1 + rate / 100, i);
    yearlyBreakdown.push({
      year: i,
      nominalNeed: value,
      purchasingPower: realValue,
    });
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          Inflation Calculator
        </h2>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setMode('future')}
            className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${mode === 'future'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'border-slate-300 dark:border-slate-600'
              }`}
          >
            Future Cost
          </button>
          <button
            onClick={() => setMode('past')}
            className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${mode === 'past'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'border-slate-300 dark:border-slate-600'
              }`}
          >
            Present Value
          </button>
          <button
            onClick={() => setMode('rate')}
            className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${mode === 'rate'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'border-slate-300 dark:border-slate-600'
              }`}
          >
            Calculate Rate
          </button>
        </div>

        {(mode === 'future' || mode === 'past') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {mode === 'future' ? 'Current Amount ($)' : 'Future Amount ($)'}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Annual Inflation Rate: {rate}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0%</span>
                  <span>Low (2-3%)</span>
                  <span>High (5%+)</span>
                  <span>15%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Years</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
                  className="input-field"
                  min="1"
                  max="50"
                />
              </div>

              {/* Quick year buttons */}
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 15, 20, 25, 30].map(y => (
                  <button
                    key={y}
                    onClick={() => setYears(y)}
                    className={`px-3 py-1 rounded text-sm ${years === y
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                  >
                    {y}y
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {mode === 'future' ? (
                <>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-red-500 mb-2" />
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      To buy what ${amount} buys today, you'll need:
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                      ${futureValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-slate-500">in {years} years</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
                      <div className="text-xs text-slate-500">Price Increase</div>
                      <div className="text-lg font-bold text-orange-600">
                        +{purchasingPowerLoss.toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                      <div className="text-xs text-slate-500">Extra Needed</div>
                      <div className="text-lg font-bold">
                        ${(futureValue - amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-blue-500 mb-2" />
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      ${amount} in {years} years is worth today:
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      ${presentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-slate-500">in today's purchasing power</div>
                  </div>

                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
                    <div className="text-xs text-slate-500">Purchasing Power Lost</div>
                    <div className="text-lg font-bold text-red-600">
                      ${(amount - presentValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {mode === 'rate' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Past Price ($)</label>
                <input
                  type="number"
                  value={pastAmount}
                  onChange={(e) => setPastAmount(Number(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Price ($)</label>
                <input
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(Number(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Years Between</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
                  className="input-field"
                  min="1"
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <Calculator className="w-6 h-6 text-purple-500 mb-2" />
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Average Annual Inflation Rate
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {calculatedRate.toFixed(2)}%
                </div>
                <div className="text-sm text-slate-500">per year over {years} years</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="flex justify-between">
                  <span>Total Increase</span>
                  <span className="font-bold">
                    {pastAmount > 0 ? (((currentAmount / pastAmount) - 1) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Year by Year Table */}
      {(mode === 'future' || mode === 'past') && years <= 20 && (
        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Year-by-Year Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-slate-700">
                  <th className="text-left py-2">Year</th>
                  <th className="text-right py-2">Cost Needed</th>
                  <th className="text-right py-2">$100 Worth</th>
                </tr>
              </thead>
              <tbody>
                {yearlyBreakdown.filter((_, i) => i % (years > 10 ? 2 : 1) === 0).map((row) => (
                  <tr key={row.year} className="border-b dark:border-slate-700">
                    <td className="py-2">{row.year === 0 ? 'Today' : `Year ${row.year}`}</td>
                    <td className="text-right">${row.nominalNeed.toFixed(0)}</td>
                    <td className="text-right text-red-600">${row.purchasingPower.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
        <p className="font-medium mb-2">Understanding Inflation:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Historical US inflation averages about 3% per year</li>
          <li>The "Rule of 72": divide 72 by inflation rate to see when prices double</li>
          <li>At 3% inflation, prices double in ~24 years</li>
          <li>At 7% inflation, prices double in ~10 years</li>
        </ul>
      </div>
    </div>
  );
}
