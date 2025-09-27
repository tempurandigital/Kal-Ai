
import React, { useEffect, useRef } from 'react';

const NativeAd: React.FC<{ adKey: string }> = ({ adKey }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adContainerRef.current;
    if (container) {
      container.innerHTML = '';
      
      const adSlot = document.createElement('div');
      adSlot.id = 'container-2552b41e7c80bf2381f9fe9eec96fde7';
      
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = '//pl27598848.revenuecpmgate.com/2552b41e7c80bf2381f9fe9eec96fde7/invoke.js';
      
      container.appendChild(adSlot);
      container.appendChild(script);
    }
  // The adKey dependency is crucial. It ensures that when a new ad needs to be shown,
  // this effect re-runs, clears the old ad, and injects the new script.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adKey]);

  return <div ref={adContainerRef} key={adKey} className="flex justify-center my-4"></div>;
};

export default NativeAd;
