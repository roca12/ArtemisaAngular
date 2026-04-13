/**
 * Representa la información de un libro de programación.
 */
export interface Libro {
  /** Nombre del archivo PDF o ruta al mismo. */
  archivoPdf: string;
  /** Ruta o URL de la imagen de portada del libro. */
  imagen: string;
  /** Título del libro. */
  titulo: string;
}
