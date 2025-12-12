import { useState, useEffect } from 'react';
import { Wallet, Download, TrendingUp } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  value: number;
  category: 'cash' | 'investments' | 'property' | 'other';
}

interface Liability {
  id: string;
  name: string;
  value: number;
  category: 'mortgage' | 'loans' | 'credit' | 'other';
}

export default function NetWorth() {
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('netWorthAssets');
    return saved ? JSON.parse(saved) : [];
  });
  const [liabilities, setLiabilities] = useState<Liability[]>(() => {
    const saved = localStorage.getItem('netWorthLiabilities');
    return saved ? JSON.parse(saved) : [];
  });
  const [newAsset, setNewAsset] = useState({ name: '', value: '', category: 'cash' as const });
  const [newLiability, setNewLiability] = useState({ name: '', value: '', category: 'loans' as const });

  useEffect(() => {
    localStorage.setItem('netWorthAssets', JSON.stringify(assets));
    localStorage.setItem('netWorthLiabilities', JSON.stringify(liabilities));
  }, [assets, liabilities]);

  const addAsset = () => {
    if (!newAsset.name || !newAsset.value) return;
    setAssets([...assets, { id: Date.now().toString(), name: newAsset.name, value: parseFloat(newAsset.value), category: newAsset.category }]);
    setNewAsset({ name: '', value: '', category: 'cash' });
  };

  const addLiability = () => {
    if (!newLiability.name || !newLiability.value) return;
    setLiabilities([...liabilities, { id: Date.now().toString(), name: newLiability.name, value: parseFloat(newLiability.value), category: newLiability.category }]);
    setNewLiability({ name: '', value: '', category: 'loans' });
  };

  const deleteAsset = (id: string) => setAssets(assets.filter(a => a.id !== id));
  const deleteLiability = (id: string) => setLiabilities(liabilities.filter(l => l.id !== id));

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const assetCategories = ['cash', 'investments', 'property', 'other'];
  const liabilityCategories = ['mortgage', 'loans', 'credit', 'other'];

  const exportReport = () => {
    let text = `=== Net Worth Report ===\nDate: ${new Date().toLocaleDateString()}\n\n`;
    text += `NET WORTH: $${netWorth.toLocaleString()}\n\n`;
    text += `=== ASSETS ($${totalAssets.toLocaleString()}) ===\n`;
    assets.forEach(a => { text += `  ${a.name}: $${a.value.toLocaleString()} (${a.category})\n`; });
    text += `\n=== LIABILITIES ($${totalLiabilities.toLocaleString()}) ===\n`;
    liabilities.forEach(l => { text += `  ${l.name}: $${l.value.toLocaleString()} (${l.category})\n`; });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `net-worth-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (n: number) => '$' + Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      {/* Net Worth Summary */}
      <div className={`p-6 rounded-xl text-center ${netWorth >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'} text-white`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wallet className="w-8 h-8" />
          <span className="text-lg font-medium">Your Net Worth</span>
        </div>
        <div className="text-5xl font-bold">{netWorth >= 0 ? '' : '-'}{formatCurrency(netWorth)}</div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white/20 p-2 rounded-lg">
            <div className="font-semibold">Assets</div>
            <div>{formatCurrency(totalAssets)}</div>
          </div>
          <div className="bg-white/20 p-2 rounded-lg">
            <div className="font-semibold">Liabilities</div>
            <div>{formatCurrency(totalLiabilities)}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={exportReport} className="btn-secondary text-sm flex items-center gap-1">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="card border-2 border-green-200 dark:border-green-800">
          <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Assets
          </h3>

          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Asset name (e.g., Savings Account)"
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              className="input-field"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Value ($)"
                value={newAsset.value}
                onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
                className="input-field"
              />
              <select value={newAsset.category} onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value as any })} className="input-field">
                <option value="cash">💵 Cash</option>
                <option value="investments">📈 Investments</option>
                <option value="property">🏠 Property</option>
                <option value="other">📦 Other</option>
              </select>
            </div>
            <button onClick={addAsset} className="btn-primary w-full bg-green-500 hover:bg-green-600">Add Asset</button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {assets.map(asset => (
              <div key={asset.id} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{asset.name}</div>
                  <div className="text-xs text-slate-500">{asset.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-600">{formatCurrency(asset.value)}</span>
                  <button onClick={() => deleteAsset(asset.id)} className="text-red-400 hover:text-red-500">×</button>
                </div>
              </div>
            ))}
            {assets.length === 0 && <div className="text-sm text-slate-400 text-center py-4">No assets added</div>}
          </div>
        </div>

        {/* Liabilities */}
        <div className="card border-2 border-red-200 dark:border-red-800">
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">📉 Liabilities</h3>

          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Liability name (e.g., Credit Card)"
              value={newLiability.name}
              onChange={(e) => setNewLiability({ ...newLiability, name: e.target.value })}
              className="input-field"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Amount ($)"
                value={newLiability.value}
                onChange={(e) => setNewLiability({ ...newLiability, value: e.target.value })}
                className="input-field"
              />
              <select value={newLiability.category} onChange={(e) => setNewLiability({ ...newLiability, category: e.target.value as any })} className="input-field">
                <option value="mortgage">🏠 Mortgage</option>
                <option value="loans">💳 Loans</option>
                <option value="credit">💳 Credit Cards</option>
                <option value="other">📦 Other</option>
              </select>
            </div>
            <button onClick={addLiability} className="btn-primary w-full bg-red-500 hover:bg-red-600">Add Liability</button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {liabilities.map(liability => (
              <div key={liability.id} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{liability.name}</div>
                  <div className="text-xs text-slate-500">{liability.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-red-600">{formatCurrency(liability.value)}</span>
                  <button onClick={() => deleteLiability(liability.id)} className="text-red-400 hover:text-red-500">×</button>
                </div>
              </div>
            ))}
            {liabilities.length === 0 && <div className="text-sm text-slate-400 text-center py-4">No liabilities added</div>}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Net Worth:</strong> Your net worth = Total Assets - Total Liabilities. Track this regularly to monitor your financial health and progress toward financial goals.
      </div>
    </div>
  );
}
