import { useState } from 'react';
import { Briefcase, Calculator, Clock } from 'lucide-react';

export default function FreelanceRate() {
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState<number>(80000);
  const [businessExpenses, setBusinessExpenses] = useState<number>(5000);
  const [taxes, setTaxes] = useState<number>(25);
  const [vacationWeeks, setVacationWeeks] = useState<number>(3);
  const [sickDays, setSickDays] = useState<number>(5);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [billablePercent, setBillablePercent] = useState<number>(70);

  // Calculations
  const workingWeeks = 52 - vacationWeeks;
  const workingDays = workingWeeks * 5 - sickDays;
  const totalHoursAvailable = workingDays * (hoursPerWeek / 5);
  const billableHours = totalHoursAvailable * (billablePercent / 100);

  const grossIncomeNeeded = (desiredAnnualIncome + businessExpenses) / (1 - taxes / 100);
  const hourlyRate = billableHours > 0 ? grossIncomeNeeded / billableHours : 0;
  const dailyRate = hourlyRate * (hoursPerWeek / 5);
  const weeklyRate = hourlyRate * hoursPerWeek * (billablePercent / 100);
  const monthlyRate = grossIncomeNeeded / 12;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-purple-500" />
          Freelance Rate Calculator
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Desired Annual Income</label>
            <input type="number" value={desiredAnnualIncome} onChange={(e) => setDesiredAnnualIncome(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
            <p className="text-xs text-slate-500 mt-1">Take-home after taxes</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Annual Business Expenses</label>
            <input type="number" value={businessExpenses} onChange={(e) => setBusinessExpenses(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
            <p className="text-xs text-slate-500 mt-1">Software, equipment, etc.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tax Rate (%)</label>
            <input type="number" value={taxes} onChange={(e) => setTaxes(Math.max(0, Math.min(60, parseFloat(e.target.value) || 0)))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vacation Weeks/Year</label>
            <input type="number" value={vacationWeeks} onChange={(e) => setVacationWeeks(Math.max(0, Math.min(12, parseInt(e.target.value) || 0)))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sick Days/Year</label>
            <input type="number" value={sickDays} onChange={(e) => setSickDays(Math.max(0, parseInt(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hours/Week</label>
            <input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Math.max(1, parseInt(e.target.value) || 40))} className="input-field" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Billable Hours: {billablePercent}% of working time
          </label>
          <input
            type="range"
            min="30"
            max="100"
            value={billablePercent}
            onChange={(e) => setBillablePercent(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>30% (lots of admin)</span>
            <span>70% (typical)</span>
            <span>100% (all billable)</span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white text-center mb-6">
          <Calculator className="w-10 h-10 mx-auto mb-2" />
          <div className="text-sm opacity-80">Your Minimum Hourly Rate</div>
          <div className="text-6xl font-bold">{formatCurrency(hourlyRate)}</div>
          <div className="text-sm opacity-80 mt-2">per billable hour</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-purple-700 dark:text-purple-300">Hourly</div>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(hourlyRate)}</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-blue-700 dark:text-blue-300">Daily (8hr)</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(hourlyRate * 8)}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-green-700 dark:text-green-300">Weekly</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(weeklyRate)}</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-orange-700 dark:text-orange-300">Monthly</div>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(monthlyRate)}</div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Time Breakdown
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-500">Working Weeks</div>
              <div className="font-bold">{workingWeeks} weeks</div>
            </div>
            <div>
              <div className="text-slate-500">Working Days</div>
              <div className="font-bold">{workingDays} days</div>
            </div>
            <div>
              <div className="text-slate-500">Total Available Hours</div>
              <div className="font-bold">{totalHoursAvailable.toLocaleString()} hours</div>
            </div>
            <div>
              <div className="text-slate-500">Billable Hours</div>
              <div className="font-bold">{billableHours.toLocaleString()} hours</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-sm text-purple-800 dark:text-purple-100">
        <strong>💼 Freelance Tips:</strong> Account for non-billable time (admin, marketing, learning). Most freelancers can bill 60-80% of their working hours. Always factor in taxes, healthcare, and retirement!
      </div>
    </div>
  );
}
