import { useState } from 'react';

export default function BmiBmrTdee() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('1.2');

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // Convert cm to meters
    const w = parseFloat(weight);
    if (h && w) return (w / (h * h)).toFixed(1);
    return null;
  };

  const calculateBMR = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (a && h && w) {
      if (gender === 'male') {
        return Math.round(10 * w + 6.25 * h - 5 * a + 5);
      } else {
        return Math.round(10 * w + 6.25 * h - 5 * a - 161);
      }
    }
    return null;
  };

  const calculateTDEE = () => {
    const bmr = calculateBMR();
    if (bmr) {
      return Math.round(bmr * parseFloat(activity));
    }
    return null;
  };

  const bmi = calculateBMI();
  const bmr = calculateBMR();
  const tdee = calculateTDEE();

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-500' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-500' };
    return { text: 'Obese', color: 'text-red-500' };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Age
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Years"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input-field"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="cm"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="kg"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Activity Level
        </label>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="input-field"
        >
          <option value="1.2">Sedentary (little or no exercise)</option>
          <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
          <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
          <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
          <option value="1.9">Extra active (very hard exercise, physical job)</option>
        </select>
      </div>

      {(bmi || bmr || tdee) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bmi && (
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {bmi}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">BMI</div>
              <div className={`text-sm font-semibold ${getBMICategory(parseFloat(bmi)).color}`}>
                {getBMICategory(parseFloat(bmi)).text}
              </div>
            </div>
          )}
          {bmr && (
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {bmr}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">BMR (kcal/day)</div>
            </div>
          )}
          {tdee && (
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {tdee}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">TDEE (kcal/day)</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

