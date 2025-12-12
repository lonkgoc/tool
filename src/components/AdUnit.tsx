import { useEffect, useRef } from 'react';

interface AdUnitProps {
  format?: 'rectangle' | 'banner' | 'infeed';
  className?: string;
}

export default function AdUnit({ format = 'rectangle', className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  const adStyles = {
    rectangle: 'min-h-[250px] min-w-[300px]',
    banner: 'min-h-[90px] w-full',
    infeed: 'min-h-[200px] w-full',
  };

  return (
    <div className={`glass rounded-xl p-4 ${className}`}>
      <div
        ref={adRef}
        className={`${adStyles[format]} flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm`}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={format === 'rectangle' ? '1234567890' : format === 'banner' ? '0987654321' : '1122334455'}
          data-ad-format={format === 'rectangle' ? 'auto' : format === 'banner' ? 'horizontal' : 'fluid'}
          data-full-width-responsive="true"
        />
        {/* Placeholder for development */}
        <div className="text-center">
          <div className="text-xs mb-2">Ad Space</div>
          <div className="text-xs opacity-50">{format === 'rectangle' ? '300x250' : format === 'banner' ? '728x90' : 'In-feed'}</div>
        </div>
      </div>
    </div>
  );
}

