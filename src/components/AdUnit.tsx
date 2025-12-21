import { useEffect, useRef } from 'react';

interface AdUnitProps {
  format?: 'rectangle' | 'banner' | 'infeed';
  className?: string;
}

export default function AdUnit({ format = 'rectangle', className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && format === 'rectangle') {
      // Clear previous content
      adRef.current.innerHTML = '';

      const adConfig = document.createElement('script');
      adConfig.type = 'text/javascript';
      adConfig.innerHTML = `
        atOptions = {
          'key' : '18a9fd4005f0eb2763390b007dd5612f',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;

      const adScript = document.createElement('script');
      adScript.type = 'text/javascript';
      adScript.src = 'https://www.highperformanceformat.com/18a9fd4005f0eb2763390b007dd5612f/invoke.js';

      // Adsterra scripts often use document.write which doesn't work well after page load in React.
      // However, the invoke.js usually looks for the script tag that included it or checks atOptions.
      // Standard way to embed such third-party scripts in React is creating the element.
      // NOTE: 'invoke.js' often writes an iframe. Secure iframe options might be needed or it appends to current location.

      adRef.current.appendChild(adConfig);
      adRef.current.appendChild(adScript);
    }
  }, [format]);

  return (
    <div className={`glass rounded-xl p-4 flex justify-center items-center ${className}`}>
      <div
        ref={adRef}
        className="min-h-[250px] min-w-[300px] flex items-center justify-center overflow-hidden"
      >
        {/* Adsterra Banner (300x250) */}
      </div>
    </div>
  );
}

