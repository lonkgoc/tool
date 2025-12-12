import { useState } from 'react';

export default function RecipeCalories() {
  const [ingredients, setIngredients] = useState<{id: string; name: string; amount: number; unit: string; caloriesPer100: number}[]>([]);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState(0);
  const [newUnit, setNewUnit] = useState('g');
  const [newCal, setNewCal] = useState(0);

  const addIngredient = () => {
    if (!newName.trim() || newAmount <= 0) return;
    setIngredients([...ingredients, { id: Date.now().toString(), name: newName, amount: newAmount, unit: newUnit, caloriesPer100: newCal }]);
    setNewName('');
    setNewAmount(0);
    setNewCal(0);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const unitConv: Record<string, number> = { g: 1, oz: 28.35, cup: 240, tbsp: 15, tsp: 5 };
  const totalCalories = ingredients.reduce((sum, i) => sum + ((i.caloriesPer100 / 100) * i.amount * unitConv[i.unit]), 0);
  const servings = ingredients.length > 0 ? 4 : 1;
  const caloriesPerServing = totalCalories / servings;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recipe Calorie Calculator</h2>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
        <div className="text-sm font-medium">Add Ingredients</div>
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ingredient name" className="input-field" />
        <div className="grid grid-cols-3 gap-3">
          <input type="number" value={newAmount} onChange={e => setNewAmount(parseFloat(e.target.value) || 0)} placeholder="Amount" className="input-field" />
          <select value={newUnit} onChange={e => setNewUnit(e.target.value)} className="input-field">
            <option value="g">grams</option>
            <option value="oz">oz</option>
            <option value="cup">cup</option>
            <option value="tbsp">tbsp</option>
            <option value="tsp">tsp</option>
          </select>
          <input type="number" value={newCal} onChange={e => setNewCal(parseFloat(e.target.value) || 0)} placeholder="Cal/100g" className="input-field" />
        </div>
        <button onClick={addIngredient} className="btn-primary w-full">Add Ingredient</button>
      </div>

      {ingredients.length > 0 && (
        <>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 p-4 rounded-lg">
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Total Recipe Calories</div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{totalCalories.toFixed(0)} kcal</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">~{caloriesPerServing.toFixed(0)} kcal per serving ({servings} servings)</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className="max-h-64 overflow-y-auto space-y-2 p-4">
              {ingredients.map(i => {
                const cal = (i.caloriesPer100 / 100) * i.amount * unitConv[i.unit];
                return (
                  <div key={i.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded text-sm">
                    <div>
                      <div className="font-medium">{i.name}</div>
                      <div className="text-xs text-slate-500">{i.amount} {i.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{cal.toFixed(0)} cal</div>
                      <button onClick={() => removeIngredient(i.id)} className="text-red-500 text-xs hover:underline">Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
