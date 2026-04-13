import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio encargado de la validación del reCAPTCHA.
 */
@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  /**
   * Constructor del servicio RecaptchaService.
   * @param http Cliente HTTP para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * Verifica el token de reCAPTCHA con el servidor para comprobar si el usuario es humano.
   * @param token El token generado por el widget de reCAPTCHA.
   * @returns Un Observable con el resultado de la verificación (esHumano: boolean).
   */
  verificarCaptcha(token: string): Observable<{ esHumano: boolean }> {
    return this.http.post<{ esHumano: boolean }>(
      `${environment.apiUrl}usuario/autenticar/captcha`,
      { token },
    );
  }
}
