import { useState, useEffect } from 'react';
import { Flame, Download, TrendingUp } from 'lucide-react';

export default function FIRECalculator() {
  const [currentAge, setCurrentAge] = useState<number>(() => {
    const saved = localStorage.getItem('fireCalc');
    return saved ? JSON.parse(saved).currentAge : 30;
  });
  const [targetAge, setTargetAge] = useState<number>(() => {
    const saved = localStorage.getItem('fireCalc');
    return saved ? JSON.parse(saved).targetAge : 45;
  });
  const [currentSavings, setCurrentSavings] = useState<number>(() => {
    const saved = localStorage.getItem('fireCalc');
    return saved ? JSON.parse(saved).currentSavings : 100000;
  });
  const [monthlyContribution, setMonthlyContribution] = useState<number>(() => {
    const saved = localStorage.getItem('fireCalc');
    return saved ? JSON.parse(saved).monthlyContribution : 3000;
  });
  const [annualExpenses, setAnnualExpenses] = useState<number>(() => {
    const saved = localStorage.getItem('fireCalc');
    return saved ? JSON.parse(saved).annualExpenses : 40000;
  });
  const [returnRate, setReturnRate] = useState<number>(() => {
    const saved = localStorage.getItem('fireCalc');
    return saved ? JSON.parse(saved).returnRate : 7;
  });
  const [withdrawalRate, setWithdrawalRate] = useState<number>(() => {
    const saved = localStorage.getItem('fireCalc');
    return saved ? JSON.parse(saved).withdrawalRate : 4;
  });

  useEffect(() => {
    localStorage.setItem('fireCalc', JSON.stringify({ currentAge, targetAge, currentSavings, monthlyContribution, annualExpenses, returnRate, withdrawalRate }));
  }, [currentAge, targetAge, currentSavings, monthlyContribution, annualExpenses, returnRate, withdrawalRate]);

  // FIRE Number (based on 4% rule or custom withdrawal rate)
  const fireNumber = annualExpenses / (withdrawalRate / 100);

  // Years to FIRE
  const yearsToRetirement = targetAge - currentAge;
  const monthlyRate = returnRate / 100 / 12;
  const months = yearsToRetirement * 12;

  // Future value calculation
  const fvSavings = currentSavings * Math.pow(1 + returnRate / 100, yearsToRetirement);
  const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const projectedSavings = fvSavings + (isFinite(fvContributions) ? fvContributions : 0);

  const progress = (currentSavings / fireNumber) * 100;
  const onTrack = projectedSavings >= fireNumber;

  // Calculate actual FIRE age
  let fireAge = currentAge;
  let balance = currentSavings;
  while (balance < fireNumber && fireAge < 100) {
    balance = balance * (1 + returnRate / 100) + monthlyContribution * 12;
    fireAge++;
  }

  // Coast FIRE - amount needed now to reach FIRE by target age with no more contributions
  const coastFIRENumber = fireNumber / Math.pow(1 + returnRate / 100, yearsToRetirement);
  const coastFIREAchieved = currentSavings >= coastFIRENumber;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const exportReport = () => {
    let text = '=== FIRE Report ===\n\n';
    text += `Current Age: ${currentAge}\n`;
    text += `Target Retirement Age: ${targetAge}\n`;
    text += `Current Savings: ${formatCurrency(currentSavings)}\n`;
    text += `Monthly Contribution: ${formatCurrency(monthlyContribution)}\n`;
    text += `Annual Expenses: ${formatCurrency(annualExpenses)}\n\n`;
    text += `=== FIRE Numbers ===\n`;
    text += `FIRE Number (${withdrawalRate}% rule): ${formatCurrency(fireNumber)}\n`;
    text += `Projected at Age ${targetAge}: ${formatCurrency(projectedSavings)}\n`;
    text += `Coast FIRE Number: ${formatCurrency(coastFIRENumber)}\n`;
    text += `Estimated FIRE Age: ${fireAge}\n`;
    text += `On Track: ${onTrack ? 'Yes' : 'No'}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fire-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            FIRE Calculator
          </h2>
          <button onClick={exportReport} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Age</label>
            <input type="number" value={currentAge} onChange={(e) => setCurrentAge(parseInt(e.target.value) || 25)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target FIRE Age</label>
            <input type="number" value={targetAge} onChange={(e) => setTargetAge(parseInt(e.target.value) || 45)} className="input-field" />
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Annual Expenses</label>
            <input type="number" value={annualExpenses} onChange={(e) => setAnnualExpenses(parseFloat(e.target.value) || 0)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Return (%)</label>
            <input type="number" step="0.5" value={returnRate} onChange={(e) => setReturnRate(parseFloat(e.target.value) || 7)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Withdrawal Rate (%)</label>
            <input type="number" step="0.5" value={withdrawalRate} onChange={(e) => setWithdrawalRate(parseFloat(e.target.value) || 4)} className="input-field" />
          </div>
        </div>

        {/* FIRE Number */}
        <div className={`rounded-xl p-6 text-center mb-6 ${onTrack ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-500'} text-white`}>
          <div className="mb-4">
            <Flame className="w-12 h-12 mx-auto mb-2" />
            <div className="text-sm opacity-80">Your FIRE Number</div>
            <div className="text-5xl font-bold">{formatCurrency(fireNumber)}</div>
            <div className="text-sm opacity-80 mt-1">Based on {withdrawalRate}% withdrawal rate</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-sm">
              {onTrack
                ? `🎉 On track! You'll have ${formatCurrency(projectedSavings)} by age ${targetAge}`
                : `📊 You'll reach FIRE at age ${fireAge > 99 ? '99+' : fireAge}`
              }
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progress to FIRE</span>
            <span className="font-bold">{Math.min(100, progress).toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>{formatCurrency(currentSavings)}</span>
            <span>{formatCurrency(fireNumber)}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-600">{yearsToRetirement}</div>
            <div className="text-xs text-blue-700 dark:text-blue-300">Years to Target</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(projectedSavings)}</div>
            <div className="text-xs text-green-700 dark:text-green-300">Projected at {targetAge}</div>
          </div>
          <div className={`p-4 rounded-xl text-center ${coastFIREAchieved ? 'bg-green-50 dark:bg-green-900/30' : 'bg-yellow-50 dark:bg-yellow-900/30'}`}>
            <div className={`text-2xl font-bold ${coastFIREAchieved ? 'text-green-600' : 'text-yellow-600'}`}>
              {coastFIREAchieved ? '✓' : formatCurrency(coastFIRENumber)}
            </div>
            <div className={`text-xs ${coastFIREAchieved ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
              {coastFIREAchieved ? 'Coast FIRE Achieved!' : 'Coast FIRE Target'}
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(annualExpenses * 12 / withdrawalRate)}</div>
            <div className="text-xs text-purple-700 dark:text-purple-300">Safe Monthly Withdrawal</div>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-sm text-orange-800 dark:text-orange-100">
        <strong>🔥 FIRE (Financial Independence, Retire Early):</strong> The 4% rule suggests you can safely withdraw 4% of your portfolio annually. Your FIRE number = Annual Expenses ÷ Withdrawal Rate.
      </div>
    </div>
  );
}
