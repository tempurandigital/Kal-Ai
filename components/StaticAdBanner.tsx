import React, { useEffect, useRef } from 'react';

const StaticAdBanner: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adContainerRef.current;
    if (container && container.childElementCount === 0) {
      // Clear previous ads if any, for safety
      container.innerHTML = '';
      
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

  return (
    <div 
      ref={adContainerRef} 
      className="fixed bottom-[56px] left-0 right-0 flex justify-center items-center h-[50px] bg-gray-100 dark:bg-gray-800 z-10"
      style={{ minWidth: '320px', minHeight: '50px' }} // Ensure space for the ad
    >
      {/* Ad script will inject content here */}
    </div>
  );
};

export default StaticAdBanner;
