/*
Renderiza un mapa de Mapbox con:
Marcadores de videos (ubicación aproximada)
Tooltip con el título o preview del video
Opcional: colores por categoría

               QUE HACE?
                Recibe alertas con lat/lon
                Renderiza en Mapbox
                Soporta clustering (opcional)
                Virtualización no necesaria aún: solo si hay >200 puntos visibles


*/

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Alert } from "@/types";



mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

interface Props {
  alerts: Alert[];
  loading?: boolean;
}

const MapWithAlerts: React.FC<Props> = ({ alerts, loading }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-99.13, 19.43], // Default CDMX
      zoom: 4,
    });
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !alerts.length) return;

    alerts.forEach((alert) => {
      new mapboxgl.Marker()
        .setLngLat([alert.longitude, alert.latitude])
        .setPopup(new mapboxgl.Popup().setText(alert.title))
        .addTo(mapInstance.current!);
    });
  }, [alerts]);

  return (
    <div>
      {loading && <p>Cargando alertas...</p>}
      <div ref={mapRef} style={{ width: "100%", height: "80vh" }} />
    </div>
  );
};

export default MapWithAlerts;
