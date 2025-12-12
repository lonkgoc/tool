import { useState } from 'react';
import { Smartphone, Tablet, Monitor, Info } from 'lucide-react';

export default function ResponsiveTester() {
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState(375);
  const [height, setHeight] = useState(667);
  const [device, setDevice] = useState('iPhone SE');

  const devices = [
    { name: 'iPhone SE', width: 375, height: 667, icon: Smartphone },
    { name: 'iPhone 12/13', width: 390, height: 844, icon: Smartphone },
    { name: 'iPad Mini', width: 768, height: 1024, icon: Tablet },
    { name: 'iPad Pro', width: 1024, height: 1366, icon: Tablet },
    { name: 'Laptop', width: 1366, height: 768, icon: Monitor },
    { name: 'Desktop', width: 1920, height: 1080, icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {devices.map((d) => (
              <button
                key={d.name}
                onClick={() => { setWidth(d.width); setHeight(d.height); setDevice(d.name); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${device === d.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                <d.icon className="w-4 h-4" />
                {d.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm font-mono text-slate-500 whitespace-nowrap border-l border-slate-200 dark:border-slate-600 pl-4">
            <span>{width}px</span>
            <span>×</span>
            <span>{height}px</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="url"
            placeholder="Enter website URL (note: many sites block iframes)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 input-field"
          />
        </div>

        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-4 h-4" />
          Note: Many major websites (Google, Facebook, etc.) block being embedded in iframes due to security policies (X-Frame-Options).
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8 overflow-auto flex justify-center items-start min-h-[600px]">
        <div
          className="bg-white shadow-2xl transition-all duration-300 relative border-8 border-slate-800 rounded-[2rem] overflow-hidden"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            minWidth: `${width}px`, // prevent shrinking
            maxWidth: '100%'
          }}
        >
          {/* Notch/Camera for mobile feel */}
          {width < 500 && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-10"></div>
          )}

          {url ? (
            <iframe
              src={url}
              className="w-full h-full border-0 bg-white"
              title="Responsive Preview"
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white dark:bg-slate-800">
              <Monitor className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">No URL Loaded</p>
              <p className="text-sm mt-2">Enter a URL above to test responsiveness</p>
              <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm max-w-sm">
                <p className="font-semibold mb-2">Current Viewport:</p>
                <p className="font-mono text-blue-600 dark:text-blue-400 text-xl">{width} × {height}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
