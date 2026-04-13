/**
 * Representa un problema de programación competitiva.
 */
export interface Problema {
  /** Identificador único del problema. */
  id: number;
  /** Título del problema. */
  titulo: string;
  /** Nombre del juez en línea (e.g., UVa, Codeforces). */
  juez: string;
  /** Alias o código corto del problema. */
  alias: string;
  /** Valor numérico que representa la dificultad. */
  dificultad: number;
  /** Categoría o tema principal. */
  tema_1: string;
  /** Categoría o tema secundario opcional. */
  tema_2: string;
  /** Categoría o tema adicional opcional. */
  tema_3: string;
  /** Categoría o tema adicional opcional. */
  tema_4: string;
  /** Dirección URL del problema en el juez original. */
  url: string;
}
