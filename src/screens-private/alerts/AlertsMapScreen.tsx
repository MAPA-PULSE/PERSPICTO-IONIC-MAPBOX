/*
YouTubeSearchFilters
MapWithAlerts
 */
import React, { Suspense } from "react";
import { useSearchAlerts } from "@/features-modular/search/hooks/useSearchAlerts";
import { YouTubeSearchFilters } from "@/features-modular/search/components/YouTubeSearchFilters";
const MapWithAlerts = React.lazy(() => import("@/features-modular/mapbox/component/MapWithAlerts"));

export default function AlertsMapScreen() {
  const { alerts, loading, onFilterChange } = useSearchAlerts();

  return (
    <>
      <YouTubeSearchFilters onChange={onFilterChange} />
      <Suspense fallback={<div>Cargando mapa...</div>}>
        <MapWithAlerts alerts={alerts} loading={loading} />
      </Suspense>
    </>
  );
}
