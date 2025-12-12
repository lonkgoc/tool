import { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, Download, TrendingUp } from 'lucide-react';

interface Hustle {
  id: string;
  name: string;
  revenue: number;
  expenses: number;
  hours: number;
}

export default function SideHustleProfit() {
  const [hustles, setHustles] = useState<Hustle[]>(() => {
    const saved = localStorage.getItem('sideHustleProfit');
    return saved ? JSON.parse(saved) : [];
  });
  const [newHustle, setNewHustle] = useState({ name: '', revenue: '', expenses: '', hours: '' });

  useEffect(() => {
    localStorage.setItem('sideHustleProfit', JSON.stringify(hustles));
  }, [hustles]);

  const addHustle = () => {
    if (!newHustle.name) return;
    setHustles([...hustles, {
      id: Date.now().toString(),
      name: newHustle.name,
      revenue: parseFloat(newHustle.revenue) || 0,
      expenses: parseFloat(newHustle.expenses) || 0,
      hours: parseFloat(newHustle.hours) || 0
    }]);
    setNewHustle({ name: '', revenue: '', expenses: '', hours: '' });
  };

  const updateHustle = (id: string, field: keyof Hustle, value: number | string) => {
    setHustles(hustles.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const deleteHustle = (id: string) => setHustles(hustles.filter(h => h.id !== id));

  const calculateProfit = (h: Hustle) => {
    const profit = h.revenue - h.expenses;
    const margin = h.revenue > 0 ? (profit / h.revenue) * 100 : 0;
    const hourlyRate = h.hours > 0 ? profit / h.hours : 0;
    return { profit, margin, hourlyRate };
  };

  const totals = hustles.reduce((acc, h) => ({
    revenue: acc.revenue + h.revenue,
    expenses: acc.expenses + h.expenses,
    hours: acc.hours + h.hours
  }), { revenue: 0, expenses: 0, hours: 0 });

  const totalProfit = totals.revenue - totals.expenses;
  const avgHourlyRate = totals.hours > 0 ? totalProfit / totals.hours : 0;
  const overallMargin = totals.revenue > 0 ? (totalProfit / totals.revenue) * 100 : 0;

  const formatCurrency = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const exportReport = () => {
    let text = '=== Side Hustle Profit Report ===\n\n';
    hustles.forEach(h => {
      const { profit, margin, hourlyRate } = calculateProfit(h);
      text += `${h.name}\n`;
      text += `  Revenue: ${formatCurrency(h.revenue)}\n`;
      text += `  Expenses: ${formatCurrency(h.expenses)}\n`;
      text += `  Profit: ${formatCurrency(profit)} (${margin.toFixed(1)}% margin)\n`;
      text += `  Hours: ${h.hours} | Hourly Rate: ${formatCurrency(hourlyRate)}/hr\n\n`;
    });
    text += `=== Totals ===\n`;
    text += `Total Revenue: ${formatCurrency(totals.revenue)}\n`;
    text += `Total Expenses: ${formatCurrency(totals.expenses)}\n`;
    text += `Total Profit: ${formatCurrency(totalProfit)}\n`;
    text += `Avg Hourly Rate: ${formatCurrency(avgHourlyRate)}/hr\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'side-hustle-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-500" />
            Side Hustle Profit Tracker
          </h2>
          {hustles.length > 0 && (
            <button onClick={exportReport} className="btn-secondary text-sm flex items-center gap-1">
              <Download className="w-4 h-4" /> Export
            </button>
          )}
        </div>

        {/* Summary */}
        {hustles.length > 0 && (
          <div className={`rounded-xl p-6 text-center mb-6 ${totalProfit >= 0 ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gradient-to-r from-red-500 to-rose-600'} text-white`}>
            <TrendingUp className="w-10 h-10 mx-auto mb-2" />
            <div className="text-sm opacity-80">Total Profit</div>
            <div className="text-5xl font-bold">{totalProfit >= 0 ? '' : '-'}{formatCurrency(totalProfit)}</div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="opacity-80">Revenue</div>
                <div className="font-bold">{formatCurrency(totals.revenue)}</div>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="opacity-80">Hours</div>
                <div className="font-bold">{totals.hours} hrs</div>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="opacity-80">Hourly Rate</div>
                <div className="font-bold">{formatCurrency(avgHourlyRate)}/hr</div>
              </div>
            </div>
          </div>
        )}

        {/* Add Hustle */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-6">
          <h3 className="font-semibold mb-3">Add Side Hustle</h3>
          <div className="grid grid-cols-5 gap-2">
            <input
              type="text"
              placeholder="Hustle name"
              value={newHustle.name}
              onChange={(e) => setNewHustle({ ...newHustle, name: e.target.value })}
              className="input-field col-span-2"
            />
            <input
              type="number"
              placeholder="Revenue"
              value={newHustle.revenue}
              onChange={(e) => setNewHustle({ ...newHustle, revenue: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Expenses"
              value={newHustle.expenses}
              onChange={(e) => setNewHustle({ ...newHustle, expenses: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Hours"
              value={newHustle.hours}
              onChange={(e) => setNewHustle({ ...newHustle, hours: e.target.value })}
              className="input-field"
            />
          </div>
          <button onClick={addHustle} className="btn-primary w-full mt-2 flex items-center justify-center gap-1">
            <Plus className="w-5 h-5" /> Add Hustle
          </button>
        </div>

        {/* Hustles List */}
        <div className="space-y-3">
          {hustles.map(hustle => {
            const { profit, margin, hourlyRate } = calculateProfit(hustle);
            return (
              <div key={hustle.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-lg">{hustle.name}</div>
                  <button onClick={() => deleteHustle(hustle.id)} className="text-red-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div>
                    <label className="text-xs text-slate-500">Revenue</label>
                    <input type="number" value={hustle.revenue || ''} onChange={(e) => updateHustle(hustle.id, 'revenue', parseFloat(e.target.value) || 0)} className="input-field text-sm p-2" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Expenses</label>
                    <input type="number" value={hustle.expenses || ''} onChange={(e) => updateHustle(hustle.id, 'expenses', parseFloat(e.target.value) || 0)} className="input-field text-sm p-2" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Hours</label>
                    <input type="number" value={hustle.hours || ''} onChange={(e) => updateHustle(hustle.id, 'hours', parseFloat(e.target.value) || 0)} className="input-field text-sm p-2" />
                  </div>
                  <div className={`rounded-lg p-2 text-center ${profit >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
                    <div className="text-xs text-slate-500">Profit</div>
                    <div className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(profit)}</div>
                    <div className={`text-xs ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(hourlyRate)}/hr</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hustles.length === 0 && (
          <div className="text-center py-8 text-slate-500">Add your side hustles to track profitability</div>
        )}
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-sm text-purple-800 dark:text-purple-100">
        <strong>💡 Track Your Time:</strong> Knowing your effective hourly rate helps you decide if a side hustle is worth it. Compare it to your day job or other opportunities!
      </div>
    </div>
  );
}
