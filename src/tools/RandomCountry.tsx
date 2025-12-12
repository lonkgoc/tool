import { useState } from 'react';
import { Globe, Shuffle } from 'lucide-react';

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium',
  'Brazil', 'Canada', 'Chile', 'China', 'Colombia', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany',
  'Greece', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Kenya',
  'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa',
  'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom',
  'United States', 'Vietnam'
];

export default function RandomCountry() {
  const [country, setCountry] = useState<string | null>(null);
  const [previousCountries, setPreviousCountries] = useState<string[]>([]);

  const pickRandom = () => {
    const available = countries.filter(c => !previousCountries.includes(c) || previousCountries.length >= countries.length);
    const random = available[Math.floor(Math.random() * available.length)];
    setCountry(random);
    setPreviousCountries([...previousCountries, random].slice(-10));
  };

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center justify-center space-x-2">
          <Globe className="w-6 h-6" />
          <span>Random Country Picker</span>
        </h2>

        <button
          onClick={pickRandom}
          className="btn-primary w-full flex items-center justify-center space-x-2 mb-6"
        >
          <Shuffle className="w-5 h-5" />
          <span>Pick Random Country</span>
        </button>

        {country && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
            <div className="text-6xl mb-4">🌍</div>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{country}</div>
          </div>
        )}

        {previousCountries.length > 0 && (
          <div className="mt-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Recent picks:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {previousCountries.slice().reverse().map((c, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    c === country
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


