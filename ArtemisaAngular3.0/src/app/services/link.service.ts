import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Link } from '../shared/models/link.model';
import { environment } from '../../environments/environment';

/**
 * Servicio encargado de gestionar los enlaces valiosos de la plataforma.
 */
@Injectable({
  providedIn: 'root',
})
export class LinkService {
  /** URL base para los endpoints de enlaces valiosos. */
  private readonly baseUrl: string = environment.apiUrl + 'link-valioso/';

  /**
   * Constructor del servicio LinkService.
   * @param http Cliente HTTP para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de enlaces valiosos desde el servidor.
   * @returns Un Observable con la colección de enlaces.
   */
  obtenerLinks() {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
