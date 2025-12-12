import { useState } from 'react';

export default function HouseAffordability(){
  const [annualIncome, setAnnualIncome] = useState<number>(80000);
  const [multiplier, setMultiplier] = useState<number>(4);
  const maxPrice = annualIncome * multiplier;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">House Affordability</h2>
      <label>Annual Income ($)
        <input className="input-field" value={annualIncome} onChange={e=>setAnnualIncome(parseFloat(e.target.value)||0)} />
      </label>
      <label>Multiplier (e.g., 3-5x)
        <input className="input-field" value={multiplier} onChange={e=>setMultiplier(parseFloat(e.target.value)||0)} />
      </label>
      <div className="p-4 bg-white dark:bg-slate-900 rounded-md">Estimated max house price: ${maxPrice.toFixed(2)}</div>
    </div>
  );
}
