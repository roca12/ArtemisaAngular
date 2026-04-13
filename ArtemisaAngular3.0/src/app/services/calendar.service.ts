import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GoogleCalendar } from '../shared/models/calendar.model';

/**
 * Servicio encargado de la gestión de eventos y datos del calendario.
 */
@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  /** URL base para los endpoints del calendario. */
  private readonly baseUrl: string = `${environment.apiUrl}calendario`;

  /**
   * Constructor del servicio CalendarService.
   * @param http Cliente HTTP para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la información del calendario desde el servidor.
   * @returns Un Observable con los datos del calendario.
   */
  obtenerCalendario() {
    return this.http.get<GoogleCalendar[]>(`${this.baseUrl}`);
  }
}
