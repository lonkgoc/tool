import { useState } from 'react';
import { Car, Download, TrendingDown } from 'lucide-react';

export default function CarLoan() {
  const [carPrice, setCarPrice] = useState<number>(35000);
  const [downPayment, setDownPayment] = useState<number>(5000);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [salesTax, setSalesTax] = useState<number>(7);

  const taxAmount = carPrice * (salesTax / 100);
  const loanAmount = carPrice + taxAmount - downPayment - tradeInValue;
  const monthlyRate = interestRate / 100 / 12;

  const monthlyPayment = monthlyRate > 0
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1)
    : loanAmount / loanTerm;

  const totalPayments = monthlyPayment * loanTerm;
  const totalInterest = totalPayments - loanAmount;
  const totalCost = carPrice + taxAmount + totalInterest;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const exportReport = () => {
    let text = '=== Car Loan Calculation ===\n\n';
    text += `Car Price: ${formatCurrency(carPrice)}\n`;
    text += `Sales Tax (${salesTax}%): ${formatCurrency(taxAmount)}\n`;
    text += `Down Payment: ${formatCurrency(downPayment)}\n`;
    text += `Trade-In Value: ${formatCurrency(tradeInValue)}\n`;
    text += `Loan Amount: ${formatCurrency(loanAmount)}\n\n`;
    text += `Interest Rate: ${interestRate}%\n`;
    text += `Loan Term: ${loanTerm} months\n\n`;
    text += `Monthly Payment: ${formatCurrency(monthlyPayment)}\n`;
    text += `Total Interest: ${formatCurrency(totalInterest)}\n`;
    text += `Total Cost: ${formatCurrency(totalCost)}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'car-loan-calculation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-500" />
            Car Loan Calculator
          </h2>
          <button onClick={exportReport} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Car Price</label>
            <input type="number" value={carPrice} onChange={(e) => setCarPrice(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Down Payment</label>
            <input type="number" value={downPayment} onChange={(e) => setDownPayment(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trade-In Value</label>
            <input type="number" value={tradeInValue} onChange={(e) => setTradeInValue(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Interest Rate (%)</label>
            <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loan Term</label>
            <select value={loanTerm} onChange={(e) => setLoanTerm(parseInt(e.target.value))} className="input-field">
              <option value={24}>24 months (2 years)</option>
              <option value={36}>36 months (3 years)</option>
              <option value={48}>48 months (4 years)</option>
              <option value={60}>60 months (5 years)</option>
              <option value={72}>72 months (6 years)</option>
              <option value={84}>84 months (7 years)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sales Tax (%)</label>
            <input type="number" step="0.1" value={salesTax} onChange={(e) => setSalesTax(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center mb-6">
          <div className="text-sm opacity-80">Monthly Payment</div>
          <div className="text-5xl font-bold">{formatCurrency(monthlyPayment)}</div>
          <div className="text-sm opacity-80 mt-2">for {loanTerm} months</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center">
            <div className="text-sm text-slate-500">Loan Amount</div>
            <div className="text-xl font-bold text-blue-600">{formatCurrency(loanAmount)}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center">
            <div className="text-sm text-slate-500">Sales Tax</div>
            <div className="text-xl font-bold text-orange-600">{formatCurrency(taxAmount)}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center">
            <div className="text-sm text-slate-500">Total Interest</div>
            <div className="text-xl font-bold text-red-600">{formatCurrency(totalInterest)}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center">
            <div className="text-sm text-slate-500">Total Cost</div>
            <div className="text-xl font-bold text-green-600">{formatCurrency(totalCost)}</div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingDown className="w-5 h-5" /> Payment Breakdown
          </h3>
          <div className="h-4 rounded-full overflow-hidden flex mb-2">
            <div className="bg-blue-500 h-full" style={{ width: `${(loanAmount / totalPayments) * 100}%` }} />
            <div className="bg-red-500 h-full" style={{ width: `${(totalInterest / totalPayments) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded" /> Principal ({((loanAmount / totalPayments) * 100).toFixed(0)}%)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded" /> Interest ({((totalInterest / totalPayments) * 100).toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Tip:</strong> A larger down payment reduces your monthly payment and total interest. Consider shorter loan terms to save on interest, even if monthly payments are higher.
      </div>
    </div>
  );
}
