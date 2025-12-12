import { useState, useEffect } from 'react';
import { Home, Download, TrendingUp } from 'lucide-react';

export default function RentalRoi() {
  const [purchasePrice, setPurchasePrice] = useState<number>(() => {
    const saved = localStorage.getItem('rentalRoi');
    return saved ? JSON.parse(saved).purchasePrice : 250000;
  });
  const [downPayment, setDownPayment] = useState<number>(() => {
    const saved = localStorage.getItem('rentalRoi');
    return saved ? JSON.parse(saved).downPayment : 50000;
  });
  const [closingCosts, setClosingCosts] = useState<number>(() => {
    const saved = localStorage.getItem('rentalRoi');
    return saved ? JSON.parse(saved).closingCosts : 7500;
  });
  const [monthlyRent, setMonthlyRent] = useState<number>(() => {
    const saved = localStorage.getItem('rentalRoi');
    return saved ? JSON.parse(saved).monthlyRent : 2000;
  });
  const [propertyTax, setPropertyTax] = useState<number>(() => {
    const saved = localStorage.getItem('rentalRoi');
    return saved ? JSON.parse(saved).propertyTax : 3000;
  });
  const [insurance, setInsurance] = useState<number>(() => {
    const saved = localStorage.getItem('rentalRoi');
    return saved ? JSON.parse(saved).insurance : 1200;
  });
  const [maintenance, setMaintenance] = useState<number>(() => {
    const saved = localStorage.getItem('rentalRoi');
    return saved ? JSON.parse(saved).maintenance : 2400;
  });
  const [vacancyRate, setVacancyRate] = useState<number>(() => {
    const saved = localStorage.getItem('rentalRoi');
    return saved ? JSON.parse(saved).vacancyRate : 5;
  });
  const [mortgageRate, setMortgageRate] = useState<number>(() => {
    const saved = localStorage.getItem('rentalRoi');
    return saved ? JSON.parse(saved).mortgageRate : 7;
  });
  const [appreciation, setAppreciation] = useState<number>(() => {
    const saved = localStorage.getItem('rentalRoi');
    return saved ? JSON.parse(saved).appreciation : 3;
  });

  useEffect(() => {
    localStorage.setItem('rentalRoi', JSON.stringify({
      purchasePrice, downPayment, closingCosts, monthlyRent, propertyTax,
      insurance, maintenance, vacancyRate, mortgageRate, appreciation
    }));
  }, [purchasePrice, downPayment, closingCosts, monthlyRent, propertyTax, insurance, maintenance, vacancyRate, mortgageRate, appreciation]);

  // Calculations
  const loanAmount = purchasePrice - downPayment;
  const monthlyMortgageRate = mortgageRate / 100 / 12;
  const months = 30 * 12;
  const monthlyMortgage = monthlyMortgageRate > 0
    ? loanAmount * (monthlyMortgageRate * Math.pow(1 + monthlyMortgageRate, months)) / (Math.pow(1 + monthlyMortgageRate, months) - 1)
    : loanAmount / months;

  const annualRent = monthlyRent * 12;
  const effectiveRent = annualRent * (1 - vacancyRate / 100);
  const annualExpenses = propertyTax + insurance + maintenance + (monthlyMortgage * 12);
  const annualOperatingExpenses = propertyTax + insurance + maintenance;
  const noi = effectiveRent - annualOperatingExpenses;
  const annualCashFlow = effectiveRent - annualExpenses;
  const monthlyCashFlow = annualCashFlow / 12;

  const totalInvestment = downPayment + closingCosts;
  const cashOnCashReturn = totalInvestment > 0 ? (annualCashFlow / totalInvestment) * 100 : 0;
  const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;
  const grossRentMultiplier = monthlyRent > 0 ? purchasePrice / annualRent : 0;
  const onePercentRule = monthlyRent >= purchasePrice * 0.01;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const exportAnalysis = () => {
    let text = '=== Rental Property ROI Analysis ===\n\n';
    text += `Purchase Price: ${formatCurrency(purchasePrice)}\n`;
    text += `Down Payment: ${formatCurrency(downPayment)} (${((downPayment / purchasePrice) * 100).toFixed(0)}%)\n`;
    text += `Loan Amount: ${formatCurrency(loanAmount)}\n\n`;
    text += `Monthly Rent: ${formatCurrency(monthlyRent)}\n`;
    text += `Annual Rent (${100 - vacancyRate}% occupancy): ${formatCurrency(effectiveRent)}\n\n`;
    text += `=== Key Metrics ===\n`;
    text += `Cash-on-Cash Return: ${cashOnCashReturn.toFixed(2)}%\n`;
    text += `Cap Rate: ${capRate.toFixed(2)}%\n`;
    text += `Monthly Cash Flow: ${formatCurrency(monthlyCashFlow)}\n`;
    text += `1% Rule: ${onePercentRule ? 'PASS' : 'FAIL'}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rental-roi-analysis.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-500" />
            Rental Property ROI
          </h2>
          <button onClick={exportAnalysis} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Purchase Price</label>
            <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Down Payment</label>
            <input type="number" value={downPayment} onChange={(e) => setDownPayment(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Closing Costs</label>
            <input type="number" value={closingCosts} onChange={(e) => setClosingCosts(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Rent</label>
            <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mortgage Rate (%)</label>
            <input type="number" step="0.125" value={mortgageRate} onChange={(e) => setMortgageRate(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vacancy Rate (%)</label>
            <input type="number" value={vacancyRate} onChange={(e) => setVacancyRate(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Tax/Year</label>
            <input type="number" value={propertyTax} onChange={(e) => setPropertyTax(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Insurance/Year</label>
            <input type="number" value={insurance} onChange={(e) => setInsurance(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Maintenance/Year</label>
            <input type="number" value={maintenance} onChange={(e) => setMaintenance(Math.max(0, parseFloat(e.target.value) || 0))} className="input-field" />
          </div>
        </div>

        {/* Key Metrics */}
        <div className={`rounded-xl p-6 text-center mb-6 ${annualCashFlow >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'} text-white`}>
          <TrendingUp className="w-10 h-10 mx-auto mb-2" />
          <div className="text-sm opacity-80">Monthly Cash Flow</div>
          <div className="text-5xl font-bold">{monthlyCashFlow >= 0 ? '+' : ''}{formatCurrency(monthlyCashFlow)}</div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <div className="text-sm opacity-80">Cash-on-Cash Return</div>
              <div className="text-2xl font-bold">{cashOnCashReturn.toFixed(1)}%</div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <div className="text-sm opacity-80">Cap Rate</div>
              <div className="text-2xl font-bold">{capRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-blue-700 dark:text-blue-300">NOI</div>
            <div className="text-xl font-bold text-blue-600">{formatCurrency(noi)}</div>
            <div className="text-xs text-blue-500">/year</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-purple-700 dark:text-purple-300">GRM</div>
            <div className="text-xl font-bold text-purple-600">{grossRentMultiplier.toFixed(1)}</div>
            <div className="text-xs text-purple-500">years</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl text-center">
            <div className="text-sm text-orange-700 dark:text-orange-300">Monthly Mortgage</div>
            <div className="text-xl font-bold text-orange-600">{formatCurrency(monthlyMortgage)}</div>
          </div>
          <div className={`p-4 rounded-xl text-center ${onePercentRule ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
            <div className={`text-sm ${onePercentRule ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>1% Rule</div>
            <div className={`text-xl font-bold ${onePercentRule ? 'text-green-600' : 'text-red-600'}`}>
              {onePercentRule ? '✓ PASS' : '✗ FAIL'}
            </div>
            <div className={`text-xs ${onePercentRule ? 'text-green-500' : 'text-red-500'}`}>
              Need: {formatCurrency(purchasePrice * 0.01)}
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Annual Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-500">Gross Rent</div>
              <div className="font-bold text-green-600">+{formatCurrency(annualRent)}</div>
            </div>
            <div>
              <div className="text-slate-500">Vacancy Loss ({vacancyRate}%)</div>
              <div className="font-bold text-red-600">-{formatCurrency(annualRent * vacancyRate / 100)}</div>
            </div>
            <div>
              <div className="text-slate-500">Operating Expenses</div>
              <div className="font-bold text-red-600">-{formatCurrency(annualOperatingExpenses)}</div>
            </div>
            <div>
              <div className="text-slate-500">Mortgage</div>
              <div className="font-bold text-red-600">-{formatCurrency(monthlyMortgage * 12)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Key Terms:</strong> Cash-on-Cash = Annual Cash Flow ÷ Total Investment. Cap Rate = NOI ÷ Purchase Price. 1% Rule = Monthly rent should be ≥1% of purchase price. GRM = Price ÷ Annual Rent.
      </div>
    </div>
  );
}
