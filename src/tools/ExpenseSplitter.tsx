import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Download, DollarSign } from 'lucide-react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitWith: string[];
}

interface Person {
  id: string;
  name: string;
}

export default function ExpenseSplitter() {
  const [people, setPeople] = useState<Person[]>(() => {
    const saved = localStorage.getItem('expenseSplitterPeople');
    return saved ? JSON.parse(saved) : [];
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenseSplitterExpenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [newPerson, setNewPerson] = useState('');
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', paidBy: '', splitWith: [] as string[] });

  useEffect(() => {
    localStorage.setItem('expenseSplitterPeople', JSON.stringify(people));
    localStorage.setItem('expenseSplitterExpenses', JSON.stringify(expenses));
  }, [people, expenses]);

  const addPerson = () => {
    if (!newPerson.trim()) return;
    setPeople([...people, { id: Date.now().toString(), name: newPerson.trim() }]);
    setNewPerson('');
  };

  const removePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
    setExpenses(expenses.filter(e => e.paidBy !== id && !e.splitWith.includes(id)));
  };

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.paidBy || newExpense.splitWith.length === 0) return;
    setExpenses([...expenses, {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      paidBy: newExpense.paidBy,
      splitWith: newExpense.splitWith
    }]);
    setNewExpense({ description: '', amount: '', paidBy: '', splitWith: [] });
  };

  const removeExpense = (id: string) => setExpenses(expenses.filter(e => e.id !== id));

  const toggleSplitWith = (personId: string) => {
    const current = newExpense.splitWith;
    if (current.includes(personId)) {
      setNewExpense({ ...newExpense, splitWith: current.filter(id => id !== personId) });
    } else {
      setNewExpense({ ...newExpense, splitWith: [...current, personId] });
    }
  };

  // Calculate balances
  const balances: Record<string, number> = {};
  people.forEach(p => { balances[p.id] = 0; });

  expenses.forEach(expense => {
    const perPerson = expense.amount / expense.splitWith.length;
    expense.splitWith.forEach(personId => {
      if (personId === expense.paidBy) {
        balances[personId] += expense.amount - perPerson;
      } else {
        balances[personId] -= perPerson;
      }
    });
    if (!expense.splitWith.includes(expense.paidBy)) {
      balances[expense.paidBy] += expense.amount;
    }
  });

  // Calculate settlements
  const settlements: { from: string; to: string; amount: number }[] = [];
  const debtors = people.filter(p => balances[p.id] < -0.01).map(p => ({ ...p, balance: balances[p.id] }));
  const creditors = people.filter(p => balances[p.id] > 0.01).map(p => ({ ...p, balance: balances[p.id] }));

  debtors.forEach(debtor => {
    let remaining = Math.abs(debtor.balance);
    creditors.forEach(creditor => {
      if (remaining > 0.01 && creditor.balance > 0.01) {
        const amount = Math.min(remaining, creditor.balance);
        if (amount > 0.01) {
          settlements.push({ from: debtor.id, to: creditor.id, amount });
          remaining -= amount;
          creditor.balance -= amount;
        }
      }
    });
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const getPersonName = (id: string) => people.find(p => p.id === id)?.name || 'Unknown';

  const exportSummary = () => {
    let text = '=== Expense Splitter Summary ===\n\n';
    text += `Total Expenses: $${totalExpenses.toFixed(2)}\n`;
    text += `Participants: ${people.map(p => p.name).join(', ')}\n\n`;
    text += '=== Expenses ===\n';
    expenses.forEach(e => {
      text += `${e.description}: $${e.amount.toFixed(2)} (paid by ${getPersonName(e.paidBy)}, split with ${e.splitWith.map(getPersonName).join(', ')})\n`;
    });
    text += '\n=== Settlements ===\n';
    settlements.forEach(s => {
      text += `${getPersonName(s.from)} owes ${getPersonName(s.to)}: $${s.amount.toFixed(2)}\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'expense-split.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (confirm('Clear all data?')) {
      setPeople([]);
      setExpenses([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Expense Splitter
          </h2>
          <div className="flex gap-2">
            {expenses.length > 0 && (
              <button onClick={exportSummary} className="btn-secondary text-sm flex items-center gap-1">
                <Download className="w-4 h-4" /> Export
              </button>
            )}
          </div>
        </div>

        {/* Add People */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Participants</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newPerson}
              onChange={(e) => setNewPerson(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPerson()}
              placeholder="Add person name"
              className="input-field flex-1"
            />
            <button onClick={addPerson} className="btn-primary"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {people.map(person => (
              <span key={person.id} className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                {person.name}
                <button onClick={() => removePerson(person.id)} className="hover:text-red-500">×</button>
              </span>
            ))}
            {people.length === 0 && <span className="text-sm text-slate-400">Add participants first</span>}
          </div>
        </div>

        {/* Add Expense */}
        {people.length >= 2 && (
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Add Expense</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="Description (e.g., Dinner)"
                className="input-field"
              />
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                placeholder="Amount ($)"
                className="input-field"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paid by</label>
              <select
                value={newExpense.paidBy}
                onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                className="input-field"
              >
                <option value="">Select person</option>
                {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Split with</label>
              <div className="flex flex-wrap gap-2">
                {people.map(p => (
                  <button
                    key={p.id}
                    onClick={() => toggleSplitWith(p.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${newExpense.splitWith.includes(p.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={addExpense} className="btn-primary w-full">Add Expense</button>
          </div>
        )}

        {/* Expenses List */}
        {expenses.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Expenses (${totalExpenses.toFixed(2)} total)
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {expenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-xs text-slate-500">Paid by {getPersonName(expense.paidBy)}, split with {expense.splitWith.map(getPersonName).join(', ')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">${expense.amount.toFixed(2)}</span>
                    <button onClick={() => removeExpense(expense.id)} className="text-red-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settlements */}
        {settlements.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Who Owes Whom
            </h3>
            <div className="space-y-2">
              {settlements.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-red-600">{getPersonName(s.from)}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-medium text-green-600">{getPersonName(s.to)}</span>
                  </div>
                  <span className="font-bold text-lg">${s.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {people.length > 0 && (
          <button onClick={clearAll} className="w-full mt-4 text-sm text-red-500 hover:text-red-600">Clear All Data</button>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Tip:</strong> Add all participants first, then add expenses. The calculator automatically determines who owes whom and by how much!
      </div>
    </div>
  );
}
