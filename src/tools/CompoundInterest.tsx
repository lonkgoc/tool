import { useState, useEffect } from 'react';
import { TrendingUp, Download } from 'lucide-react';

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState<number>(() => {
    const saved = localStorage.getItem('compoundInterest');
    return saved ? JSON.parse(saved).principal : 10000;
  });
  const [rate, setRate] = useState<number>(() => {
    const saved = localStorage.getItem('compoundInterest');
    return saved ? JSON.parse(saved).rate : 7;
  });
  const [timesPerYear, setTimesPerYear] = useState<number>(() => {
    const saved = localStorage.getItem('compoundInterest');
    return saved ? JSON.parse(saved).timesPerYear : 12;
  });
  const [years, setYears] = useState<number>(() => {
    const saved = localStorage.getItem('compoundInterest');
    return saved ? JSON.parse(saved).years : 10;
  });
  const [monthlyContribution, setMonthlyContribution] = useState<number>(() => {
    const saved = localStorage.getItem('compoundInterest');
    return saved ? JSON.parse(saved).monthlyContribution : 500;
  });

  useEffect(() => {
    localStorage.setItem('compoundInterest', JSON.stringify({ principal, rate, timesPerYear, years, monthlyContribution }));
  }, [principal, rate, timesPerYear, years, monthlyContribution]);

  // Calculate future value with contributions
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;

  const futureValuePrincipal = principal * Math.pow(1 + rate / 100 / timesPerYear, timesPerYear * years);
  const futureValueContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const totalFutureValue = futureValuePrincipal + (isFinite(futureValueContributions) ? futureValueContributions : 0);

  const totalContributed = principal + (monthlyContribution * months);
  const totalInterest = totalFutureValue - totalContributed;

  interface YearlyData {
    year: number;
    total: number;
    contributed: number;
    interest: number;
  }

  // Generate yearly breakdown
  const yearlyData: YearlyData[] = [];
  for (let y = 1; y <= years; y++) {
    const fvP = principal * Math.pow(1 + rate / 100 / timesPerYear, timesPerYear * y);
    const m = y * 12;
    const fvC = monthlyContribution * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate);
    const total = fvP + (isFinite(fvC) ? fvC : 0);
    const contributed = principal + (monthlyContribution * m);
    yearlyData.push({ year: y, total, contributed, interest: total - contributed });
  }

  const exportResults = () => {
    let text = '=== Compound Interest Calculation ===\n\n';
    text += `Principal: $${principal.toLocaleString()}\n`;
    text += `Monthly Contribution: $${monthlyContribution.toLocaleString()}\n`;
    text += `Interest Rate: ${rate}% annually\n`;
    text += `Compounding: ${timesPerYear} times per year\n`;
    text += `Duration: ${years} years\n\n`;
    text += `=== Results ===\n`;
    text += `Total Future Value: $${totalFutureValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}\n`;
    text += `Total Contributed: $${totalContributed.toLocaleString()}\n`;
    text += `Total Interest Earned: $${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}\n\n`;
    text += '=== Yearly Breakdown ===\n';
    yearlyData.forEach(d => {
      text += `Year ${d.year}: $${d.total.toLocaleString(undefined, { maximumFractionDigits: 0 })} (Interest: $${d.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })})\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'compound-interest-calculation.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Compound Interest Calculator
          </h2>
          <button onClick={exportResults} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Initial Principal ($)
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Monthly Contribution ($)
            </label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Compounding Frequency
            </label>
            <select
              value={timesPerYear}
              onChange={(e) => setTimesPerYear(parseInt(e.target.value))}
              className="input-field"
            >
              <option value={1}>Annually</option>
              <option value={2}>Semi-Annually</option>
              <option value={4}>Quarterly</option>
              <option value={12}>Monthly</option>
              <option value={365}>Daily</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Investment Period (Years)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={years}
              onChange={(e) => setYears(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              className="input-field"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalFutureValue)}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">Future Value</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalContributed)}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Contributed</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(totalInterest)}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Interest Earned</div>
          </div>
        </div>

        {/* Visual Chart */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Growth Over Time</h3>
          <div className="space-y-2">
            {yearlyData.filter((_, i) => i % Math.ceil(years / 10) === 0 || i === yearlyData.length - 1).map(d => (
              <div key={d.year} className="flex items-center gap-3">
                <div className="w-16 text-xs text-slate-600 dark:text-slate-400">Year {d.year}</div>
                <div className="flex-1 h-6 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-blue-500 rounded-l-full absolute left-0"
                    style={{ width: `${(d.contributed / totalFutureValue) * 100}%` }}
                  />
                  <div
                    className="h-full bg-green-500 rounded-r-full absolute"
                    style={{ left: `${(d.contributed / totalFutureValue) * 100}%`, width: `${(d.interest / totalFutureValue) * 100}%` }}
                  />
                </div>
                <div className="w-24 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                  {formatCurrency(d.total)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded" /> Contributions</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded" /> Interest</div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-800 dark:text-green-100">
        <strong>💡 Compound Interest:</strong> Your money earns interest on both the principal AND previously earned interest. The earlier you start, the more powerful the compounding effect!
      </div>
    </div>
  );
}
