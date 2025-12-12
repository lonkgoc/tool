import { useState, useEffect } from 'react';
import { Home, Download, TrendingDown } from 'lucide-react';

export default function Mortgage() {
  const [homePrice, setHomePrice] = useState<number>(() => {
    const saved = localStorage.getItem('mortgageCalc');
    return saved ? JSON.parse(saved).homePrice : 350000;
  });
  const [downPayment, setDownPayment] = useState<number>(() => {
    const saved = localStorage.getItem('mortgageCalc');
    return saved ? JSON.parse(saved).downPayment : 70000;
  });
  const [interestRate, setInterestRate] = useState<number>(() => {
    const saved = localStorage.getItem('mortgageCalc');
    return saved ? JSON.parse(saved).interestRate : 6.5;
  });
  const [loanTerm, setLoanTerm] = useState<number>(() => {
    const saved = localStorage.getItem('mortgageCalc');
    return saved ? JSON.parse(saved).loanTerm : 30;
  });
  const [propertyTax, setPropertyTax] = useState<number>(() => {
    const saved = localStorage.getItem('mortgageCalc');
    return saved ? JSON.parse(saved).propertyTax : 3500;
  });
  const [insurance, setInsurance] = useState<number>(() => {
    const saved = localStorage.getItem('mortgageCalc');
    return saved ? JSON.parse(saved).insurance : 1200;
  });

  useEffect(() => {
    localStorage.setItem('mortgageCalc', JSON.stringify({ homePrice, downPayment, interestRate, loanTerm, propertyTax, insurance }));
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, insurance]);

  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;

  const monthlyPrincipalInterest = monthlyRate > 0
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : loanAmount / numPayments;

  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = insurance / 12;
  const totalMonthlyPayment = monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance;

  const totalPayments = monthlyPrincipalInterest * numPayments;
  const totalInterest = totalPayments - loanAmount;
  const downPaymentPercent = (downPayment / homePrice) * 100;

  // Amortization schedule (first 12 months and summary)
  const generateAmortization = () => {
    const schedule = [];
    let balance = loanAmount;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;

    for (let month = 1; month <= numPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPrincipalInterest - interestPayment;
      balance -= principalPayment;
      totalPrincipalPaid += principalPayment;
      totalInterestPaid += interestPayment;

      if (month <= 12 || month === numPayments) {
        schedule.push({ month, principal: principalPayment, interest: interestPayment, balance: Math.max(0, balance), totalPrincipal: totalPrincipalPaid, totalInterest: totalInterestPaid });
      }
    }
    return schedule;
  };

  const exportReport = () => {
    let text = '=== Mortgage Report ===\n\n';
    text += `Home Price: $${homePrice.toLocaleString()}\n`;
    text += `Down Payment: $${downPayment.toLocaleString()} (${downPaymentPercent.toFixed(1)}%)\n`;
    text += `Loan Amount: $${loanAmount.toLocaleString()}\n`;
    text += `Interest Rate: ${interestRate}%\n`;
    text += `Loan Term: ${loanTerm} years\n\n`;
    text += `=== Monthly Payment Breakdown ===\n`;
    text += `Principal & Interest: $${monthlyPrincipalInterest.toFixed(2)}\n`;
    text += `Property Tax: $${monthlyPropertyTax.toFixed(2)}\n`;
    text += `Insurance: $${monthlyInsurance.toFixed(2)}\n`;
    text += `Total Monthly: $${totalMonthlyPayment.toFixed(2)}\n\n`;
    text += `=== Total Cost ===\n`;
    text += `Total Payments: $${totalPayments.toFixed(2)}\n`;
    text += `Total Interest: $${totalInterest.toFixed(2)}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mortgage-calculation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-500" />
            Mortgage Calculator
          </h2>
          <button onClick={exportReport} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Home Price</label>
            <input type="number" value={homePrice} onChange={(e) => setHomePrice(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Down Payment</label>
            <input type="number" value={downPayment} onChange={(e) => setDownPayment(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
            <div className="text-xs text-slate-500 mt-1">{downPaymentPercent.toFixed(1)}% down</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Interest Rate (%)</label>
            <input type="number" step="0.125" value={interestRate} onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loan Term</label>
            <select value={loanTerm} onChange={(e) => setLoanTerm(parseInt(e.target.value))} className="input-field">
              <option value={15}>15 Years</option>
              <option value={20}>20 Years</option>
              <option value={30}>30 Years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Tax/Year</label>
            <input type="number" value={propertyTax} onChange={(e) => setPropertyTax(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Insurance/Year</label>
            <input type="number" value={insurance} onChange={(e) => setInsurance(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white mb-6">
          <div className="text-center mb-4">
            <div className="text-sm opacity-80">Monthly Payment</div>
            <div className="text-5xl font-bold">{formatCurrency(totalMonthlyPayment)}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-white/20 p-2 rounded-lg">
              <div className="opacity-80">Principal & Interest</div>
              <div className="font-bold">{formatCurrency(monthlyPrincipalInterest)}</div>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <div className="opacity-80">Property Tax</div>
              <div className="font-bold">{formatCurrency(monthlyPropertyTax)}</div>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <div className="opacity-80">Insurance</div>
              <div className="font-bold">{formatCurrency(monthlyInsurance)}</div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-blue-700 dark:text-blue-300">Loan Amount</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(loanAmount)}</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-red-700 dark:text-red-300">Total Interest</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalInterest)}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-green-700 dark:text-green-300">Total Cost</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(homePrice + totalInterest)}</div>
          </div>
        </div>

        {/* Visual Breakdown */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <TrendingDown className="w-5 h-5" /> Payment Breakdown
          </h3>
          <div className="h-6 rounded-full overflow-hidden flex">
            <div className="bg-blue-500 h-full" style={{ width: `${(loanAmount / (loanAmount + totalInterest)) * 100}%` }} title="Principal" />
            <div className="bg-red-500 h-full" style={{ width: `${(totalInterest / (loanAmount + totalInterest)) * 100}%` }} title="Interest" />
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded" /> Principal ({((loanAmount / (loanAmount + totalInterest)) * 100).toFixed(0)}%)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded" /> Interest ({((totalInterest / (loanAmount + totalInterest)) * 100).toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Tip:</strong> A 20% down payment avoids PMI (Private Mortgage Insurance). Consider a 15-year term to save on interest, though monthly payments will be higher.
      </div>
    </div>
  );
}
