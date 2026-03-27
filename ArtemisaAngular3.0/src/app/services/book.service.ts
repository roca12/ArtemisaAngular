import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Libro } from '../shared/models/libro.model';
import { environment } from '../../environments/environment';

interface ApiResponse {
  data: Libro[];
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly baseUrl = environment.apiUrl + 'libro';

  constructor(private http: HttpClient) {}

  getLibros(): Observable<Libro[]> {
    return this.http
      .get<ApiResponse>(this.baseUrl)
      .pipe(map((response) => response.data));
  }
}
