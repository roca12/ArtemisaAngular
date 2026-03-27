import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private readonly baseUrl: string = environment.apiUrl + 'correo/';

  constructor(private http: HttpClient) {}

  enviarCodigo(correo: string, usuario: string) {
    return this.http.post(`${this.baseUrl}enviar`, {
      correo,
      usuario,
    });
  }

  reenviarCodigo(correo: string, usuario: string) {
    return this.http.post(`${this.baseUrl}reenviar`, {
      correo,
      usuario,
    });
  }

  validarCodigo(correo: string, codigo: string) {
    return this.http.post(`${this.baseUrl}validar`, {
      correo,
      codigo,
    });
  }
}
