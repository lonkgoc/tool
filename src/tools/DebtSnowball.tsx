import { useState, useEffect } from 'react';
import { CreditCard, Download, TrendingDown, Plus, Trash2 } from 'lucide-react';

interface Debt {
  id: string;
  name: string;
  balance: number;
  minPayment: number;
  interestRate: number;
}

export default function DebtSnowball() {
  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('debtSnowball');
    return saved ? JSON.parse(saved).debts : [];
  });
  const [extraPayment, setExtraPayment] = useState<number>(() => {
    const saved = localStorage.getItem('debtSnowball');
    return saved ? JSON.parse(saved).extraPayment : 200;
  });
  const [method, setMethod] = useState<'snowball' | 'avalanche'>(() => {
    const saved = localStorage.getItem('debtSnowball');
    return saved ? JSON.parse(saved).method : 'snowball';
  });
  const [newDebt, setNewDebt] = useState({ name: '', balance: '', minPayment: '', interestRate: '' });

  useEffect(() => {
    localStorage.setItem('debtSnowball', JSON.stringify({ debts, extraPayment, method }));
  }, [debts, extraPayment, method]);

  const addDebt = () => {
    if (!newDebt.name || !newDebt.balance || !newDebt.minPayment) return;
    setDebts([...debts, {
      id: Date.now().toString(),
      name: newDebt.name,
      balance: parseFloat(newDebt.balance),
      minPayment: parseFloat(newDebt.minPayment),
      interestRate: parseFloat(newDebt.interestRate) || 0
    }]);
    setNewDebt({ name: '', balance: '', minPayment: '', interestRate: '' });
  };

  const deleteDebt = (id: string) => setDebts(debts.filter(d => d.id !== id));

  // Sort debts based on method
  const sortedDebts = [...debts].sort((a, b) =>
    method === 'snowball' ? a.balance - b.balance : b.interestRate - a.interestRate
  );

  // Calculate payoff plan
  const calculatePayoff = () => {
    if (debts.length === 0) return { months: 0, totalPaid: 0, interestPaid: 0, schedule: [] };

    let debtsCopy = sortedDebts.map(d => ({ ...d, paid: 0 }));
    const schedule: { month: number; payments: { name: string; payment: number; remaining: number }[] }[] = [];
    let month = 0;
    let totalPaid = 0;
    let interestPaid = 0;
    let snowballAmount = extraPayment;

    while (debtsCopy.some(d => d.balance > 0) && month < 360) {
      month++;
      const monthPayments: { name: string; payment: number; remaining: number }[] = [];
      let extraAvailable = snowballAmount;

      debtsCopy.forEach((debt, index) => {
        if (debt.balance <= 0) return;

        const interest = debt.balance * (debt.interestRate / 100 / 12);
        interestPaid += interest;
        debt.balance += interest;

        let payment = debt.minPayment;
        if (index === 0) payment += extraAvailable;

        payment = Math.min(payment, debt.balance);
        debt.balance -= payment;
        totalPaid += payment;

        monthPayments.push({ name: debt.name, payment, remaining: Math.max(0, debt.balance) });

        if (debt.balance <= 0) {
          snowballAmount += debt.minPayment;
        }
      });

      if (month <= 24) {
        schedule.push({ month, payments: monthPayments });
      }
    }

    return { months: month, totalPaid, interestPaid, schedule };
  };

  const { months, totalPaid, interestPaid, schedule } = calculatePayoff();
  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0);

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const exportPlan = () => {
    let text = `=== Debt ${method === 'snowball' ? 'Snowball' : 'Avalanche'} Plan ===\n\n`;
    text += `Total Debt: ${formatCurrency(totalDebt)}\n`;
    text += `Monthly Min Payments: ${formatCurrency(totalMinPayments)}\n`;
    text += `Extra Payment: ${formatCurrency(extraPayment)}\n\n`;
    text += `=== Payoff Order ===\n`;
    sortedDebts.forEach((d, i) => {
      text += `${i + 1}. ${d.name}: ${formatCurrency(d.balance)} at ${d.interestRate}%\n`;
    });
    text += `\n=== Results ===\n`;
    text += `Time to Debt Free: ${months} months (${(months / 12).toFixed(1)} years)\n`;
    text += `Total Paid: ${formatCurrency(totalPaid)}\n`;
    text += `Interest Paid: ${formatCurrency(interestPaid)}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debt-${method}-plan.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-red-500" />
            Debt Snowball/Avalanche
          </h2>
          {debts.length > 0 && (
            <button onClick={exportPlan} className="btn-secondary text-sm flex items-center gap-1">
              <Download className="w-4 h-4" /> Export
            </button>
          )}
        </div>

        {/* Method Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMethod('snowball')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${method === 'snowball' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
          >
            ❄️ Snowball (Smallest First)
          </button>
          <button
            onClick={() => setMethod('avalanche')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${method === 'avalanche' ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
          >
            🏔️ Avalanche (Highest Rate First)
          </button>
        </div>

        {/* Add Debt */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-6">
          <h3 className="font-semibold mb-3">Add Debt</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            <input
              type="text"
              placeholder="Debt name"
              value={newDebt.name}
              onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Balance ($)"
              value={newDebt.balance}
              onChange={(e) => setNewDebt({ ...newDebt, balance: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Min payment ($)"
              value={newDebt.minPayment}
              onChange={(e) => setNewDebt({ ...newDebt, minPayment: e.target.value })}
              className="input-field"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Rate (%)"
                value={newDebt.interestRate}
                onChange={(e) => setNewDebt({ ...newDebt, interestRate: e.target.value })}
                className="input-field flex-1"
              />
              <button onClick={addDebt} className="btn-primary px-3">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Extra Payment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Extra Monthly Payment: {formatCurrency(extraPayment)}
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={extraPayment}
            onChange={(e) => setExtraPayment(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Debts List */}
        {debts.length > 0 && (
          <>
            <div className="space-y-2 mb-6">
              {sortedDebts.map((debt, index) => (
                <div key={debt.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">{index + 1}</span>
                    <div>
                      <div className="font-medium">{debt.name}</div>
                      <div className="text-xs text-slate-500">Min: {formatCurrency(debt.minPayment)}/mo • {debt.interestRate}% APR</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-red-600">{formatCurrency(debt.balance)}</span>
                    <button onClick={() => deleteDebt(debt.id)} className="text-red-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white text-center">
              <TrendingDown className="w-12 h-12 mx-auto mb-2" />
              <div className="text-sm opacity-80">Debt Free In</div>
              <div className="text-5xl font-bold">
                {months < 12 ? `${months} months` : `${(months / 12).toFixed(1)} years`}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div className="bg-white/20 p-2 rounded-lg">
                  <div className="opacity-80">Total Debt</div>
                  <div className="font-bold">{formatCurrency(totalDebt)}</div>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  <div className="opacity-80">Total Paid</div>
                  <div className="font-bold">{formatCurrency(totalPaid)}</div>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  <div className="opacity-80">Interest</div>
                  <div className="font-bold">{formatCurrency(interestPaid)}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {debts.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            Add your debts to see your payoff plan
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Snowball vs Avalanche:</strong> Snowball pays smallest debts first for quick wins. Avalanche pays highest interest first to save money. Both work—pick what motivates you!
      </div>
    </div>
  );
}
