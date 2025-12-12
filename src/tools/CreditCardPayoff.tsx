import { useState, useEffect } from 'react';
import { CreditCard, Download, TrendingDown, Calculator } from 'lucide-react';

export default function CreditCardPayoff() {
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('creditCardPayoff');
    return saved ? JSON.parse(saved).balance : 5000;
  });
  const [apr, setApr] = useState<number>(() => {
    const saved = localStorage.getItem('creditCardPayoff');
    return saved ? JSON.parse(saved).apr : 19.99;
  });
  const [minPaymentPercent, setMinPaymentPercent] = useState<number>(() => {
    const saved = localStorage.getItem('creditCardPayoff');
    return saved ? JSON.parse(saved).minPaymentPercent : 2;
  });
  const [paymentStrategy, setPaymentStrategy] = useState<'minimum' | 'fixed' | 'timeframe'>('fixed');
  const [fixedPayment, setFixedPayment] = useState<number>(200);
  const [targetMonths, setTargetMonths] = useState<number>(24);

  useEffect(() => {
    localStorage.setItem('creditCardPayoff', JSON.stringify({ balance, apr, minPaymentPercent }));
  }, [balance, apr, minPaymentPercent]);

  const monthlyRate = apr / 100 / 12;
  const minPayment = Math.max(25, balance * (minPaymentPercent / 100));

  // Calculate payoff for different strategies
  const calculatePayoff = (payment: number) => {
    let bal = balance;
    let months = 0;
    let totalPaid = 0;
    let totalInterest = 0;

    while (bal > 0 && months < 600) {
      const interest = bal * monthlyRate;
      const actualPayment = Math.min(payment, bal + interest);
      bal = bal + interest - actualPayment;
      if (bal < 0) bal = 0;
      totalPaid += actualPayment;
      totalInterest += interest;
      months++;
    }

    return { months, totalPaid, totalInterest };
  };

  // Calculate required payment for target months
  const calculateRequiredPayment = (months: number) => {
    if (months <= 0) return balance;
    const r = monthlyRate;
    const n = months;
    const payment = balance * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return isFinite(payment) ? payment : balance / months;
  };

  const minPaymentResult = calculatePayoff(minPayment);
  const fixedPaymentResult = calculatePayoff(fixedPayment);
  const requiredPayment = calculateRequiredPayment(targetMonths);
  const targetResult = calculatePayoff(requiredPayment);

  const currentResult =
    paymentStrategy === 'minimum' ? minPaymentResult :
      paymentStrategy === 'fixed' ? fixedPaymentResult : targetResult;

  const currentPayment =
    paymentStrategy === 'minimum' ? minPayment :
      paymentStrategy === 'fixed' ? fixedPayment : requiredPayment;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const exportReport = () => {
    let text = '=== Credit Card Payoff Plan ===\n\n';
    text += `Balance: ${formatCurrency(balance)}\n`;
    text += `APR: ${apr}%\n`;
    text += `Monthly Payment: ${formatCurrency(currentPayment)}\n\n`;
    text += `Payoff Time: ${currentResult.months} months\n`;
    text += `Total Paid: ${formatCurrency(currentResult.totalPaid)}\n`;
    text += `Total Interest: ${formatCurrency(currentResult.totalInterest)}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'credit-card-payoff.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-red-500" />
            Credit Card Payoff
          </h2>
          <button onClick={exportReport} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Balance</label>
            <input type="number" value={balance} onChange={(e) => setBalance(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">APR (%)</label>
            <input type="number" step="0.01" value={apr} onChange={(e) => setApr(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Min Payment (%)</label>
            <input type="number" step="0.5" value={minPaymentPercent} onChange={(e) => setMinPaymentPercent(Math.max(1, parseFloat(e.target.value) || 2))} className="input-field" />
          </div>
        </div>

        {/* Payment Strategy */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Strategy</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentStrategy('minimum')}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${paymentStrategy === 'minimum' ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
            >
              Minimum Only
            </button>
            <button
              onClick={() => setPaymentStrategy('fixed')}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${paymentStrategy === 'fixed' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
            >
              Fixed Payment
            </button>
            <button
              onClick={() => setPaymentStrategy('timeframe')}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${paymentStrategy === 'timeframe' ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
            >
              Target Timeframe
            </button>
          </div>
        </div>

        {paymentStrategy === 'fixed' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Payment</label>
            <input type="number" value={fixedPayment} onChange={(e) => setFixedPayment(Math.max(minPayment, parseFloat(e.target.value) || minPayment))} className="input-field" />
            <p className="text-xs text-slate-500 mt-1">Minimum: {formatCurrency(minPayment)}</p>
          </div>
        )}

        {paymentStrategy === 'timeframe' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pay Off In (Months)</label>
            <input type="number" value={targetMonths} onChange={(e) => setTargetMonths(Math.max(1, parseInt(e.target.value) || 12))} className="input-field" />
          </div>
        )}

        {/* Results */}
        <div className={`rounded-xl p-6 text-white text-center mb-6 ${paymentStrategy === 'minimum' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}>
          <TrendingDown className="w-10 h-10 mx-auto mb-2" />
          <div className="text-sm opacity-80">Debt Free In</div>
          <div className="text-5xl font-bold">
            {currentResult.months < 12 ? `${currentResult.months} months` : `${(currentResult.months / 12).toFixed(1)} years`}
          </div>
          <div className="text-lg opacity-80">Paying {formatCurrency(currentPayment)}/month</div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <div className="text-sm opacity-80">Total Paid</div>
              <div className="text-2xl font-bold">{formatCurrency(currentResult.totalPaid)}</div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <div className="text-sm opacity-80">Total Interest</div>
              <div className="text-2xl font-bold">{formatCurrency(currentResult.totalInterest)}</div>
            </div>
          </div>
        </div>

        {/* Comparison */}
        {paymentStrategy !== 'minimum' && (
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">💰 Savings vs Minimum Payments</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-green-600">Time Saved</div>
                <div className="font-bold text-green-800 dark:text-green-200">{minPaymentResult.months - currentResult.months} months</div>
              </div>
              <div>
                <div className="text-green-600">Interest Saved</div>
                <div className="font-bold text-green-800 dark:text-green-200">{formatCurrency(minPaymentResult.totalInterest - currentResult.totalInterest)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-800 dark:text-red-100">
        <strong>⚠️ Minimum Trap:</strong> Paying only the minimum can take years and cost thousands in interest. Even small increases to your monthly payment can dramatically reduce both time and total cost.
      </div>
    </div>
  );
}
