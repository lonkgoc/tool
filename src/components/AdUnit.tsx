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

    const width = format === 'banner' ? 728 : 300;
    const height = format === 'banner' ? 90 : 250;
    const key = format === 'banner' ? 'fded2a465dafffa4e5fb94b7592bb766' : '18a9fd4005f0eb2763390b007dd5612f';

    const iframe = document.createElement('iframe');
    iframe.width = width.toString();
    iframe.height = height.toString();
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';

    adRef.current.appendChild(iframe);

    // Write the ad script into the iframe to isolate the `atOptions` context
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '${key}',
                'format' : 'iframe',
                'height' : ${height},
                'width' : ${width},
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
          </body>
        </html>
      `);
      doc.close();
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
        {/* Adsterra Banner (Iframe Isolated) */}
      </div>
    </div>
  );
}
