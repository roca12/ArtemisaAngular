/**
 * Representa un enlace valioso o recurso externo.
 */
export interface Link {
  /** Identificador de MongoDB (lo devuelve el backend; necesario para editar/eliminar). */
  _id?: string;
  /** Nombre descriptivo del enlace. */
  nombre: string;
  /** Dirección URL del recurso. */
  url: string;
  /** Etiquetas o palabras clave asociadas al enlace. */
  tags: string;
  /** Nombre o clase del icono representativo. */
  icono: string;
}
