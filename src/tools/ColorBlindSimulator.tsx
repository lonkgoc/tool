import { useState } from 'react';
import { Upload, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

export default function ColorBlindSimulator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('normal');

  const types = [
    { id: 'normal', name: 'Normal Vision', description: 'Standard trichromatic vision' },
    { id: 'protanopia', name: 'Protanopia', description: 'Red-blind (no red cones)' },
    { id: 'protanomaly', name: 'Protanomaly', description: 'Red-weak (mutated red cones)' },
    { id: 'deuteranopia', name: 'Deuteranopia', description: 'Green-blind (no green cones)' },
    { id: 'deuteranomaly', name: 'Deuteranomaly', description: 'Green-weak (mutated green cones)' },
    { id: 'tritanopia', name: 'Tritanopia', description: 'Blue-blind (no blue cones)' },
    { id: 'tritanomaly', name: 'Tritanomaly', description: 'Blue-weak (mutated blue cones)' },
    { id: 'achromatopsia', name: 'Achromatopsia', description: 'Total color blindness (monochromatic)' },
    { id: 'achromatomaly', name: 'Achromatomaly', description: 'Partial color blindness (low saturation)' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setLoading(false);
    }
  };

  // SVG Filters for color blindness simulation
  const Filters = () => (
    <svg className="hidden">
      <defs>
        <filter id="protanopia">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" />
        </filter>
        <filter id="protanomaly">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0.817, 0.183, 0, 0, 0 0.333, 0.667, 0, 0, 0 0, 0.125, 0.875, 0, 0 0, 0, 0, 1, 0" />
        </filter>
        <filter id="deuteranopia">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" />
        </filter>
        <filter id="deuteranomaly">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0.8, 0.2, 0, 0, 0 0.258, 0.742, 0, 0, 0 0, 0.142, 0.858, 0, 0 0, 0, 0, 1, 0" />
        </filter>
        <filter id="tritanopia">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" />
        </filter>
        <filter id="tritanomaly">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0.967, 0.033, 0, 0, 0 0, 0.733, 0.267, 0, 0 0, 0.183, 0.817, 0, 0 0, 0, 0, 1, 0" />
        </filter>
        <filter id="achromatopsia">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0" />
        </filter>
        <filter id="achromatomaly">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0.618, 0.320, 0.062, 0, 0 0.163, 0.775, 0.062, 0, 0 0.163, 0.320, 0.516, 0, 0 0, 0, 0, 1, 0" />
        </filter>
      </defs>
    </svg>
  );

  return (
    <div className="space-y-6">
      <Filters />

      {!imageUrl ? (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 text-center hover:border-blue-500 transition-colors bg-white dark:bg-slate-800">
          <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Upload an Image</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Support for JPG, PNG, WEBP</p>
          <label className="inline-block">
            <span className="btn-primary cursor-pointer">Choose File</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Simulation Type</h3>
              <div className="space-y-2">
                {types.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedType === type.id
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800 border'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    <div className="font-medium">{type.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setImageUrl(null)}
              className="w-full btn-secondary"
            >
              Upload New Image
            </button>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 min-h-[500px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-4 left-4 bg-black/75 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10 font-medium">
                {types.find(t => t.id === selectedType)?.name} Simulation
              </div>

              {/* Comparison toggle could be added here later */}

              <img
                src={imageUrl}
                alt="Simulation Preview"
                className="max-w-full max-h-[600px] object-contain transition-all duration-300"
                style={{
                  filter: selectedType !== 'normal' ? `url(#${selectedType})` : 'none'
                }}
              />

              {selectedType !== 'normal' && (
                <div className="absolute inset-0 pointer-events-none border-[6px] border-blue-500/0 transition-colors" />
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">About {types.find(t => t.id === selectedType)?.name}</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  {types.find(t => t.id === selectedType)?.description}.
                  {/* Add more educational text later if needed */}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
