// src/types/filters.ts

/**
 * Representa el rango de fechas utilizado en los filtros.
 * Usamos string para compatibilidad con inputs tipo date y formato ISO (YYYY-MM-DD).
 */
export interface DateRange {
  from: string; // Fecha inicial
  to: string;   // Fecha final
}

/**
 * Opciones válidas para filtrar la duración de los videos.
 * Corresponden a los valores esperados por la API de YouTube.
 */
export type VideoDuration = "any" | "short" | "medium" | "long"; 
// short <4min, medium 4–20min, long >20min

/**
 * Opciones de ordenamiento.
 * Muy común en APIs como YouTube, Reddit, etc.
 */
export type SortOrder = "relevance" | "date" | "rating" | "viewCount";

/**
 * Categorías opcionales si tu aplicación las ofrece (ej. noticias, música, etc.).
 * Podrías usar un enum si son fijas o cargarlas dinámicamente si vienen de la API.
 */
export type VideoCategory = string; // También podrías usar un enum si es cerrado

/**
 * Interfaz principal de filtros aplicables a búsquedas.
 * ⚠️ Si modificás esta interfaz, asegurate de sincronizar los formularios y servicios relacionados.
 */
export interface Filters {
  query: string;                  // Texto de búsqueda (obligatorio)
  category?: VideoCategory;       // Categoría temática (opcional)
  dateRange?: DateRange;          // Rango de fechas (opcional)
  duration?: VideoDuration;       // Duración del video (opcional)
  order?: SortOrder;              // Criterio de ordenamiento (opcional)
}


