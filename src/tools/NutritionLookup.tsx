import { useState } from 'react';

export default function NutritionLookup() {
  const [food, setFood] = useState('');
  const [serving, setServing] = useState(100);
  const [unit, setUnit] = useState<'g' | 'oz' | 'cup'>('g');

  const nutritionData: Record<string, Record<string, number>> = {
    'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    'brown rice': { calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
    'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
    'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    'salmon': { calories: 208, protein: 20, carbs: 0, fat: 13 },
    'almonds': { calories: 579, protein: 21, carbs: 22, fat: 50 },
    'olive oil': { calories: 884, protein: 0, carbs: 0, fat: 100 },
  };

  const foodKey = food.toLowerCase();
  const data = nutritionData[foodKey];

  const unitConversion: Record<string, number> = { g: 1, oz: 28.35, cup: 240 };
  const grams = serving * unitConversion[unit];
  const multiplier = grams / 100;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Nutrition Lookup</h2>
      
      <div className="space-y-3">
        <label>
          Food Item
          <input 
            type="text" 
            value={food} 
            onChange={e => setFood(e.target.value)} 
            placeholder="e.g., chicken breast, banana" 
            className="input-field" 
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label>
            Serving Size
            <input type="number" value={serving} onChange={e => setServing(parseFloat(e.target.value) || 0)} className="input-field" />
          </label>
          <label>
            Unit
            <select value={unit} onChange={e => setUnit(e.target.value as any)} className="input-field">
              <option value="g">grams</option>
              <option value="oz">ounces</option>
              <option value="cup">cups</option>
            </select>
          </label>
        </div>
      </div>

      {data ? (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 p-4 rounded-lg">
            <div className="text-sm text-slate-600 dark:text-slate-300">Calories</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{(data.calories * multiplier).toFixed(0)} kcal</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="text-xs text-slate-500">Protein</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{(data.protein * multiplier).toFixed(1)}g</div>
              <div className="text-xs text-slate-500">{((data.protein * multiplier * 4 / (data.calories * multiplier)) * 100).toFixed(0)}%</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="text-xs text-slate-500">Carbs</div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{(data.carbs * multiplier).toFixed(1)}g</div>
              <div className="text-xs text-slate-500">{((data.carbs * multiplier * 4 / (data.calories * multiplier)) * 100).toFixed(0)}%</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="text-xs text-slate-500">Fat</div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{(data.fat * multiplier).toFixed(1)}g</div>
              <div className="text-xs text-slate-500">{((data.fat * multiplier * 9 / (data.calories * multiplier)) * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          {food ? 'Food not found in database' : 'Enter a food to lookup nutrition facts'}
        </div>
      )}

      <div className="text-xs text-slate-500 text-center">
        Database includes common foods. For comprehensive nutrition data, use USDA FoodData or similar resources.
      </div>
    </div>
  );
}
