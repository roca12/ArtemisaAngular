import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Link } from '../shared/models/link.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private readonly baseUrl: string = environment.apiUrl + 'link-valioso/';

  constructor(private http: HttpClient) {}

  obtenerLinks() {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
