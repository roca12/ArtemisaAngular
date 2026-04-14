import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Libro } from '../shared/models/libro.model';
import { environment } from '../../environments/environment';

/**
 * Interfaz para la respuesta de la API que contiene una lista de libros.
 */
interface ApiResponse {
  /** Colección de libros devuelta por la API */
  data: Libro[];
}

/**
 * Servicio encargado de gestionar las operaciones relacionadas con los libros.
 */
@Injectable({
  providedIn: 'root',
})
export class BookService {
  /** Cliente HTTP para realizar peticiones. */
  private http = inject(HttpClient);
  /** URL base para los endpoints de libros. */
  private readonly baseUrl = `${environment.apiUrl}libro`;

  /**
   * Obtiene la lista completa de libros desde el servidor.
   * @returns Un Observable que emite un arreglo de objetos de tipo Libro.
   */
  getLibros(): Observable<Libro[]> {
    return this.http
      .get<ApiResponse>(this.baseUrl)
      .pipe(map((response) => response.data));
  }
}
