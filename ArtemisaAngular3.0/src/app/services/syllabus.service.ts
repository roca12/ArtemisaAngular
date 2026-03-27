import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Temario } from '../shared/models/temario.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SyllabusService {
  private readonly baseUrl: string = environment.apiUrl + 'temario';

  constructor(private http: HttpClient) {}

  getSyllabus() {
    return this.http.get<{ data: any[] }>(this.baseUrl);
  }

  getSuperGrupos() {
    return this.http.get<{ data: any[] }>(`${this.baseUrl}/supergrupos`);
  }
}
