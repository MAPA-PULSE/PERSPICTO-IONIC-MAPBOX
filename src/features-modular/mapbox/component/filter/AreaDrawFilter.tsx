import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const AreaDrawFilter: React.FC<{
  mapInstanceRef: React.MutableRefObject<mapboxgl.Map | null>;
}> = ({ mapInstanceRef }) => {
  const draw = useRef<MapboxDraw | null>(null);

  const handleDraw = () => {
    const map = mapInstanceRef.current;
    if (!map || !draw.current) return;

    const data = draw.current.getAll();
    console.log('Polígonos dibujados:', data);
  };

  const startDrawing = () => {
    if (draw.current) {
      draw.current.changeMode('draw_polygon');
    }
  };

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const initDraw = () => {
      if (!draw.current) {
        draw.current = new MapboxDraw({
          displayControlsDefault: false,
          controls: { polygon: true, trash: true },
        });

        map.addControl(draw.current, 'top-left');
        map.on('draw.create', handleDraw);
        map.on('draw.update', handleDraw);
      }
    };

    if (map.loaded()) {
      initDraw();
    } else {
      map.on('load', initDraw);
    }

    return () => {
      if (map && draw.current) {
        map.off('draw.create', handleDraw);
        map.off('draw.update', handleDraw);
      }
    };
  }, [mapInstanceRef]);

  return (
    <div style={{ position: 'absolute', top: '10vh', left: '4vw', zIndex: 70 }}>
      <button onClick={startDrawing}>Dibujar perímetro</button>
    </div>
  );
};

export default AreaDrawFilter;
