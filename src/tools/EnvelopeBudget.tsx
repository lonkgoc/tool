import { useState, useEffect } from 'react';
import { Mail, Plus, Trash2, Download } from 'lucide-react';

interface Envelope {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function EnvelopeBudget() {
  const [income, setIncome] = useState<number>(() => {
    const saved = localStorage.getItem('envelopeBudget');
    return saved ? JSON.parse(saved).income : 5000;
  });
  const [envelopes, setEnvelopes] = useState<Envelope[]>(() => {
    const saved = localStorage.getItem('envelopeBudget');
    return saved ? JSON.parse(saved).envelopes : [
      { id: '1', name: 'Housing', budgeted: 1500, spent: 0, color: COLORS[0] },
      { id: '2', name: 'Groceries', budgeted: 600, spent: 0, color: COLORS[1] },
      { id: '3', name: 'Transportation', budgeted: 400, spent: 0, color: COLORS[2] },
      { id: '4', name: 'Utilities', budgeted: 200, spent: 0, color: COLORS[3] },
      { id: '5', name: 'Entertainment', budgeted: 300, spent: 0, color: COLORS[4] },
    ];
  });
  const [newEnvelope, setNewEnvelope] = useState({ name: '', budgeted: '' });

  useEffect(() => {
    localStorage.setItem('envelopeBudget', JSON.stringify({ income, envelopes }));
  }, [income, envelopes]);

  const addEnvelope = () => {
    if (!newEnvelope.name || !newEnvelope.budgeted) return;
    setEnvelopes([...envelopes, {
      id: Date.now().toString(),
      name: newEnvelope.name,
      budgeted: parseFloat(newEnvelope.budgeted),
      spent: 0,
      color: COLORS[envelopes.length % COLORS.length]
    }]);
    setNewEnvelope({ name: '', budgeted: '' });
  };

  const updateSpent = (id: string, spent: number) => {
    setEnvelopes(envelopes.map(e => e.id === id ? { ...e, spent: Math.max(0, spent) } : e));
  };

  const updateBudgeted = (id: string, budgeted: number) => {
    setEnvelopes(envelopes.map(e => e.id === id ? { ...e, budgeted: Math.max(0, budgeted) } : e));
  };

  const deleteEnvelope = (id: string) => setEnvelopes(envelopes.filter(e => e.id !== id));

  const resetSpending = () => {
    if (confirm('Reset all spending to $0?')) {
      setEnvelopes(envelopes.map(e => ({ ...e, spent: 0 })));
    }
  };

  const totalBudgeted = envelopes.reduce((sum, e) => sum + e.budgeted, 0);
  const totalSpent = envelopes.reduce((sum, e) => sum + e.spent, 0);
  const unallocated = income - totalBudgeted;
  const remaining = totalBudgeted - totalSpent;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const exportBudget = () => {
    let text = '=== Envelope Budget ===\n\n';
    text += `Income: ${formatCurrency(income)}\n`;
    text += `Total Budgeted: ${formatCurrency(totalBudgeted)}\n`;
    text += `Unallocated: ${formatCurrency(unallocated)}\n\n`;
    text += '=== Envelopes ===\n';
    envelopes.forEach(e => {
      const remaining = e.budgeted - e.spent;
      text += `${e.name}: ${formatCurrency(e.spent)} / ${formatCurrency(e.budgeted)} (${remaining >= 0 ? formatCurrency(remaining) + ' left' : formatCurrency(Math.abs(remaining)) + ' over'})\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'envelope-budget.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-500" />
            Envelope Budget
          </h2>
          <div className="flex gap-2">
            <button onClick={resetSpending} className="btn-secondary text-sm">Reset</button>
            <button onClick={exportBudget} className="btn-secondary text-sm flex items-center gap-1">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Income */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Income</label>
          <input type="number" value={income} onChange={(e) => setIncome(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field text-xl font-bold" />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-blue-700 dark:text-blue-300">Budgeted</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalBudgeted)}</div>
          </div>
          <div className={`p-4 rounded-xl text-center ${unallocated >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
            <div className={`text-sm ${unallocated >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>Unallocated</div>
            <div className={`text-2xl font-bold ${unallocated >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(unallocated)}</div>
          </div>
          <div className={`p-4 rounded-xl text-center ${remaining >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
            <div className={`text-sm ${remaining >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>Remaining</div>
            <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(remaining)}</div>
          </div>
        </div>

        {/* Envelopes */}
        <div className="space-y-3 mb-6">
          {envelopes.map(envelope => {
            const remaining = envelope.budgeted - envelope.spent;
            const percentSpent = envelope.budgeted > 0 ? (envelope.spent / envelope.budgeted) * 100 : 0;
            return (
              <div key={envelope.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: envelope.color }} />
                    <span className="font-semibold">{envelope.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {remaining >= 0 ? formatCurrency(remaining) + ' left' : formatCurrency(Math.abs(remaining)) + ' over'}
                    </span>
                    <button onClick={() => deleteEnvelope(envelope.id)} className="text-red-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all ${percentSpent > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(100, percentSpent)}%`, backgroundColor: percentSpent <= 100 ? envelope.color : undefined }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Spent</label>
                    <input
                      type="number"
                      value={envelope.spent || ''}
                      onChange={(e) => updateSpent(envelope.id, parseFloat(e.target.value) || 0)}
                      className="input-field text-sm p-2"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Budget</label>
                    <input
                      type="number"
                      value={envelope.budgeted || ''}
                      onChange={(e) => updateBudgeted(envelope.id, parseFloat(e.target.value) || 0)}
                      className="input-field text-sm p-2"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Envelope */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Add Envelope</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Category name"
              value={newEnvelope.name}
              onChange={(e) => setNewEnvelope({ ...newEnvelope, name: e.target.value })}
              className="input-field flex-1"
            />
            <input
              type="number"
              placeholder="Budget"
              value={newEnvelope.budgeted}
              onChange={(e) => setNewEnvelope({ ...newEnvelope, budgeted: e.target.value })}
              className="input-field w-32"
            />
            <button onClick={addEnvelope} className="btn-primary px-4">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Envelope System:</strong> Allocate your income into virtual "envelopes" for different categories. When an envelope is empty, stop spending in that category until next month!
      </div>
    </div>
  );
}
