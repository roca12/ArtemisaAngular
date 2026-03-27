import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../shared/models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl: string = environment.apiUrl + 'usuario/';

  constructor(private http: HttpClient) {}

  register(user: Usuario) {
    return this.http.post(`${this.baseUrl}crear`, user);
  }

  login(usuario: string, contrasenia: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}autenticar`, {
      usuario,
      contrasenia,
    });
  }
}
