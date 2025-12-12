import { useState } from 'react';
import { MapPin, DollarSign, TrendingUp, Calculator } from 'lucide-react';

const cityData: Record<string, { factor: number; country: string }> = {
  'New York, NY': { factor: 1.87, country: 'USA' },
  'San Francisco, CA': { factor: 1.79, country: 'USA' },
  'Los Angeles, CA': { factor: 1.35, country: 'USA' },
  'Chicago, IL': { factor: 1.05, country: 'USA' },
  'Houston, TX': { factor: 0.95, country: 'USA' },
  'Phoenix, AZ': { factor: 0.93, country: 'USA' },
  'Dallas, TX': { factor: 0.96, country: 'USA' },
  'Austin, TX': { factor: 1.02, country: 'USA' },
  'Seattle, WA': { factor: 1.49, country: 'USA' },
  'Denver, CO': { factor: 1.08, country: 'USA' },
  'Miami, FL': { factor: 1.23, country: 'USA' },
  'Atlanta, GA': { factor: 1.01, country: 'USA' },
  'Boston, MA': { factor: 1.52, country: 'USA' },
  'Washington, DC': { factor: 1.41, country: 'USA' },
  'London, UK': { factor: 1.75, country: 'UK' },
  'Paris, France': { factor: 1.45, country: 'France' },
  'Berlin, Germany': { factor: 1.05, country: 'Germany' },
  'Tokyo, Japan': { factor: 1.35, country: 'Japan' },
  'Sydney, Australia': { factor: 1.42, country: 'Australia' },
  'Toronto, Canada': { factor: 1.18, country: 'Canada' },
  'Singapore': { factor: 1.55, country: 'Singapore' },
  'Dubai, UAE': { factor: 1.25, country: 'UAE' },
  'Mumbai, India': { factor: 0.45, country: 'India' },
  'Bangalore, India': { factor: 0.42, country: 'India' },
};

const baseCity = 'Chicago, IL'; // US national average baseline

export default function CostOfLiving() {
  const [income, setIncome] = useState<number>(60000);
  const [currentCity, setCurrentCity] = useState<string>('Chicago, IL');
  const [targetCity, setTargetCity] = useState<string>('New York, NY');
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(3000);

  const currentFactor = cityData[currentCity]?.factor || 1;
  const targetFactor = cityData[targetCity]?.factor || 1;

  const relativeCost = targetFactor / currentFactor;
  const adjustedIncome = Math.round(income * relativeCost);
  const adjustedExpenses = Math.round(monthlyExpenses * relativeCost);
  const incomeDiff = adjustedIncome - income;
  const expensesDiff = adjustedExpenses - monthlyExpenses;

  const cities = Object.keys(cityData).sort();

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-500" />
          Cost of Living Comparison
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Location */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-700 dark:text-slate-300">Current Location</h3>
            <div>
              <label className="block text-sm mb-1">City</label>
              <select
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                className="input-field"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Annual Income ($)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value) || 0)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Monthly Expenses ($)</label>
              <input
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value) || 0)}
                className="input-field"
              />
            </div>
          </div>

          {/* Target Location */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-700 dark:text-slate-300">Target Location</h3>
            <div>
              <label className="block text-sm mb-1">City</label>
              <select
                value={targetCity}
                onChange={(e) => setTargetCity(e.target.value)}
                className="input-field"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-sm text-slate-600 dark:text-slate-400">Cost Index</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {(targetFactor * 100).toFixed(0)}
              </div>
              <div className="text-xs text-slate-500">(100 = US Average)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-sm text-slate-600 dark:text-slate-400">Equivalent Salary Needed</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            ${adjustedIncome.toLocaleString()}
          </div>
          <div className={`text-sm ${incomeDiff >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {incomeDiff >= 0 ? '+' : ''}{incomeDiff.toLocaleString()}/year
          </div>
        </div>

        <div className="card text-center">
          <Calculator className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-sm text-slate-600 dark:text-slate-400">Adjusted Monthly Expenses</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            ${adjustedExpenses.toLocaleString()}
          </div>
          <div className={`text-sm ${expensesDiff >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {expensesDiff >= 0 ? '+' : ''}{expensesDiff.toLocaleString()}/month
          </div>
        </div>

        <div className="card text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-sm text-slate-600 dark:text-slate-400">Cost Difference</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {relativeCost >= 1 ? '+' : ''}{((relativeCost - 1) * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-slate-500">
            {relativeCost >= 1 ? 'More expensive' : 'Less expensive'}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="card">
        <h3 className="font-semibold mb-4">Cost Breakdown Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-slate-700">
                <th className="text-left py-2">Category</th>
                <th className="text-right py-2">{currentCity}</th>
                <th className="text-right py-2">{targetCity}</th>
                <th className="text-right py-2">Difference</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Housing (40%)', pct: 0.4 },
                { name: 'Transportation (15%)', pct: 0.15 },
                { name: 'Food (15%)', pct: 0.15 },
                { name: 'Healthcare (10%)', pct: 0.10 },
                { name: 'Utilities (10%)', pct: 0.10 },
                { name: 'Other (10%)', pct: 0.10 },
              ].map(cat => {
                const current = Math.round(monthlyExpenses * cat.pct);
                const target = Math.round(adjustedExpenses * cat.pct);
                const diff = target - current;
                return (
                  <tr key={cat.name} className="border-b dark:border-slate-700">
                    <td className="py-2">{cat.name}</td>
                    <td className="text-right">${current}</td>
                    <td className="text-right">${target}</td>
                    <td className={`text-right ${diff >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {diff >= 0 ? '+' : ''}{diff}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
        <p className="font-medium mb-2">Note:</p>
        <p>Cost of living indices are approximate and based on general data. Actual costs may vary based on lifestyle, specific neighborhoods, and current market conditions.</p>
      </div>
    </div>
  );
}
