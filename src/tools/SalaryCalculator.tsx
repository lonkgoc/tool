import { useState, useEffect } from 'react';
import { DollarSign, Download, PieChart } from 'lucide-react';

export default function SalaryCalculator() {
  const [salary, setSalary] = useState<number>(() => {
    const saved = localStorage.getItem('salaryCalculator');
    return saved ? JSON.parse(saved).salary : 60000;
  });
  const [payFrequency, setPayFrequency] = useState<string>(() => {
    const saved = localStorage.getItem('salaryCalculator');
    return saved ? JSON.parse(saved).payFrequency : 'yearly';
  });
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(() => {
    const saved = localStorage.getItem('salaryCalculator');
    return saved ? JSON.parse(saved).hoursPerWeek : 40;
  });
  const [taxRate, setTaxRate] = useState<number>(() => {
    const saved = localStorage.getItem('salaryCalculator');
    return saved ? JSON.parse(saved).taxRate : 25;
  });

  useEffect(() => {
    localStorage.setItem('salaryCalculator', JSON.stringify({ salary, payFrequency, hoursPerWeek, taxRate }));
  }, [salary, payFrequency, hoursPerWeek, taxRate]);

  // Convert to yearly based on input frequency
  let yearlySalary = salary;
  switch (payFrequency) {
    case 'hourly': yearlySalary = salary * hoursPerWeek * 52; break;
    case 'weekly': yearlySalary = salary * 52; break;
    case 'biweekly': yearlySalary = salary * 26; break;
    case 'monthly': yearlySalary = salary * 12; break;
  }

  const taxAmount = yearlySalary * (taxRate / 100);
  const afterTax = yearlySalary - taxAmount;

  const breakdown = {
    yearly: yearlySalary,
    monthly: yearlySalary / 12,
    biweekly: yearlySalary / 26,
    weekly: yearlySalary / 52,
    daily: yearlySalary / 260,
    hourly: yearlySalary / (hoursPerWeek * 52)
  };

  const afterTaxBreakdown = {
    yearly: afterTax,
    monthly: afterTax / 12,
    biweekly: afterTax / 26,
    weekly: afterTax / 52,
    daily: afterTax / 260,
    hourly: afterTax / (hoursPerWeek * 52)
  };

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const exportBreakdown = () => {
    let text = '=== Salary Breakdown ===\n\n';
    text += `Gross Annual Salary: ${formatCurrency(yearlySalary)}\n`;
    text += `Tax Rate: ${taxRate}%\n`;
    text += `After-Tax Annual: ${formatCurrency(afterTax)}\n\n`;
    text += '=== Gross Breakdown ===\n';
    text += `Monthly: ${formatCurrency(breakdown.monthly)}\n`;
    text += `Bi-Weekly: ${formatCurrency(breakdown.biweekly)}\n`;
    text += `Weekly: ${formatCurrency(breakdown.weekly)}\n`;
    text += `Daily: ${formatCurrency(breakdown.daily)}\n`;
    text += `Hourly: ${formatCurrency(breakdown.hourly)}\n\n`;
    text += '=== After-Tax Breakdown ===\n';
    text += `Monthly: ${formatCurrency(afterTaxBreakdown.monthly)}\n`;
    text += `Bi-Weekly: ${formatCurrency(afterTaxBreakdown.biweekly)}\n`;
    text += `Weekly: ${formatCurrency(afterTaxBreakdown.weekly)}\n`;
    text += `Daily: ${formatCurrency(afterTaxBreakdown.daily)}\n`;
    text += `Hourly: ${formatCurrency(afterTaxBreakdown.hourly)}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salary-breakdown.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-500" />
            Salary Calculator
          </h2>
          <button onClick={exportBreakdown} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Salary Amount
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Pay Frequency
            </label>
            <select value={payFrequency} onChange={(e) => setPayFrequency(e.target.value)} className="input-field">
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="weekly">Weekly</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Hours/Week
            </label>
            <input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Math.max(1, parseInt(e.target.value) || 40))}
              className="input-field"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Estimated Tax Rate: {taxRate}%
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={taxRate}
            onChange={(e) => setTaxRate(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-blue-700 dark:text-blue-300">Gross Annual</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(yearlySalary)}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-green-700 dark:text-green-300">After Tax</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(afterTax)}</div>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" /> Salary Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 font-semibold">Period</th>
                  <th className="text-right py-2 font-semibold text-blue-600">Gross</th>
                  <th className="text-right py-2 font-semibold text-red-500">Tax</th>
                  <th className="text-right py-2 font-semibold text-green-600">Net</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Yearly', gross: breakdown.yearly, net: afterTaxBreakdown.yearly },
                  { label: 'Monthly', gross: breakdown.monthly, net: afterTaxBreakdown.monthly },
                  { label: 'Bi-Weekly', gross: breakdown.biweekly, net: afterTaxBreakdown.biweekly },
                  { label: 'Weekly', gross: breakdown.weekly, net: afterTaxBreakdown.weekly },
                  { label: 'Daily', gross: breakdown.daily, net: afterTaxBreakdown.daily },
                  { label: 'Hourly', gross: breakdown.hourly, net: afterTaxBreakdown.hourly },
                ].map(row => (
                  <tr key={row.label} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 font-medium">{row.label}</td>
                    <td className="text-right py-2 text-blue-600">{formatCurrency(row.gross)}</td>
                    <td className="text-right py-2 text-red-500">{formatCurrency(row.gross - row.net)}</td>
                    <td className="text-right py-2 text-green-600 font-semibold">{formatCurrency(row.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Note:</strong> This is an estimate. Actual taxes depend on your location, filing status, deductions, and other factors. Consult a tax professional for accurate calculations.
      </div>
    </div>
  );
}
