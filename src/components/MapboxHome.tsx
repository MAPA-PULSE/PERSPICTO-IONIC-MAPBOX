// // src/components/MapboxMapHome.tsx
// import React, { useEffect, useRef } from 'react';
// import mapboxgl from 'mapbox-gl';

// mapboxgl.accessToken = 'TU_MAPBOX_ACCESS_TOKEN';

// const MapboxMapHome: React.FC = () => {
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const mapInstance = useRef<mapboxgl.Map>();

//   useEffect(() => {
//     if (mapContainer.current && !mapInstance.current) {
//       mapInstance.current = new mapboxgl.Map({
//         container: mapContainer.current,
//         style: 'mapbox://styles/mapbox/streets-v11',
//         center: [-74.006, 40.7128], // Ejemplo: NYC
//         zoom: 12,
//         dragPan: true,          // Permite mover el mapa
//         scrollZoom: false,      // Desactiva zoom con scroll
//         doubleClickZoom: false, // Desactiva zoom con doble click
//         touchZoomRotate: false, // Desactiva zoom y rotación con gestos táctiles
//         boxZoom: false,         // Desactiva zoom con caja de selección
//       });
//     }

//     return () => {
//       if (mapInstance.current) {
//         mapInstance.current.remove();
//       }
//     };
//   }, []);

//   return (
//     <div
//       ref={mapContainer}
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         height: '100%',
//         width: '100%',
//         zIndex: 0,
//       }}
//     />
//   );
// };

// export default MapboxMapHome;




// SEGUNDA OPCION 
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoicGVyc3BpY3RvdXNlciIsImEiOiJjbWMzZHhwZjMwNGcwMmlxeHcyeDZvcHV5In0._UopzIHKIkmOWhUEkUMV_A';

const MapboxMapHome: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    // Solo crear el mapa si no está ya creado y existe el contenedor
    if (!mapContainer.current || mapInstance.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/perspictouser/cmc3eah7o00hm01qy1h5jgdvz', // URL mapbox diseñado
      center: [-74.006, 40.7128],
      zoom: 12,
      dragPan: true,
      scrollZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      boxZoom: false,
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        zIndex: 0,
      }}
    />
  );
};

export default MapboxMapHome;