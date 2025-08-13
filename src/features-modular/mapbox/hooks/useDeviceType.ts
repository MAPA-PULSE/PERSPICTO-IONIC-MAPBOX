//PERSPICTO-IONIC-MAPBOX\src\features-modular\mapbox\hooks\useDeviceType.ts
import { useEffect, useState } from 'react';

export const useDeviceType = () => {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
      setDeviceType(
        window.innerWidth < 768 ? 'mobile' :
        window.innerWidth < 1024 ? 'tablet' :
        'desktop'
      );
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // inicial

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isLandscape, deviceType };
};
