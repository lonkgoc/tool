import { useState, useEffect } from 'react';
import { Shield, Download, TrendingUp } from 'lucide-react';

export default function EmergencyFund() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(() => {
    const saved = localStorage.getItem('emergencyFund');
    return saved ? JSON.parse(saved).monthlyExpenses : 3000;
  });
  const [targetMonths, setTargetMonths] = useState<number>(() => {
    const saved = localStorage.getItem('emergencyFund');
    return saved ? JSON.parse(saved).targetMonths : 6;
  });
  const [currentSavings, setCurrentSavings] = useState<number>(() => {
    const saved = localStorage.getItem('emergencyFund');
    return saved ? JSON.parse(saved).currentSavings : 5000;
  });
  const [monthlySavings, setMonthlySavings] = useState<number>(() => {
    const saved = localStorage.getItem('emergencyFund');
    return saved ? JSON.parse(saved).monthlySavings : 500;
  });

  useEffect(() => {
    localStorage.setItem('emergencyFund', JSON.stringify({ monthlyExpenses, targetMonths, currentSavings, monthlySavings }));
  }, [monthlyExpenses, targetMonths, currentSavings, monthlySavings]);

  const targetAmount = monthlyExpenses * targetMonths;
  const remaining = targetAmount - currentSavings;
  const progress = targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 0;
  const monthsToGoal = monthlySavings > 0 && remaining > 0 ? Math.ceil(remaining / monthlySavings) : 0;
  const monthsCovered = monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const getStatusColor = () => {
    if (progress >= 100) return 'from-green-500 to-emerald-600';
    if (progress >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-600';
  };

  const getStatusText = () => {
    if (progress >= 100) return '🎉 Fully Funded!';
    if (progress >= 75) return '💪 Almost There!';
    if (progress >= 50) return '📈 Good Progress';
    if (progress >= 25) return '🌱 Getting Started';
    return '⚠️ Needs Attention';
  };

  const exportReport = () => {
    let text = '=== Emergency Fund Report ===\n\n';
    text += `Monthly Expenses: ${formatCurrency(monthlyExpenses)}\n`;
    text += `Target Months: ${targetMonths} months\n`;
    text += `Target Amount: ${formatCurrency(targetAmount)}\n\n`;
    text += `Current Savings: ${formatCurrency(currentSavings)}\n`;
    text += `Progress: ${progress.toFixed(1)}%\n`;
    text += `Months Covered: ${monthsCovered.toFixed(1)} months\n`;
    text += `Remaining Needed: ${formatCurrency(Math.max(0, remaining))}\n`;
    if (monthsToGoal > 0) {
      text += `\nAt ${formatCurrency(monthlySavings)}/month, you'll reach your goal in ${monthsToGoal} months.\n`;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emergency-fund-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            Emergency Fund Calculator
          </h2>
          <button onClick={exportReport} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Expenses</label>
            <input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Months</label>
            <select value={targetMonths} onChange={(e) => setTargetMonths(parseInt(e.target.value))} className="input-field">
              <option value={3}>3 months (minimum)</option>
              <option value={6}>6 months (recommended)</option>
              <option value={9}>9 months (comfortable)</option>
              <option value={12}>12 months (secure)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Savings</label>
            <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Contribution</label>
            <input type="number" value={monthlySavings} onChange={(e) => setMonthlySavings(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
        </div>

        {/* Progress Display */}
        <div className={`rounded-xl p-6 text-white text-center mb-6 bg-gradient-to-r ${getStatusColor()}`}>
          <Shield className="w-12 h-12 mx-auto mb-2" />
          <div className="text-2xl font-bold mb-1">{getStatusText()}</div>
          <div className="text-5xl font-bold">{formatCurrency(currentSavings)}</div>
          <div className="text-lg opacity-80">of {formatCurrency(targetAmount)} target</div>

          {/* Progress Bar */}
          <div className="mt-4 bg-white/30 h-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="mt-2 text-sm opacity-80">{progress.toFixed(1)}% complete</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-blue-700 dark:text-blue-300">Months Covered</div>
            <div className="text-3xl font-bold text-blue-600">{monthsCovered.toFixed(1)}</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-orange-700 dark:text-orange-300">Still Needed</div>
            <div className="text-3xl font-bold text-orange-600">{formatCurrency(Math.max(0, remaining))}</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-purple-700 dark:text-purple-300">Months to Goal</div>
            <div className="text-3xl font-bold text-purple-600">
              {progress >= 100 ? '✓' : monthsToGoal > 0 ? monthsToGoal : '∞'}
            </div>
          </div>
        </div>

        {/* Months Visualization */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Coverage Visualization
          </h3>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: targetMonths }, (_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${i < Math.floor(monthsCovered)
                    ? 'bg-green-500 text-white'
                    : i < monthsCovered
                      ? 'bg-green-300 text-green-800'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Each block = 1 month of expenses ({formatCurrency(monthlyExpenses)})</p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Emergency Fund:</strong> Experts recommend 3-6 months of expenses for most people. Those with variable income or high job risk should aim for 9-12 months. Keep this fund in a high-yield savings account for easy access.
      </div>
    </div>
  );
}
