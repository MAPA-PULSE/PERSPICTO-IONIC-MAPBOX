import { useEffect } from 'react';

const useLayerToggle = (
  mapInstanceRef: React.MutableRefObject<mapboxgl.Map | null>,
  layerVisibility: { wind: boolean; clouds: boolean; earthquake: boolean }
) => {
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const toggle = (id: string, visible: boolean) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
      }
    };

    toggle('wind-layer', layerVisibility.wind);
    toggle('clouds-layer', layerVisibility.clouds);
    toggle('earthquake-heat', layerVisibility.earthquake);
    toggle('earthquake-points', layerVisibility.earthquake);
  }, [layerVisibility]);
};

export default useLayerToggle;
