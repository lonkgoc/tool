import { useEffect, useRef } from 'react';

interface AdUnitProps {
  format?: 'rectangle' | 'banner' | 'infeed';
  className?: string;
}

export default function AdUnit({ format = 'rectangle', className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Clear previous content
    adRef.current.innerHTML = '';

    if (format === 'rectangle') {
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

      adRef.current.appendChild(adConfig);
      adRef.current.appendChild(adScript);
    } else if (format === 'banner') {
      const adConfig = document.createElement('script');
      adConfig.type = 'text/javascript';
      adConfig.innerHTML = `
        atOptions = {
          'key' : 'fded2a465dafffa4e5fb94b7592bb766',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      const adScript = document.createElement('script');
      adScript.type = 'text/javascript';
      adScript.src = 'https://www.highperformanceformat.com/fded2a465dafffa4e5fb94b7592bb766/invoke.js';

      adRef.current.appendChild(adConfig);
      adRef.current.appendChild(adScript);
    }
  }, [format]);

  // Dynamic dimensions based on format
  const dimensions = format === 'banner'
    ? 'min-h-[90px] min-w-[728px]'
    : 'min-h-[250px] min-w-[300px]';

  return (
    <div className={`glass rounded-xl p-4 flex justify-center items-center ${className}`}>
      <div
        ref={adRef}
        className={`${dimensions} flex items-center justify-center overflow-hidden`}
      >
        {/* Adsterra Banner */}
      </div>
    </div>
  );
}
