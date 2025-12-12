import { useState, useEffect } from 'react';
import { Target, Download, TrendingUp } from 'lucide-react';

export default function SavingsGoal() {
  const [goalName, setGoalName] = useState<string>(() => {
    const saved = localStorage.getItem('savingsGoal');
    return saved ? JSON.parse(saved).goalName : 'Vacation';
  });
  const [goalAmount, setGoalAmount] = useState<number>(() => {
    const saved = localStorage.getItem('savingsGoal');
    return saved ? JSON.parse(saved).goalAmount : 10000;
  });
  const [currentSavings, setCurrentSavings] = useState<number>(() => {
    const saved = localStorage.getItem('savingsGoal');
    return saved ? JSON.parse(saved).currentSavings : 2000;
  });
  const [monthlyContribution, setMonthlyContribution] = useState<number>(() => {
    const saved = localStorage.getItem('savingsGoal');
    return saved ? JSON.parse(saved).monthlyContribution : 500;
  });
  const [interestRate, setInterestRate] = useState<number>(() => {
    const saved = localStorage.getItem('savingsGoal');
    return saved ? JSON.parse(saved).interestRate : 4;
  });
  const [targetDate, setTargetDate] = useState<string>(() => {
    const saved = localStorage.getItem('savingsGoal');
    if (saved) return JSON.parse(saved).targetDate;
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  });

  useEffect(() => {
    localStorage.setItem('savingsGoal', JSON.stringify({ goalName, goalAmount, currentSavings, monthlyContribution, interestRate, targetDate }));
  }, [goalName, goalAmount, currentSavings, monthlyContribution, interestRate, targetDate]);

  const remaining = goalAmount - currentSavings;
  const progress = goalAmount > 0 ? (currentSavings / goalAmount) * 100 : 0;

  // Calculate months to goal
  const monthlyRate = interestRate / 100 / 12;
  let monthsToGoal = 0;
  let balance = currentSavings;

  if (monthlyContribution > 0 || monthlyRate > 0) {
    while (balance < goalAmount && monthsToGoal < 600) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      monthsToGoal++;
    }
  }

  // Calculate target date months
  const targetDateObj = new Date(targetDate);
  const today = new Date();
  const monthsToTarget = Math.max(0, (targetDateObj.getFullYear() - today.getFullYear()) * 12 + (targetDateObj.getMonth() - today.getMonth()));

  // Required monthly to hit target date
  let requiredMonthly = 0;
  if (monthsToTarget > 0 && remaining > 0) {
    if (monthlyRate > 0) {
      const fvFactor = (Math.pow(1 + monthlyRate, monthsToTarget) - 1) / monthlyRate;
      const currentGrowth = currentSavings * Math.pow(1 + monthlyRate, monthsToTarget);
      requiredMonthly = (goalAmount - currentGrowth) / fvFactor;
    } else {
      requiredMonthly = remaining / monthsToTarget;
    }
  }

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const formatDate = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const exportPlan = () => {
    let text = `=== Savings Goal: ${goalName} ===\n\n`;
    text += `Goal Amount: ${formatCurrency(goalAmount)}\n`;
    text += `Current Savings: ${formatCurrency(currentSavings)}\n`;
    text += `Remaining: ${formatCurrency(remaining)}\n`;
    text += `Progress: ${progress.toFixed(1)}%\n\n`;
    text += `Monthly Contribution: ${formatCurrency(monthlyContribution)}\n`;
    text += `Interest Rate: ${interestRate}%\n`;
    text += `Target Date: ${targetDate}\n\n`;
    text += `At current rate, goal reached: ${formatDate(monthsToGoal)}\n`;
    text += `To hit target date, need: ${formatCurrency(requiredMonthly)}/month\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'savings-goal.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-500" />
            Savings Goal Tracker
          </h2>
          <button onClick={exportPlan} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Goal Name</label>
            <input type="text" value={goalName} onChange={(e) => setGoalName(e.target.value)} className="input-field" placeholder="e.g., Vacation, New Car, House Down Payment" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Goal Amount</label>
            <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Savings</label>
            <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Contribution</label>
            <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Interest / APY (%)</label>
            <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
            <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="input-field" />
          </div>
        </div>

        {/* Progress Display */}
        <div className={`rounded-xl p-6 text-center mb-6 ${progress >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} text-white`}>
          <div className="text-lg mb-1">{goalName}</div>
          <div className="text-5xl font-bold">{formatCurrency(currentSavings)}</div>
          <div className="text-lg opacity-80">of {formatCurrency(goalAmount)}</div>

          {/* Progress Bar */}
          <div className="mt-4 bg-white/30 h-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="mt-2 text-sm">{progress.toFixed(1)}% complete • {formatCurrency(remaining)} to go</div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-sm text-blue-700 dark:text-blue-300">At Current Rate</div>
            <div className="text-2xl font-bold text-blue-600">
              {monthsToGoal < 600 ? formatDate(monthsToGoal) : 'Never'}
            </div>
            <div className="text-xs text-blue-500">
              {monthsToGoal < 600 ? `${monthsToGoal} months` : 'Increase contributions'}
            </div>
          </div>
          <div className={`p-4 rounded-xl text-center ${requiredMonthly <= monthlyContribution ? 'bg-green-50 dark:bg-green-900/30' : 'bg-orange-50 dark:bg-orange-900/30'}`}>
            <Target className={`w-8 h-8 mx-auto mb-2 ${requiredMonthly <= monthlyContribution ? 'text-green-500' : 'text-orange-500'}`} />
            <div className={`text-sm ${requiredMonthly <= monthlyContribution ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
              To Hit Target Date
            </div>
            <div className={`text-2xl font-bold ${requiredMonthly <= monthlyContribution ? 'text-green-600' : 'text-orange-600'}`}>
              {requiredMonthly > 0 ? formatCurrency(Math.ceil(requiredMonthly)) + '/mo' : '✓ Done!'}
            </div>
            <div className={`text-xs ${requiredMonthly <= monthlyContribution ? 'text-green-500' : 'text-orange-500'}`}>
              {requiredMonthly <= monthlyContribution ? 'On track!' : `Need ${formatCurrency(requiredMonthly - monthlyContribution)} more/mo`}
            </div>
          </div>
        </div>

        {/* Quick Goals */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Popular Savings Goals</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Emergency Fund', amount: 10000 },
              { name: 'Vacation', amount: 5000 },
              { name: 'New Car', amount: 25000 },
              { name: 'House Down Payment', amount: 50000 },
              { name: 'Wedding', amount: 30000 },
            ].map(g => (
              <button
                key={g.name}
                onClick={() => { setGoalName(g.name); setGoalAmount(g.amount); }}
                className="px-3 py-1 bg-white dark:bg-slate-700 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
              >
                {g.name} ({formatCurrency(g.amount)})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Tip:</strong> Keep your savings in a high-yield savings account (HYSA) to earn interest while you save. Even a small difference in APY adds up over time!
      </div>
    </div>
  );
}
