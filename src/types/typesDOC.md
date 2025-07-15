src/
└── types/
    ├── api/
    │    ├── apiYoutube.ts
    │    ├── mapbox.ts
    │    └── videos.ts
    ├── filters.ts
    ├── index.ts
    └── typesDOC.md

# EXPICACIÓN
El archivo index es el que exporta todos los archivos de la carpeta /types

# MODO de EXPORTAR ejemplo
//import type { Filters, YouTubeApiResponse, MapboxFeature, Video } from "@/types";

# AVISO! para mejoras si las subcarpetas augmentan
- generar otro indexNombreRelacionado.ts para poder luego exportar al
index.ts CENTRAL 

EJEMPLO 
src/
└── types/
    ├── api/
    │   ├── apiYoutube.ts
    │   ├── mapbox.ts
    │   ├── videos.ts
    │   └── index.ts        <-- Re-exporta todos los archivos api/*.ts
    ├── filters.ts
    ├── index.ts            <-- Re-exporta filters.ts y ./api/index.ts
    └── typesDOC.md
