
import React, { useEffect, useRef } from 'react';

const AdBanner: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adContainerRef.current;
    if (container && container.childElementCount === 0) {
      const script1 = document.createElement('script');
      script1.type = 'text/javascript';
      script1.innerHTML = `
        atOptions = {
          'key' : '2b9e2a38c59ea25a2dac48054f0e75f4',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      
      const script2 = document.createElement('script');
      script2.type = 'text/javascript';
      script2.src = '//www.highperformanceformat.com/2b9e2a38c59ea25a2dac48054f0e75f4/invoke.js';
      script2.async = true;

      container.appendChild(script1);
      container.appendChild(script2);
    }
  }, []);

  return <div ref={adContainerRef} className="flex justify-center items-center h-[50px] w-full bg-gray-100 dark:bg-gray-800"></div>;
};

export default AdBanner;
