import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Temario } from '../shared/models/temario.model';
import { environment } from '../../environments/environment';

/**
 * Servicio encargado de gestionar el temario y los grupos de la plataforma.
 */
@Injectable({
  providedIn: 'root',
})
export class SyllabusService {
  /** URL base para los endpoints del temario. */
  private readonly baseUrl: string = environment.apiUrl + 'temario';

  /**
   * Constructor del servicio SyllabusService.
   * @param http Cliente HTTP para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene el temario completo desde el servidor.
   * @returns Un Observable con la colección de temas.
   */
  getSyllabus() {
    return this.http.get<{ data: any[] }>(this.baseUrl);
  }

  /**
   * Obtiene la lista de supergrupos del temario desde el servidor.
   * @returns Un Observable con la lista de nombres de supergrupos.
   */
  getSuperGrupos() {
    return this.http.get<{ data: any[] }>(`${this.baseUrl}/supergrupos`);
  }
}
