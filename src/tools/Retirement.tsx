import { useState, useEffect } from 'react';
import { Wallet, Download, TrendingUp } from 'lucide-react';

export default function Retirement() {
  const [currentAge, setCurrentAge] = useState<number>(() => {
    const saved = localStorage.getItem('retirementCalc');
    return saved ? JSON.parse(saved).currentAge : 30;
  });
  const [retirementAge, setRetirementAge] = useState<number>(() => {
    const saved = localStorage.getItem('retirementCalc');
    return saved ? JSON.parse(saved).retirementAge : 65;
  });
  const [currentSavings, setCurrentSavings] = useState<number>(() => {
    const saved = localStorage.getItem('retirementCalc');
    return saved ? JSON.parse(saved).currentSavings : 50000;
  });
  const [monthlyContribution, setMonthlyContribution] = useState<number>(() => {
    const saved = localStorage.getItem('retirementCalc');
    return saved ? JSON.parse(saved).monthlyContribution : 500;
  });
  const [returnRate, setReturnRate] = useState<number>(() => {
    const saved = localStorage.getItem('retirementCalc');
    return saved ? JSON.parse(saved).returnRate : 7;
  });
  const [inflationRate, setInflationRate] = useState<number>(() => {
    const saved = localStorage.getItem('retirementCalc');
    return saved ? JSON.parse(saved).inflationRate : 3;
  });

  useEffect(() => {
    localStorage.setItem('retirementCalc', JSON.stringify({ currentAge, retirementAge, currentSavings, monthlyContribution, returnRate, inflationRate }));
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, returnRate, inflationRate]);

  const yearsToRetirement = retirementAge - currentAge;
  const months = yearsToRetirement * 12;
  const monthlyRate = returnRate / 100 / 12;
  const realReturn = returnRate - inflationRate;

  // Future value calculation
  const fvSavings = currentSavings * Math.pow(1 + returnRate / 100, yearsToRetirement);
  const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const totalAtRetirement = fvSavings + (isFinite(fvContributions) ? fvContributions : 0);

  // Inflation-adjusted value
  const inflationAdjusted = totalAtRetirement / Math.pow(1 + inflationRate / 100, yearsToRetirement);

  // Monthly income at 4% withdrawal rate
  const monthlyIncome = (totalAtRetirement * 0.04) / 12;
  const inflationAdjustedIncome = (inflationAdjusted * 0.04) / 12;

  const totalContributed = currentSavings + (monthlyContribution * months);
  const interestEarned = totalAtRetirement - totalContributed;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const exportReport = () => {
    let text = '=== Retirement Projection ===\n\n';
    text += `Current Age: ${currentAge}\n`;
    text += `Retirement Age: ${retirementAge}\n`;
    text += `Years to Retirement: ${yearsToRetirement}\n\n`;
    text += `Current Savings: ${formatCurrency(currentSavings)}\n`;
    text += `Monthly Contribution: ${formatCurrency(monthlyContribution)}\n`;
    text += `Expected Return: ${returnRate}%\n`;
    text += `Inflation Rate: ${inflationRate}%\n\n`;
    text += `=== Projections ===\n`;
    text += `At Retirement: ${formatCurrency(totalAtRetirement)}\n`;
    text += `Inflation-Adjusted: ${formatCurrency(inflationAdjusted)}\n`;
    text += `Monthly Income (4% rule): ${formatCurrency(monthlyIncome)}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'retirement-projection.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-green-500" />
            Retirement Calculator
          </h2>
          <button onClick={exportReport} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Age</label>
            <input type="number" value={currentAge} onChange={(e) => setCurrentAge(parseInt(e.target.value) || 25)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Retirement Age</label>
            <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(parseInt(e.target.value) || 65)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Savings</label>
            <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Contribution</label>
            <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Return (%)</label>
            <input type="number" step="0.5" value={returnRate} onChange={(e) => setReturnRate(parseFloat(e.target.value) || 7)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Inflation Rate (%)</label>
            <input type="number" step="0.5" value={inflationRate} onChange={(e) => setInflationRate(parseFloat(e.target.value) || 3)} className="input-field" />
          </div>
        </div>

        {/* Main Result */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white text-center mb-6">
          <TrendingUp className="w-10 h-10 mx-auto mb-2" />
          <div className="text-sm opacity-80">Projected at Age {retirementAge}</div>
          <div className="text-5xl font-bold">{formatCurrency(totalAtRetirement)}</div>
          <div className="text-lg opacity-80 mt-2">
            {formatCurrency(inflationAdjusted)} in today's dollars
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-blue-700 dark:text-blue-300">Years Left</div>
            <div className="text-2xl font-bold text-blue-600">{yearsToRetirement}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-green-700 dark:text-green-300">Monthly Income</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(monthlyIncome)}</div>
            <div className="text-xs text-green-600">at 4% rule</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-purple-700 dark:text-purple-300">Total Contributed</div>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalContributed)}</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-orange-700 dark:text-orange-300">Interest Earned</div>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(interestEarned)}</div>
          </div>
        </div>

        {/* Visual Breakdown */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Growth Composition</h3>
          <div className="h-6 rounded-full overflow-hidden flex mb-2">
            <div className="bg-blue-500 h-full" style={{ width: `${(currentSavings / totalAtRetirement) * 100}%` }} />
            <div className="bg-green-500 h-full" style={{ width: `${((monthlyContribution * months) / totalAtRetirement) * 100}%` }} />
            <div className="bg-orange-500 h-full" style={{ width: `${(interestEarned / totalAtRetirement) * 100}%` }} />
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded" /> Current ({((currentSavings / totalAtRetirement) * 100).toFixed(0)}%)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded" /> Contributions ({(((monthlyContribution * months) / totalAtRetirement) * 100).toFixed(0)}%)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded" /> Growth ({((interestEarned / totalAtRetirement) * 100).toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-800 dark:text-green-100">
        <strong>💡 The Power of Time:</strong> Starting early is key! The longer your money compounds, the more growth comes from interest rather than contributions. Even small monthly amounts add up significantly over decades.
      </div>
    </div>
  );
}
