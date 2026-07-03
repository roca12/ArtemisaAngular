import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Libro } from '../shared/models/libro.model';

/**
 * Servicio encargado de gestionar las operaciones relacionadas con los libros.
 */
@Injectable({
  providedIn: 'root',
})
export class BookService {
  /** URL base del endpoint de libros en el backend. */
  private readonly baseUrl = `${environment.apiUrl}libro/`;

  /**
   * @param http Cliente HTTP para comunicarse con el backend.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista completa de libros desde el servidor.
   * @returns Un Observable que emite un arreglo de objetos de tipo Libro.
   */
  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.baseUrl);
  }

  /**
   * Crea un nuevo libro subiendo el PDF y la portada a Cloudinary.
   *
   * El backend espera `multipart/form-data` con el título y los archivos.
   * @param datos Título y archivos (PDF obligatorio, portada opcional).
   * @returns Un Observable que emite el libro recién creado.
   */
  crearLibro(datos: {
    titulo: string;
    archivoPdf?: File;
    imagen?: File;
  }): Observable<Libro> {
    const formData = new FormData();
    formData.append('titulo', datos.titulo);
    if (datos.archivoPdf) {
      formData.append('archivoPdf', datos.archivoPdf);
    }
    if (datos.imagen) {
      formData.append('imagen', datos.imagen);
    }
    return this.http.post<Libro>(`${this.baseUrl}crear`, formData);
  }

  /**
   * Actualiza un libro existente, subiendo los archivos a Cloudinary.
   *
   * El backend espera `multipart/form-data` con el título y, opcionalmente, los
   * archivos de PDF e imagen de portada (que sube a Cloudinary).
   * @param id Identificador del libro a actualizar.
   * @param datos Título y archivos opcionales (PDF y portada).
   * @returns Un Observable que emite el libro actualizado.
   */
  actualizarLibro(
    id: string,
    datos: { titulo?: string; archivoPdf?: File; imagen?: File },
  ): Observable<Libro> {
    const formData = new FormData();
    if (datos.titulo !== undefined) {
      formData.append('titulo', datos.titulo);
    }
    if (datos.archivoPdf) {
      formData.append('archivoPdf', datos.archivoPdf);
    }
    if (datos.imagen) {
      formData.append('imagen', datos.imagen);
    }
    return this.http.put<Libro>(`${this.baseUrl}${id}`, formData);
  }

  /**
   * Elimina un libro del servidor por su identificador.
   * @param id Identificador del libro a eliminar.
   * @returns Un Observable que emite la respuesta de confirmación del servidor.
   */
  eliminarLibro(id: string): Observable<{ ok: boolean; message: string }> {
    return this.http.delete<{ ok: boolean; message: string }>(
      `${this.baseUrl}${id}`,
    );
  }
}
