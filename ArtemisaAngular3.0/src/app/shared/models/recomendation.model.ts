/**
 * Representa una sugerencia o recomendación para el motor de búsqueda.
 */
export interface Recomendation {
  /** El valor o texto de la recomendación. */
  data: string;
  /** El tipo de recomendación (e.g., 'tema', 'problema', 'libro'). */
  type: string;
}
