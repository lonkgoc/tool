import { useState, useEffect } from 'react';
import { PieChart, Download, DollarSign } from 'lucide-react';

export default function Budget503020() {
  const [income, setIncome] = useState<number>(() => {
    const saved = localStorage.getItem('budget503020');
    return saved ? JSON.parse(saved).income : 5000;
  });
  const [needsSpent, setNeedsSpent] = useState<number>(() => {
    const saved = localStorage.getItem('budget503020');
    return saved ? JSON.parse(saved).needsSpent : 0;
  });
  const [wantsSpent, setWantsSpent] = useState<number>(() => {
    const saved = localStorage.getItem('budget503020');
    return saved ? JSON.parse(saved).wantsSpent : 0;
  });
  const [savingsSpent, setSavingsSpent] = useState<number>(() => {
    const saved = localStorage.getItem('budget503020');
    return saved ? JSON.parse(saved).savingsSpent : 0;
  });

  useEffect(() => {
    localStorage.setItem('budget503020', JSON.stringify({ income, needsSpent, wantsSpent, savingsSpent }));
  }, [income, needsSpent, wantsSpent, savingsSpent]);

  const needsBudget = income * 0.5;
  const wantsBudget = income * 0.3;
  const savingsBudget = income * 0.2;

  const needsRemaining = needsBudget - needsSpent;
  const wantsRemaining = wantsBudget - wantsSpent;
  const savingsRemaining = savingsBudget - savingsSpent;

  const totalSpent = needsSpent + wantsSpent + savingsSpent;
  const totalRemaining = income - totalSpent;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const getColor = (remaining: number) => remaining >= 0 ? 'text-green-600' : 'text-red-600';
  const getBarColor = (remaining: number) => remaining >= 0 ? 'bg-green-500' : 'bg-red-500';

  const categories = [
    { name: 'Needs', emoji: '🏠', percent: 50, budget: needsBudget, spent: needsSpent, setSpent: setNeedsSpent, remaining: needsRemaining, color: 'blue', examples: 'Rent, utilities, groceries, insurance, minimum debt payments' },
    { name: 'Wants', emoji: '🎉', percent: 30, budget: wantsBudget, spent: wantsSpent, setSpent: setWantsSpent, remaining: wantsRemaining, color: 'purple', examples: 'Entertainment, dining out, subscriptions, hobbies' },
    { name: 'Savings', emoji: '💰', percent: 20, budget: savingsBudget, spent: savingsSpent, setSpent: setSavingsSpent, remaining: savingsRemaining, color: 'green', examples: 'Emergency fund, investments, extra debt payments' },
  ];

  const exportBudget = () => {
    let text = '=== 50/30/20 Budget ===\n\n';
    text += `Monthly Income: ${formatCurrency(income)}\n\n`;
    categories.forEach(cat => {
      text += `${cat.name} (${cat.percent}%): ${formatCurrency(cat.budget)}\n`;
      text += `  Spent: ${formatCurrency(cat.spent)}\n`;
      text += `  Remaining: ${formatCurrency(cat.remaining)}\n\n`;
    });
    text += `Total Spent: ${formatCurrency(totalSpent)}\n`;
    text += `Total Remaining: ${formatCurrency(totalRemaining)}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget-50-30-20.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-blue-500" />
            50/30/20 Budget
          </h2>
          <button onClick={exportBudget} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        {/* Income Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Monthly Income (After Tax)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field pl-10 text-xl font-bold"
            />
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {categories.map(cat => (
            <div key={cat.name} className={`bg-${cat.color}-50 dark:bg-${cat.color}-900/30 p-4 rounded-xl text-center`}>
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.name} ({cat.percent}%)</div>
              <div className={`text-2xl font-bold text-${cat.color}-600`}>{formatCurrency(cat.budget)}</div>
            </div>
          ))}
        </div>

        {/* Category Details */}
        <div className="space-y-6">
          {categories.map(cat => {
            const percentSpent = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
            return (
              <div key={cat.name} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="text-xl">{cat.emoji}</span> {cat.name}
                  </h3>
                  <span className={`font-bold ${getColor(cat.remaining)}`}>
                    {cat.remaining >= 0 ? '+' : ''}{formatCurrency(cat.remaining)} left
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Spent: {formatCurrency(cat.spent)}</span>
                    <span>Budget: {formatCurrency(cat.budget)}</span>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${percentSpent > 100 ? 'bg-red-500' : `bg-${cat.color}-500`}`}
                      style={{ width: `${Math.min(100, percentSpent)}%` }}
                    />
                  </div>
                  {percentSpent > 100 && (
                    <div className="text-xs text-red-500 mt-1">Over budget by {formatCurrency(Math.abs(cat.remaining))}</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    value={cat.spent || ''}
                    onChange={(e) => cat.setSpent(Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="Enter amount spent"
                    className="input-field flex-1"
                  />
                  <button
                    onClick={() => cat.setSpent(0)}
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
                  >
                    Reset
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-2">{cat.examples}</p>
              </div>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className={`mt-6 p-4 rounded-xl text-center ${totalRemaining >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
          <div className="text-sm text-slate-600 dark:text-slate-400">Total Remaining This Month</div>
          <div className={`text-4xl font-bold ${getColor(totalRemaining)}`}>
            {totalRemaining >= 0 ? '+' : ''}{formatCurrency(totalRemaining)}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>📊 The 50/30/20 Rule:</strong> Allocate 50% of after-tax income to needs, 30% to wants, and 20% to savings/debt. It's a simple framework for balanced budgeting.
      </div>
    </div>
  );
}
