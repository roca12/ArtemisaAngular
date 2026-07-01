/**
 * Representa la información de un libro de programación.
 */
export interface Libro {
  /** Identificador de MongoDB (lo devuelve el backend; necesario para editar/eliminar). */
  _id?: string;
  /** Título del libro. */
  titulo: string;
  /** Ruta o URL del archivo PDF del libro. */
  archivoPdf: string;
  /** Ruta o URL de la imagen de portada del libro. */
  imagen: string;
}
