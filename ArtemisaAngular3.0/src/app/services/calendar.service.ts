import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class CalendarService {
  private readonly baseUrl: string = environment.apiUrl+'calendario';

  constructor(private http: HttpClient) { }

  obtenerCalendario() {
    return this.http.get<any>(`${this.baseUrl}`);
  }


}
