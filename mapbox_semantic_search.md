# 🗺️ Uso de Mapbox GL JS con Búsquedas Semánticas

Este documento explica cómo actualizar dinámicamente un punto en un mapa de Mapbox GL JS usando búsquedas semánticas (como "hospital más cercano en Barcelona"). No se almacenan trayectorias, solo se muestra la ubicación más reciente obtenida mediante geocodificación.

---

## 🧠 Conceptos Clave

- **Fuente (`source`)**: contiene los datos geoespaciales (puntos, líneas, polígonos).
- **Capa (`layer`)**: define cómo se visualizan esos datos.
- **GeoJSON**: formato de datos utilizado para representar la geometría del punto.
- **Geocodificación**: conversión de texto (como una dirección o nombre de lugar) en coordenadas (latitud, longitud).

---

## ✅ Flujo de Trabajo

1. Crear una fuente `geojson` con un punto inicial.
2. Crear una capa que visualice ese punto.
3. Realizar una búsqueda semántica y obtener nuevas coordenadas.
4. Actualizar la fuente con las nuevas coordenadas.
5. El mapa actualiza automáticamente el punto.

---

## 🛠 Paso a Paso

### Paso 1: Crear la fuente GeoJSON

```js
map.addSource(`object-source-${object.id}`, {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0], // Coordenadas iniciales
        },
        properties: {
          name: object.name,
        },
      },
    ],
  },
});
```

---

### Paso 2: Crear la capa asociada

```js
map.addLayer({
  id: `object-layer-${object.id}`,
  type: 'circle',
  source: `object-source-${object.id}`,
  paint: {
    'circle-radius': 8,
    'circle-color': '#007cbf',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff',
  },
});
```

---

### Paso 3: Función de búsqueda semántica y actualización

```js
function updateObjectBySemanticSearch(object, query) {
  const accessToken = 'YOUR_MAPBOX_TOKEN'; // No olvides proteger este token

  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}`)
    .then(res => res.json())
    .then(data => {
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        object.coordinates = [lng, lat];

        const updatedFeature = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: object.coordinates,
              },
              properties: {
                name: object.name,
              },
            },
          ],
        };

        const source = map.getSource(`object-source-${object.id}`);
        if (source) {
          source.setData(updatedFeature);
        }
      } else {
        console.warn('No se encontraron resultados para la búsqueda:', query);
      }
    })
    .catch(err => console.error('Error en la búsqueda semántica:', err));
}
```

---

### Paso 4: Uso

```js
const myObject = {
  id: 'marker1',
  name: 'Mi ubicación dinámica',
  coordinates: [0, 0],
};

updateObjectBySemanticSearch(myObject, 'hospital más cercano en Barcelona');
```

---

## 🔍 Consideraciones Adicionales

- No es necesario eliminar ni recrear capas, solo se actualiza la fuente.
- Puedes usar `symbol` en vez de `circle` para íconos personalizados.
- Usa `map.flyTo({ center: [lng, lat] })` si deseas centrar el mapa en la nueva ubicación.

---

## 🔐 Seguridad

- **Nunca expongas tu token de Mapbox** en el frontend sin protección. Usa un proxy o verificación si es necesario.

---

## ✅ Resultado Final

Un único marcador en el mapa, actualizado dinámicamente con base en una búsqueda textual. No se muestra historial ni trayectoria, solo la ubicación actual.

