import { useState, useEffect } from 'react';
import { TrendingUp, Download, Plus, Trash2 } from 'lucide-react';

interface Investment {
  id: string;
  name: string;
  initialInvestment: number;
  currentValue: number;
  date: string;
}

export default function ROI() {
  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem('roiInvestments');
    return saved ? JSON.parse(saved) : [];
  });
  const [newInvestment, setNewInvestment] = useState({ name: '', initial: '', current: '' });

  // Simple calculation mode
  const [simpleInitial, setSimpleInitial] = useState<number>(10000);
  const [simpleFinal, setSimpleFinal] = useState<number>(12500);
  const [years, setYears] = useState<number>(1);

  useEffect(() => {
    localStorage.setItem('roiInvestments', JSON.stringify(investments));
  }, [investments]);

  const addInvestment = () => {
    if (!newInvestment.name || !newInvestment.initial || !newInvestment.current) return;
    setInvestments([...investments, {
      id: Date.now().toString(),
      name: newInvestment.name,
      initialInvestment: parseFloat(newInvestment.initial),
      currentValue: parseFloat(newInvestment.current),
      date: new Date().toISOString().split('T')[0]
    }]);
    setNewInvestment({ name: '', initial: '', current: '' });
  };

  const deleteInvestment = (id: string) => setInvestments(investments.filter(i => i.id !== id));

  const calculateROI = (initial: number, final: number) => ((final - initial) / initial) * 100;
  const calculateAnnualizedROI = (initial: number, final: number, yrs: number) =>
    (Math.pow(final / initial, 1 / yrs) - 1) * 100;

  const simpleROI = calculateROI(simpleInitial, simpleFinal);
  const simpleAnnualized = calculateAnnualizedROI(simpleInitial, simpleFinal, years);
  const simpleProfit = simpleFinal - simpleInitial;

  const totalInitial = investments.reduce((sum, i) => sum + i.initialInvestment, 0);
  const totalCurrent = investments.reduce((sum, i) => sum + i.currentValue, 0);
  const totalROI = totalInitial > 0 ? calculateROI(totalInitial, totalCurrent) : 0;

  const exportReport = () => {
    let text = '=== ROI Report ===\n\n';
    text += `Simple Calculation:\n`;
    text += `Initial: $${simpleInitial.toLocaleString()}\n`;
    text += `Final: $${simpleFinal.toLocaleString()}\n`;
    text += `ROI: ${simpleROI.toFixed(2)}%\n`;
    text += `Annualized (${years}yr): ${simpleAnnualized.toFixed(2)}%\n\n`;

    if (investments.length > 0) {
      text += `=== Investment Portfolio ===\n`;
      investments.forEach(i => {
        const roi = calculateROI(i.initialInvestment, i.currentValue);
        text += `${i.name}: $${i.initialInvestment.toLocaleString()} → $${i.currentValue.toLocaleString()} (${roi.toFixed(2)}%)\n`;
      });
      text += `\nTotal Portfolio ROI: ${totalROI.toFixed(2)}%\n`;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roi-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            ROI Calculator
          </h2>
          <button onClick={exportReport} className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        {/* Simple Calculator */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-xl mb-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick ROI Calculator</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Initial Investment
              </label>
              <input
                type="number"
                value={simpleInitial}
                onChange={(e) => setSimpleInitial(Math.max(0, parseFloat(e.target.value) || 0))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Final Value
              </label>
              <input
                type="number"
                value={simpleFinal}
                onChange={(e) => setSimpleFinal(Math.max(0, parseFloat(e.target.value) || 0))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Time Period (Years)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={years}
                onChange={(e) => setYears(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl text-center ${simpleProfit >= 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
              <div className="text-sm text-slate-600 dark:text-slate-400">Profit/Loss</div>
              <div className={`text-2xl font-bold ${simpleProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {simpleProfit >= 0 ? '+' : ''}{formatCurrency(simpleProfit)}
              </div>
            </div>
            <div className={`p-4 rounded-xl text-center ${simpleROI >= 0 ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total ROI</div>
              <div className={`text-2xl font-bold ${simpleROI >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {simpleROI >= 0 ? '+' : ''}{simpleROI.toFixed(2)}%
              </div>
            </div>
            <div className={`p-4 rounded-xl text-center ${simpleAnnualized >= 0 ? 'bg-purple-100 dark:bg-purple-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
              <div className="text-sm text-slate-600 dark:text-slate-400">Annualized ROI</div>
              <div className={`text-2xl font-bold ${simpleAnnualized >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                {simpleAnnualized >= 0 ? '+' : ''}{simpleAnnualized.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Tracker */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Investment Portfolio Tracker</h3>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <input
              type="text"
              placeholder="Investment name"
              value={newInvestment.name}
              onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
              className="input-field col-span-2"
            />
            <input
              type="number"
              placeholder="Initial ($)"
              value={newInvestment.initial}
              onChange={(e) => setNewInvestment({ ...newInvestment, initial: e.target.value })}
              className="input-field"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Current ($)"
                value={newInvestment.current}
                onChange={(e) => setNewInvestment({ ...newInvestment, current: e.target.value })}
                className="input-field flex-1"
              />
              <button onClick={addInvestment} className="btn-primary px-3">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {investments.length > 0 && (
            <>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {investments.map(inv => {
                  const roi = calculateROI(inv.initialInvestment, inv.currentValue);
                  const profit = inv.currentValue - inv.initialInvestment;
                  return (
                    <div key={inv.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{inv.name}</div>
                        <div className="text-xs text-slate-500">
                          {formatCurrency(inv.initialInvestment)} → {formatCurrency(inv.currentValue)}
                        </div>
                      </div>
                      <div className={`text-right mr-3 ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <div className="font-bold">{roi >= 0 ? '+' : ''}{roi.toFixed(1)}%</div>
                        <div className="text-xs">{profit >= 0 ? '+' : ''}{formatCurrency(profit)}</div>
                      </div>
                      <button onClick={() => deleteInvestment(inv.id)} className="text-red-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className={`p-4 rounded-xl text-center ${totalROI >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Portfolio ROI</div>
                <div className={`text-3xl font-bold ${totalROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(2)}%
                </div>
                <div className="text-sm text-slate-500">
                  {formatCurrency(totalInitial)} → {formatCurrency(totalCurrent)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 ROI Formula:</strong> ROI = ((Final Value - Initial Investment) / Initial Investment) × 100. Annualized ROI accounts for the time period to compare investments of different durations.
      </div>
    </div>
  );
}
