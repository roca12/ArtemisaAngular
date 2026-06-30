/** Estado de publicación de un cuaderno. */
export type CuadernoEstado = 'publicado' | 'borrador';

/**
 * Cuaderno de notas/apuntes del usuario.
 */
export interface Cuaderno {
  /** Identificador único del cuaderno. */
  id: string;
  /** Título del cuaderno. */
  titulo: string;
  /** Descripción breve del contenido. */
  descripcion: string;
  /** Estado de publicación (publicado o borrador). */
  estado: CuadernoEstado;
  /** Número de entradas que contiene el cuaderno. */
  numEntradas: number;
  /** Fecha de creación del cuaderno. */
  fechaCreacion: Date;
  /** Fecha de la última modificación. */
  fechaModificacion: Date;
  /** Color de la portada (valor CSS). */
  coverColor: string;
}
