//PERSPICTO-IONIC-MAPBOX\src\features-modular\mapbox\component\MapErrorBoundary.tsx
import { MapErrorBoundary } from './MapErrorBoundary';
import MapboxMap from './MapboxMap';

const MapView = () => {
  const handleMapLoad = (map: mapboxgl.Map) => {
    // cualquier lógica adicional al cargar
  };

  return (
    <MapErrorBoundary>
      <MapboxMap onMapLoad={handleMapLoad} />
    </MapErrorBoundary>
  );
};

export default MapView;
