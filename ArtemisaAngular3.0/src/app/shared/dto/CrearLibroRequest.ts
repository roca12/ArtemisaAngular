/**
 * Cuerpo de la peticion para crear libros en el backend.
 */
export interface CrearLibroRequest {
  titulo: string;
  archivoPdf: string;
  imagen: string;
}
