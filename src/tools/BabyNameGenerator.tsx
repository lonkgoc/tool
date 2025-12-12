import { useState } from 'react';

export default function BabyNameGenerator() {
  const [gender, setGender] = useState<'boy' | 'girl' | 'unisex'>('unisex');
  const [origin, setOrigin] = useState<'any' | 'english' | 'spanish' | 'french' | 'japanese'>('any');

  const names: Record<string, Record<string, string[]>> = {
    boy: {
      english: ['James', 'Benjamin', 'Alexander', 'Michael', 'William', 'David', 'Oliver', 'Liam', 'Noah', 'Elijah'],
      spanish: ['Carlos', 'Miguel', 'Diego', 'Juan', 'Ricardo', 'Fernando', 'Santiago', 'Luis', 'Antonio', 'Javier'],
      french: ['Pierre', 'Laurent', 'Jean', 'Marc', 'Philippe', 'Francois', 'Andre', 'Georges', 'Luc', 'Pierre'],
      japanese: ['Hiroshi', 'Takeshi', 'Kenji', 'Haruto', 'Yuki', 'Riku', 'Kazuki', 'Masaru', 'Noboru', 'Jiro'],
      any: ['James', 'Benjamin', 'Alexander', 'Carlos', 'Miguel', 'Pierre', 'Hiroshi', 'Takeshi', 'Kenji', 'Haruto'],
    },
    girl: {
      english: ['Emma', 'Olivia', 'Sophie', 'Charlotte', 'Grace', 'Amelia', 'Sophia', 'Isabella', 'Mia', 'Harper'],
      spanish: ['Maria', 'Carmen', 'Rosa', 'Isabel', 'Lucia', 'Catalina', 'Alejandra', 'Valentina', 'Sofia', 'Ana'],
      french: ['Marie', 'Sophie', 'Isabelle', 'Nicole', 'Francoise', 'Claire', 'Beatrice', 'Camille', 'Gabrielle', 'Yvette'],
      japanese: ['Yuki', 'Sakura', 'Aiko', 'Hana', 'Midori', 'Tomoe', 'Akiko', 'Chie', 'Emiko', 'Fumiko'],
      any: ['Emma', 'Olivia', 'Sophie', 'Maria', 'Carmen', 'Marie', 'Yuki', 'Sakura', 'Aiko', 'Hana'],
    },
    unisex: {
      english: ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Parker', 'Cameron'],
      spanish: ['Angel', 'Guadalupe', 'Ariel', 'Cruz', 'Sage', 'River', 'Phoenix', 'Skyler', 'Reese', 'Rowan'],
      french: ['Claude', 'Dominique', 'Val', 'Rene', 'Alexis', 'Camille', 'Casey', 'Sage', 'River', 'Phoenix'],
      japanese: ['Akira', 'Haruka', 'Kaito', 'Ren', 'Nao', 'Tomo', 'Kei', 'Sora', 'Haru', 'Natsuki'],
      any: ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Angel', 'Claude', 'Akira', 'Haruka', 'Kaito'],
    },
  };

  const getRandomNames = () => {
    const nameList = names[gender][origin];
    return nameList.sort(() => Math.random() - 0.5).slice(0, 5);
  };

  const [suggestions, setSuggestions] = useState(getRandomNames());

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Baby Name Generator</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <label>
          Gender
          <select value={gender} onChange={e => {setGender(e.target.value as any); setSuggestions(getRandomNames());}} className="input-field">
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
            <option value="unisex">Unisex</option>
          </select>
        </label>
        <label>
          Origin
          <select value={origin} onChange={e => {setOrigin(e.target.value as any); setSuggestions(getRandomNames());}} className="input-field">
            <option value="any">Any Origin</option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="japanese">Japanese</option>
          </select>
        </label>
      </div>

      <button onClick={() => setSuggestions(getRandomNames())} className="btn-primary w-full">Generate More Names</button>

      <div className="grid grid-cols-1 gap-3">
        {suggestions.map((name, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex justify-between items-center">
            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{name}</div>
              <div className="text-xs text-slate-500 capitalize">{origin === 'any' ? 'Multi-origin' : origin}</div>
            </div>
            <button className="btn-secondary text-sm">♥️ Save</button>
          </div>
        ))}
      </div>
    </div>
  );
}
