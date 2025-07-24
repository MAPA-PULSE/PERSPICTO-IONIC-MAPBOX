

src/
└── features‑modular/
    └── mapbox/
        ├── components/         ← vista UI del mapa
        │   └── MapboxMap.tsx   ← render del mapa + lógica
        ├── styles/             ← rutas y assets de estilo/íconos
        │   ├── marker-icon.png
        │   └── custom-style.json
        ├── hooks/
        │   └── useMapbox.ts
        ├── services/           ← lógica de datos/clustering
        │   └── mapService.ts
        └── MapboxConfig.tsx    ← config global del mapa
