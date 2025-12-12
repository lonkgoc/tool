import { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Download, DollarSign } from 'lucide-react';

interface BudgetItem {
  id: string;
  category: string;
  planned: number;
  actual: number;
  type: 'income' | 'expense';
}

export default function ZeroBasedBudget() {
  const [items, setItems] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem('zeroBasedBudget');
    return saved ? JSON.parse(saved) : [
      { id: '1', category: 'Salary', planned: 5000, actual: 5000, type: 'income' },
      { id: '2', category: 'Housing', planned: 1500, actual: 1500, type: 'expense' },
      { id: '3', category: 'Groceries', planned: 600, actual: 0, type: 'expense' },
      { id: '4', category: 'Transportation', planned: 400, actual: 0, type: 'expense' },
      { id: '5', category: 'Utilities', planned: 200, actual: 0, type: 'expense' },
      { id: '6', category: 'Entertainment', planned: 200, actual: 0, type: 'expense' },
      { id: '7', category: 'Savings', planned: 1000, actual: 0, type: 'expense' },
    ];
  });
  const [newItem, setNewItem] = useState({ category: '', planned: '', type: 'expense' as const });

  useEffect(() => {
    localStorage.setItem('zeroBasedBudget', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newItem.category || !newItem.planned) return;
    setItems([...items, {
      id: Date.now().toString(),
      category: newItem.category,
      planned: parseFloat(newItem.planned),
      actual: 0,
      type: newItem.type
    }]);
    setNewItem({ category: '', planned: '', type: 'expense' });
  };

  const updateItem = (id: string, field: 'planned' | 'actual', value: number) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: Math.max(0, value) } : i));
  };

  const deleteItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const resetActuals = () => {
    if (confirm('Reset all actual spending to $0?')) {
      setItems(items.map(i => ({ ...i, actual: 0 })));
    }
  };

  const incomeItems = items.filter(i => i.type === 'income');
  const expenseItems = items.filter(i => i.type === 'expense');

  const totalPlannedIncome = incomeItems.reduce((sum, i) => sum + i.planned, 0);
  const totalPlannedExpenses = expenseItems.reduce((sum, i) => sum + i.planned, 0);
  const plannedDifference = totalPlannedIncome - totalPlannedExpenses;

  const totalActualIncome = incomeItems.reduce((sum, i) => sum + i.actual, 0);
  const totalActualExpenses = expenseItems.reduce((sum, i) => sum + i.actual, 0);
  const actualDifference = totalActualIncome - totalActualExpenses;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const exportBudget = () => {
    let text = '=== Zero-Based Budget ===\n\n';
    text += '=== Income ===\n';
    incomeItems.forEach(i => { text += `${i.category}: ${formatCurrency(i.planned)} planned, ${formatCurrency(i.actual)} actual\n`; });
    text += `\nTotal Income: ${formatCurrency(totalPlannedIncome)} planned, ${formatCurrency(totalActualIncome)} actual\n\n`;
    text += '=== Expenses ===\n';
    expenseItems.forEach(i => { text += `${i.category}: ${formatCurrency(i.planned)} planned, ${formatCurrency(i.actual)} actual\n`; });
    text += `\nTotal Expenses: ${formatCurrency(totalPlannedExpenses)} planned, ${formatCurrency(totalActualExpenses)} actual\n\n`;
    text += `=== Summary ===\n`;
    text += `Planned Balance: ${formatCurrency(plannedDifference)} (should be $0)\n`;
    text += `Actual Balance: ${formatCurrency(actualDifference)}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zero-based-budget.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-500" />
            Zero-Based Budget
          </h2>
          <div className="flex gap-2">
            <button onClick={resetActuals} className="btn-secondary text-sm">Reset</button>
            <button onClick={exportBudget} className="btn-secondary text-sm flex items-center gap-1">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zero Balance Indicator */}
        <div className={`rounded-xl p-6 text-center mb-6 ${plannedDifference === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-500'} text-white`}>
          <Target className="w-10 h-10 mx-auto mb-2" />
          <div className="text-sm opacity-80">Planned Balance</div>
          <div className="text-5xl font-bold">{formatCurrency(plannedDifference)}</div>
          <div className="text-sm mt-2 opacity-80">
            {plannedDifference === 0 ? '✓ Budget is balanced! Every dollar has a job.' :
              plannedDifference > 0 ? `Assign ${formatCurrency(plannedDifference)} more to expenses/savings` :
                `Over budget by ${formatCurrency(Math.abs(plannedDifference))}`}
          </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6 text-center">
          <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
            <div className="text-xs text-green-700 dark:text-green-300">Income (Planned)</div>
            <div className="text-lg font-bold text-green-600">{formatCurrency(totalPlannedIncome)}</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-xl">
            <div className="text-xs text-red-700 dark:text-red-300">Expenses (Planned)</div>
            <div className="text-lg font-bold text-red-600">{formatCurrency(totalPlannedExpenses)}</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <div className="text-xs text-blue-700 dark:text-blue-300">Actual Spent</div>
            <div className="text-lg font-bold text-blue-600">{formatCurrency(totalActualExpenses)}</div>
          </div>
          <div className={`p-3 rounded-xl ${actualDifference >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
            <div className={`text-xs ${actualDifference >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>Remaining</div>
            <div className={`text-lg font-bold ${actualDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(actualDifference)}</div>
          </div>
        </div>

        {/* Income Section */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-green-600 flex items-center gap-2">💵 Income</h3>
          <div className="space-y-2">
            {incomeItems.map(item => (
              <div key={item.id} className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex-1 font-medium">{item.category}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Planned</label>
                    <input type="number" value={item.planned || ''} onChange={(e) => updateItem(item.id, 'planned', parseFloat(e.target.value) || 0)} className="input-field text-sm p-1" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Actual</label>
                    <input type="number" value={item.actual || ''} onChange={(e) => updateItem(item.id, 'actual', parseFloat(e.target.value) || 0)} className="input-field text-sm p-1" />
                  </div>
                </div>
                <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Section */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-red-600 flex items-center gap-2">💸 Expenses / Savings</h3>
          <div className="space-y-2">
            {expenseItems.map(item => {
              const remaining = item.planned - item.actual;
              const overBudget = remaining < 0;
              return (
                <div key={item.id} className={`p-3 rounded-lg ${overBudget ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="font-medium">{item.category}</div>
                      <div className={`text-xs ${overBudget ? 'text-red-500' : 'text-green-500'}`}>
                        {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over`}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-500">Planned</label>
                        <input type="number" value={item.planned || ''} onChange={(e) => updateItem(item.id, 'planned', parseFloat(e.target.value) || 0)} className="input-field text-sm p-1" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Actual</label>
                        <input type="number" value={item.actual || ''} onChange={(e) => updateItem(item.id, 'actual', parseFloat(e.target.value) || 0)} className="input-field text-sm p-1" />
                      </div>
                    </div>
                    <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${overBudget ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (item.actual / item.planned) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Item */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Add Category</h3>
          <div className="flex gap-2">
            <input type="text" placeholder="Category name" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="input-field flex-1" />
            <input type="number" placeholder="Amount" value={newItem.planned} onChange={(e) => setNewItem({ ...newItem, planned: e.target.value })} className="input-field w-28" />
            <select value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })} className="input-field w-28">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button onClick={addItem} className="btn-primary px-4"><Plus className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Zero-Based Budgeting:</strong> Give every dollar a job! Income minus all expenses (including savings) should equal zero. This ensures every dollar is intentionally allocated.
      </div>
    </div>
  );
}
