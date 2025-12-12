import { useState, useEffect } from 'react';
import { TrendingUp, Plus, Trash2, Download } from 'lucide-react';

interface Stock {
  id: string;
  symbol: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
}

export default function StockTracker() {
  const [stocks, setStocks] = useState<Stock[]>(() => {
    const saved = localStorage.getItem('stockTracker');
    return saved ? JSON.parse(saved) : [];
  });
  const [newStock, setNewStock] = useState({ symbol: '', shares: '', avgCost: '', currentPrice: '' });

  useEffect(() => {
    localStorage.setItem('stockTracker', JSON.stringify(stocks));
  }, [stocks]);

  const addStock = () => {
    if (!newStock.symbol || !newStock.shares || !newStock.avgCost || !newStock.currentPrice) return;
    setStocks([...stocks, {
      id: Date.now().toString(),
      symbol: newStock.symbol.toUpperCase(),
      shares: parseFloat(newStock.shares),
      avgCost: parseFloat(newStock.avgCost),
      currentPrice: parseFloat(newStock.currentPrice)
    }]);
    setNewStock({ symbol: '', shares: '', avgCost: '', currentPrice: '' });
  };

  const updatePrice = (id: string, price: number) => {
    setStocks(stocks.map(s => s.id === id ? { ...s, currentPrice: price } : s));
  };

  const deleteStock = (id: string) => setStocks(stocks.filter(s => s.id !== id));

  const calculateGain = (s: Stock) => {
    const costBasis = s.shares * s.avgCost;
    const currentValue = s.shares * s.currentPrice;
    const gain = currentValue - costBasis;
    const gainPercent = costBasis > 0 ? (gain / costBasis) * 100 : 0;
    return { costBasis, currentValue, gain, gainPercent };
  };

  const totals = stocks.reduce((acc, s) => {
    const { costBasis, currentValue, gain } = calculateGain(s);
    return { costBasis: acc.costBasis + costBasis, currentValue: acc.currentValue + currentValue, gain: acc.gain + gain };
  }, { costBasis: 0, currentValue: 0, gain: 0 });

  const totalGainPercent = totals.costBasis > 0 ? (totals.gain / totals.costBasis) * 100 : 0;

  const formatCurrency = (n: number) => '$' + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatPercent = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(2) + '%';

  const exportPortfolio = () => {
    let text = '=== Stock Portfolio ===\n\n';
    stocks.forEach(s => {
      const { costBasis, currentValue, gain, gainPercent } = calculateGain(s);
      text += `${s.symbol}: ${s.shares} shares @ ${formatCurrency(s.avgCost)}\n`;
      text += `  Current: ${formatCurrency(s.currentPrice)} | Value: ${formatCurrency(currentValue)}\n`;
      text += `  Gain/Loss: ${gain >= 0 ? '+' : ''}${formatCurrency(gain)} (${formatPercent(gainPercent)})\n\n`;
    });
    text += `=== Totals ===\n`;
    text += `Cost Basis: ${formatCurrency(totals.costBasis)}\n`;
    text += `Current Value: ${formatCurrency(totals.currentValue)}\n`;
    text += `Total Gain/Loss: ${totals.gain >= 0 ? '+' : ''}${formatCurrency(totals.gain)} (${formatPercent(totalGainPercent)})\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock-portfolio.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Stock Portfolio Tracker
          </h2>
          {stocks.length > 0 && (
            <button onClick={exportPortfolio} className="btn-secondary text-sm flex items-center gap-1">
              <Download className="w-4 h-4" /> Export
            </button>
          )}
        </div>

        {/* Portfolio Summary */}
        {stocks.length > 0 && (
          <div className={`rounded-xl p-6 text-white text-center mb-6 ${totals.gain >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
            <div className="text-sm opacity-80">Portfolio Value</div>
            <div className="text-5xl font-bold">{formatCurrency(totals.currentValue)}</div>
            <div className="text-xl mt-1">{totals.gain >= 0 ? '+' : '-'}{formatCurrency(totals.gain)} ({formatPercent(totalGainPercent)})</div>
            <div className="mt-4 text-sm opacity-80">Cost Basis: {formatCurrency(totals.costBasis)}</div>
          </div>
        )}

        {/* Add Stock */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-6">
          <h3 className="font-semibold mb-3">Add Stock</h3>
          <div className="grid grid-cols-5 gap-2">
            <input
              type="text"
              placeholder="Symbol"
              value={newStock.symbol}
              onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Shares"
              value={newStock.shares}
              onChange={(e) => setNewStock({ ...newStock, shares: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Avg Cost"
              value={newStock.avgCost}
              onChange={(e) => setNewStock({ ...newStock, avgCost: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Current $"
              value={newStock.currentPrice}
              onChange={(e) => setNewStock({ ...newStock, currentPrice: e.target.value })}
              className="input-field"
            />
            <button onClick={addStock} className="btn-primary flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Holdings */}
        <div className="space-y-3">
          {stocks.map(stock => {
            const { costBasis, currentValue, gain, gainPercent } = calculateGain(stock);
            return (
              <div key={stock.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold text-xl">{stock.symbol}</div>
                    <div className="text-sm text-slate-500">{stock.shares} shares @ {formatCurrency(stock.avgCost)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{formatCurrency(currentValue)}</div>
                    <div className={`text-sm font-medium ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {gain >= 0 ? '+' : '-'}{formatCurrency(gain)} ({formatPercent(gainPercent)})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Current Price:</span>
                  <input
                    type="number"
                    step="0.01"
                    value={stock.currentPrice}
                    onChange={(e) => updatePrice(stock.id, parseFloat(e.target.value) || 0)}
                    className="input-field flex-1 text-sm p-1"
                  />
                  <button onClick={() => deleteStock(stock.id)} className="text-red-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {stocks.length === 0 && (
          <div className="text-center py-8 text-slate-500">Add your stock holdings to track performance</div>
        )}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-100">
        <strong>⚠️ Note:</strong> Update prices manually. This is for tracking purposes only. For real-time data, use a brokerage or financial app.
      </div>
    </div>
  );
}
