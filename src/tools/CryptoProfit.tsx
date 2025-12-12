import { useState, useEffect } from 'react';
import { Coins, TrendingUp, TrendingDown, Download, Plus, Trash2 } from 'lucide-react';

interface CryptoHolding {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

export default function CryptoProfit() {
  const [holdings, setHoldings] = useState<CryptoHolding[]>(() => {
    const saved = localStorage.getItem('cryptoHoldings');
    return saved ? JSON.parse(saved) : [];
  });
  const [newHolding, setNewHolding] = useState({ name: '', symbol: '', quantity: '', buyPrice: '', currentPrice: '' });

  useEffect(() => {
    localStorage.setItem('cryptoHoldings', JSON.stringify(holdings));
  }, [holdings]);

  const addHolding = () => {
    if (!newHolding.name || !newHolding.quantity || !newHolding.buyPrice || !newHolding.currentPrice) return;
    setHoldings([...holdings, {
      id: Date.now().toString(),
      name: newHolding.name,
      symbol: newHolding.symbol.toUpperCase() || newHolding.name.substring(0, 3).toUpperCase(),
      quantity: parseFloat(newHolding.quantity),
      buyPrice: parseFloat(newHolding.buyPrice),
      currentPrice: parseFloat(newHolding.currentPrice)
    }]);
    setNewHolding({ name: '', symbol: '', quantity: '', buyPrice: '', currentPrice: '' });
  };

  const updatePrice = (id: string, price: number) => {
    setHoldings(holdings.map(h => h.id === id ? { ...h, currentPrice: price } : h));
  };

  const deleteHolding = (id: string) => setHoldings(holdings.filter(h => h.id !== id));

  const calculateProfit = (h: CryptoHolding) => {
    const invested = h.quantity * h.buyPrice;
    const current = h.quantity * h.currentPrice;
    const profit = current - invested;
    const percentChange = invested > 0 ? ((current - invested) / invested) * 100 : 0;
    return { invested, current, profit, percentChange };
  };

  const totals = holdings.reduce((acc, h) => {
    const { invested, current, profit } = calculateProfit(h);
    return { invested: acc.invested + invested, current: acc.current + current, profit: acc.profit + profit };
  }, { invested: 0, current: 0, profit: 0 });

  const totalPercentChange = totals.invested > 0 ? ((totals.current - totals.invested) / totals.invested) * 100 : 0;

  const formatCurrency = (n: number) => '$' + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatPercent = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(2) + '%';

  const exportPortfolio = () => {
    let text = '=== Crypto Portfolio ===\n\n';
    holdings.forEach(h => {
      const { invested, current, profit, percentChange } = calculateProfit(h);
      text += `${h.name} (${h.symbol})\n`;
      text += `  Quantity: ${h.quantity}\n`;
      text += `  Buy Price: ${formatCurrency(h.buyPrice)}\n`;
      text += `  Current Price: ${formatCurrency(h.currentPrice)}\n`;
      text += `  P/L: ${profit >= 0 ? '+' : '-'}${formatCurrency(profit)} (${formatPercent(percentChange)})\n\n`;
    });
    text += `=== Totals ===\n`;
    text += `Total Invested: ${formatCurrency(totals.invested)}\n`;
    text += `Current Value: ${formatCurrency(totals.current)}\n`;
    text += `Total P/L: ${totals.profit >= 0 ? '+' : '-'}${formatCurrency(totals.profit)} (${formatPercent(totalPercentChange)})\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crypto-portfolio.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Coins className="w-6 h-6 text-yellow-500" />
            Crypto Profit Calculator
          </h2>
          {holdings.length > 0 && (
            <button onClick={exportPortfolio} className="btn-secondary text-sm flex items-center gap-1">
              <Download className="w-4 h-4" /> Export
            </button>
          )}
        </div>

        {/* Portfolio Summary */}
        {holdings.length > 0 && (
          <div className={`rounded-xl p-6 text-white text-center mb-6 ${totals.profit >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {totals.profit >= 0 ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
              <span className="text-lg">Portfolio P/L</span>
            </div>
            <div className="text-5xl font-bold">
              {totals.profit >= 0 ? '+' : '-'}{formatCurrency(totals.profit)}
            </div>
            <div className="text-xl opacity-80">{formatPercent(totalPercentChange)}</div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="opacity-80">Invested</div>
                <div className="font-bold">{formatCurrency(totals.invested)}</div>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="opacity-80">Current Value</div>
                <div className="font-bold">{formatCurrency(totals.current)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Add Holding */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-6">
          <h3 className="font-semibold mb-3">Add Crypto Holding</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            <input
              type="text"
              placeholder="Coin name (e.g., Bitcoin)"
              value={newHolding.name}
              onChange={(e) => setNewHolding({ ...newHolding, name: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Symbol (e.g., BTC)"
              value={newHolding.symbol}
              onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              step="any"
              placeholder="Quantity"
              value={newHolding.quantity}
              onChange={(e) => setNewHolding({ ...newHolding, quantity: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              step="any"
              placeholder="Buy price ($)"
              value={newHolding.buyPrice}
              onChange={(e) => setNewHolding({ ...newHolding, buyPrice: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              step="any"
              placeholder="Current price ($)"
              value={newHolding.currentPrice}
              onChange={(e) => setNewHolding({ ...newHolding, currentPrice: e.target.value })}
              className="input-field"
            />
            <button onClick={addHolding} className="btn-primary flex items-center justify-center gap-1">
              <Plus className="w-5 h-5" /> Add
            </button>
          </div>
        </div>

        {/* Holdings List */}
        <div className="space-y-3">
          {holdings.map(holding => {
            const { invested, current, profit, percentChange } = calculateProfit(holding);
            return (
              <div key={holding.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-lg">{holding.name}</div>
                    <div className="text-sm text-slate-500">{holding.symbol} • {holding.quantity} coins</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profit >= 0 ? '+' : '-'}{formatCurrency(profit)}
                    </div>
                    <div className={`text-sm ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(percentChange)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <div className="text-slate-500">Buy Price</div>
                    <div className="font-medium">{formatCurrency(holding.buyPrice)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Current</div>
                    <input
                      type="number"
                      step="any"
                      value={holding.currentPrice}
                      onChange={(e) => updatePrice(holding.id, parseFloat(e.target.value) || 0)}
                      className="input-field text-sm p-1"
                    />
                  </div>
                  <div>
                    <div className="text-slate-500">Invested</div>
                    <div className="font-medium">{formatCurrency(invested)}</div>
                  </div>
                  <div className="flex items-end justify-end">
                    <button onClick={() => deleteHolding(holding.id)} className="text-red-400 hover:text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {holdings.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            Add your crypto holdings to track profit/loss
          </div>
        )}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-100">
        <strong>⚠️ Disclaimer:</strong> This is for tracking purposes only. Update current prices manually. Crypto investments are volatile and risky.
      </div>
    </div>
  );
}
