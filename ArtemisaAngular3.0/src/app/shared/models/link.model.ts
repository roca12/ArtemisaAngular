/**
 * Representa un enlace valioso o recurso externo.
 */
export interface Link {
  /** Nombre descriptivo del enlace. */
  nombre: string;
  /** Dirección URL del recurso. */
  url: string;
  /** Etiquetas o palabras clave asociadas al enlace. */
  tags: string;
  /** Nombre o clase del icono representativo. */
  icono: string;
}
