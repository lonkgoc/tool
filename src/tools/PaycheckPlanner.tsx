import { useState, useEffect } from 'react';
import { Wallet, Download, Plus, Trash2 } from 'lucide-react';

interface PayItem {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'deduction' | 'expense';
  category: string;
}

export default function PaycheckPlanner() {
  const [items, setItems] = useState<PayItem[]>(() => {
    const saved = localStorage.getItem('paycheckPlanner');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Gross Pay', amount: 5000, type: 'income', category: 'Salary' },
      { id: '2', name: 'Federal Tax', amount: 600, type: 'deduction', category: 'Taxes' },
      { id: '3', name: 'State Tax', amount: 200, type: 'deduction', category: 'Taxes' },
      { id: '4', name: '401(k)', amount: 250, type: 'deduction', category: 'Retirement' },
      { id: '5', name: 'Health Insurance', amount: 150, type: 'deduction', category: 'Benefits' },
      { id: '6', name: 'Rent', amount: 1500, type: 'expense', category: 'Housing' },
      { id: '7', name: 'Utilities', amount: 150, type: 'expense', category: 'Housing' },
      { id: '8', name: 'Groceries', amount: 400, type: 'expense', category: 'Food' },
    ];
  });
  const [newItem, setNewItem] = useState({ name: '', amount: '', type: 'expense' as const, category: '' });

  useEffect(() => {
    localStorage.setItem('paycheckPlanner', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newItem.name || !newItem.amount) return;
    setItems([...items, {
      id: Date.now().toString(),
      name: newItem.name,
      amount: parseFloat(newItem.amount),
      type: newItem.type,
      category: newItem.category || 'Other'
    }]);
    setNewItem({ name: '', amount: '', type: 'expense', category: '' });
  };

  const deleteItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const updateAmount = (id: string, amount: number) => {
    setItems(items.map(i => i.id === id ? { ...i, amount: Math.max(0, amount) } : i));
  };

  const totalIncome = items.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0);
  const totalDeductions = items.filter(i => i.type === 'deduction').reduce((sum, i) => sum + i.amount, 0);
  const netPay = totalIncome - totalDeductions;
  const totalExpenses = items.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0);
  const remaining = netPay - totalExpenses;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return 'text-green-600 bg-green-50 dark:bg-green-900/30';
      case 'deduction': return 'text-red-600 bg-red-50 dark:bg-red-900/30';
      case 'expense': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/30';
      default: return 'text-slate-600';
    }
  };

  const exportPlanner = () => {
    let text = '=== Paycheck Planner ===\n\n';
    text += `Gross Income: ${formatCurrency(totalIncome)}\n`;
    text += `Deductions: ${formatCurrency(totalDeductions)}\n`;
    text += `Net Pay: ${formatCurrency(netPay)}\n`;
    text += `Expenses: ${formatCurrency(totalExpenses)}\n`;
    text += `Remaining: ${formatCurrency(remaining)}\n\n`;

    ['income', 'deduction', 'expense'].forEach(type => {
      const typeItems = items.filter(i => i.type === type);
      if (typeItems.length > 0) {
        text += `=== ${type.charAt(0).toUpperCase() + type.slice(1)}s ===\n`;
        typeItems.forEach(i => { text += `  ${i.name}: ${formatCurrency(i.amount)}\n`; });
        text += '\n';
      }
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paycheck-planner.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-green-500" />
            Paycheck Planner
          </h2>
          <button onClick={exportPlanner} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-green-700 dark:text-green-300">Gross Income</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-red-700 dark:text-red-300">Deductions</div>
            <div className="text-2xl font-bold text-red-600">-{formatCurrency(totalDeductions)}</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-blue-700 dark:text-blue-300">Net Pay</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(netPay)}</div>
          </div>
          <div className={`p-4 rounded-xl text-center ${remaining >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
            <div className={`text-sm ${remaining >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>Remaining</div>
            <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(remaining)}</div>
          </div>
        </div>

        {/* Items by Category */}
        {['income', 'deduction', 'expense'].map(type => {
          const typeItems = items.filter(i => i.type === type);
          if (typeItems.length === 0) return null;
          return (
            <div key={type} className="mb-6">
              <h3 className="font-semibold mb-2 capitalize">{type === 'income' ? '💵 Income' : type === 'deduction' ? '📤 Deductions' : '💸 Expenses'}</h3>
              <div className="space-y-2">
                {typeItems.map(item => (
                  <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${getTypeColor(item.type)}`}>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs opacity-70">{item.category}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateAmount(item.id, parseFloat(e.target.value) || 0)}
                        className="w-24 bg-white dark:bg-slate-800 border border-current/20 rounded px-2 py-1 text-right font-bold"
                      />
                      <button onClick={() => deleteItem(item.id)} className="opacity-50 hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Add Item */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Add Item</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newItem.amount}
              onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
              className="input-field"
            />
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
              className="input-field"
            >
              <option value="income">Income</option>
              <option value="deduction">Deduction</option>
              <option value="expense">Expense</option>
            </select>
            <button onClick={addItem} className="btn-primary flex items-center justify-center gap-1">
              <Plus className="w-5 h-5" /> Add
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Tip:</strong> Use this to visualize where your paycheck goes. Add your income sources, paycheck deductions (taxes, 401k, insurance), and regular expenses to see how much you have left.
      </div>
    </div>
  );
}
