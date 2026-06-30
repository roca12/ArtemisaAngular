import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from '../shared/models/libro.model';
import { environment } from '../../environments/environment';

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
}
