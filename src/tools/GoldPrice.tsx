import { useState } from 'react';
import { Coins, TrendingUp, TrendingDown, Scale, Calculator } from 'lucide-react';

export default function GoldPrice() {
  const [pricePerOunce, setPricePerOunce] = useState<number>(2000);
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<'oz' | 'g' | 'kg'>('oz');
  const [buyPrice, setBuyPrice] = useState<number>(1800);
  const [karat, setKarat] = useState<number>(24);

  // Conversion factors to troy ounces
  const toOunce: Record<string, number> = {
    'oz': 1,
    'g': 0.03215,  // 1 gram = 0.03215 troy oz
    'kg': 32.15,   // 1 kg = 32.15 troy oz
  };

  const unitLabels: Record<string, string> = {
    'oz': 'Troy Ounces',
    'g': 'Grams',
    'kg': 'Kilograms',
  };

  // Calculate values
  const quantityInOunces = quantity * toOunce[unit];
  const purityFactor = karat / 24;
  const totalValue = pricePerOunce * quantityInOunces * purityFactor;
  const investmentCost = buyPrice * quantityInOunces * purityFactor;
  const profitLoss = totalValue - investmentCost;
  const profitPercent = investmentCost > 0 ? ((profitLoss / investmentCost) * 100) : 0;

  const pricePerGram = pricePerOunce / 31.1035;
  const pricePerKg = pricePerGram * 1000;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Coins className="w-6 h-6 text-yellow-500" />
          Gold Price Calculator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Price */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-700 dark:text-slate-300">Current Market Price</h3>
            <div>
              <label className="block text-sm mb-1">Price per Troy Ounce ($)</label>
              <input
                type="number"
                value={pricePerOunce}
                onChange={(e) => setPricePerOunce(Number(e.target.value) || 0)}
                className="input-field"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="text-xs text-slate-500">Per Gram</div>
                <div className="font-semibold">${pricePerGram.toFixed(2)}</div>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="text-xs text-slate-500">Per Oz</div>
                <div className="font-semibold">${pricePerOunce.toFixed(2)}</div>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="text-xs text-slate-500">Per Kg</div>
                <div className="font-semibold">${pricePerKg.toFixed(0)}</div>
              </div>
            </div>
          </div>

          {/* Your Holdings */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-700 dark:text-slate-300">Your Holdings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  className="input-field"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="input-field"
                >
                  <option value="oz">Troy Ounces</option>
                  <option value="g">Grams</option>
                  <option value="kg">Kilograms</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Karat (Purity)</label>
              <select
                value={karat}
                onChange={(e) => setKarat(Number(e.target.value))}
                className="input-field"
              >
                <option value={24}>24K (99.9% Pure)</option>
                <option value={22}>22K (91.7%)</option>
                <option value={18}>18K (75.0%)</option>
                <option value={14}>14K (58.3%)</option>
                <option value={10}>10K (41.7%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Purchase Price per Oz ($)</label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value) || 0)}
                className="input-field"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <Scale className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <div className="text-sm text-slate-600 dark:text-slate-400">Current Value</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {quantity} {unitLabels[unit]} @ {karat}K
          </div>
        </div>

        <div className="card text-center">
          <Calculator className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-sm text-slate-600 dark:text-slate-400">Investment Cost</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            ${investmentCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            At ${buyPrice}/oz purchase price
          </div>
        </div>

        <div className="card text-center">
          {profitLoss >= 0 ? (
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
          ) : (
            <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-500" />
          )}
          <div className="text-sm text-slate-600 dark:text-slate-400">Profit/Loss</div>
          <div className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profitLoss >= 0 ? '+' : ''}${profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="card">
        <h3 className="font-semibold mb-3">Gold Purity Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          {[
            { k: 24, purity: '99.9%', use: 'Investment' },
            { k: 22, purity: '91.7%', use: 'Jewelry (India)' },
            { k: 18, purity: '75.0%', use: 'Fine Jewelry' },
            { k: 14, purity: '58.3%', use: 'Everyday Jewelry' },
            { k: 10, purity: '41.7%', use: 'Budget Jewelry' },
          ].map(item => (
            <div key={item.k} className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-center">
              <div className="font-bold text-yellow-600">{item.k}K</div>
              <div className="text-slate-600 dark:text-slate-400">{item.purity}</div>
              <div className="text-xs text-slate-500">{item.use}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
        <p className="font-medium mb-2">Note:</p>
        <p>Enter the current gold spot price manually. Prices fluctuate throughout the day. Check financial websites for real-time pricing.</p>
      </div>
    </div>
  );
}
