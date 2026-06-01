import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CalendariosResponse } from '../shared/models/calendar.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly baseUrl: string = environment.apiUrl + 'calendario';

  constructor(private http: HttpClient) {}

  obtenerCalendario() {
    return this.http.get<CalendariosResponse>(`${this.baseUrl}`);
  }
}
