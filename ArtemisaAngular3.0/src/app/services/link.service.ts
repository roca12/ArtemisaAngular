import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Link } from '../shared/models/link.model';

/**
 * Servicio encargado de gestionar los enlaces valiosos de la plataforma.
 */
@Injectable({
  providedIn: 'root',
})
export class LinkService {
  /** URL base para los endpoints de enlaces valiosos. */
  private readonly baseUrl: string = `${environment.apiUrl}link-valioso/`;

  /**
   * Constructor del servicio LinkService.
   * @param http Cliente HTTP para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de enlaces valiosos desde el servidor.
   * @returns Un Observable con la colección de enlaces envuelta en un objeto de respuesta.
   */
  obtenerLinks() {
    return this.http.get<Link[]>(`${this.baseUrl}`);
  }
}
