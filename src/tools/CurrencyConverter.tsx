import { useState } from 'react';
import { RefreshCw, ArrowRightLeft } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.50 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.88 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 17.15 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 4.97 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1320.50 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.82 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 10.42 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 10.68 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.65 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.75 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 92.50 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [customRate, setCustomRate] = useState<string>('');

  const fromCurr = CURRENCIES.find(c => c.code === fromCurrency)!;
  const toCurr = CURRENCIES.find(c => c.code === toCurrency)!;

  // Convert through USD as base
  const amountInUSD = amount / fromCurr.rate;
  const rate = customRate ? parseFloat(customRate) : toCurr.rate / fromCurr.rate;
  const convertedAmount = customRate ? amount * parseFloat(customRate) : amountInUSD * toCurr.rate;

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setCustomRate('');
  };

  const formatNumber = (n: number, decimals = 2) => n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const quickAmounts = [1, 10, 100, 1000, 10000];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-blue-500" />
          Currency Converter
        </h2>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="input-field text-2xl font-bold"
          />
          <div className="flex gap-2 mt-2">
            {quickAmounts.map(qa => (
              <button
                key={qa}
                onClick={() => setAmount(qa)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${amount === qa ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                  }`}
              >
                {qa.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Currency Selection */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => { setFromCurrency(e.target.value); setCustomRate(''); }}
              className="input-field"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={swapCurrencies}
            className="mt-6 p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">To</label>
            <select
              value={toCurrency}
              onChange={(e) => { setToCurrency(e.target.value); setCustomRate(''); }}
              className="input-field"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Rate */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Custom Exchange Rate (optional)
          </label>
          <input
            type="number"
            step="any"
            value={customRate}
            onChange={(e) => setCustomRate(e.target.value)}
            placeholder={`Default: ${rate.toFixed(6)}`}
            className="input-field"
          />
        </div>

        {/* Result */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white text-center">
          <div className="text-lg opacity-80 mb-2">
            {fromCurr.symbol}{formatNumber(amount)} {fromCurrency} =
          </div>
          <div className="text-5xl font-bold">
            {toCurr.symbol}{formatNumber(convertedAmount)}
          </div>
          <div className="text-lg opacity-80 mt-2">{toCurrency}</div>
          <div className="mt-4 text-sm opacity-70">
            1 {fromCurrency} = {formatNumber(rate, 6)} {toCurrency}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-6 bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Quick Conversions</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {[1, 10, 100].map(amt => (
              <div key={amt} className="bg-white dark:bg-slate-700 p-2 rounded-lg text-center">
                <div className="text-slate-500">{fromCurr.symbol}{amt} {fromCurrency}</div>
                <div className="font-bold">{toCurr.symbol}{formatNumber(amt * rate)} {toCurrency}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-100">
        <strong>⚠️ Note:</strong> Exchange rates are approximate and for reference only. Actual rates may vary. For real transactions, use current market rates from your bank or exchange service.
      </div>
    </div>
  );
}
