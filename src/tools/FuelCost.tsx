import { useState } from 'react';

export default function FuelCost(){
  const [miles, setMiles] = useState<number>(100);
  const [mpg, setMpg] = useState<number>(25);
  const [pricePerGallon, setPricePerGallon] = useState<number>(3.5);

  const gallons = mpg>0 ? miles/mpg : 0;
  const cost = gallons * pricePerGallon;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Fuel Cost</h2>
      <label>Miles
        <input className="input-field" value={miles} onChange={e=>setMiles(parseFloat(e.target.value)||0)} />
      </label>
      <label>MPG
        <input className="input-field" value={mpg} onChange={e=>setMpg(parseFloat(e.target.value)||0)} />
      </label>
      <label>Price per gallon ($)
        <input className="input-field" value={pricePerGallon} onChange={e=>setPricePerGallon(parseFloat(e.target.value)||0)} />
      </label>
      <div className="p-4 bg-white dark:bg-slate-900 rounded-md">Estimated Fuel Cost: ${cost.toFixed(2)}</div>
    </div>
  );
}
