import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * Servicio encargado de gestionar el envío y validación de correos electrónicos.
 */
@Injectable({
  providedIn: 'root',
})
export class MailService {
  /** URL base para los endpoints de correo electrónico. */
  private readonly baseUrl: string = `${environment.apiUrl}correo/`;

  /**
   * Constructor del servicio MailService.
   * @param http Cliente HTTP para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * Envía un código de verificación inicial al correo especificado.
   * @param correo Dirección de correo electrónico del destinatario.
   * @param usuario Nombre de usuario asociado.
   * @returns Un Observable con la respuesta de la petición.
   */
  enviarCodigo(correo: string, usuario: string) {
    return this.http.post(`${this.baseUrl}enviar`, {
      correo,
      usuario,
    });
  }

  /**
   * Reenvía un código de verificación al correo especificado.
   * @param correo Dirección de correo electrónico del destinatario.
   * @param usuario Nombre de usuario asociado.
   * @returns Un Observable con la respuesta de la petición.
   */
  reenviarCodigo(correo: string, usuario: string) {
    return this.http.post(`${this.baseUrl}reenviar`, {
      correo,
      usuario,
    });
  }

  /**
   * Valida un código de verificación ingresado por el usuario.
   * @param correo Dirección de correo electrónico a validar.
   * @param codigo Código de verificación recibido por el usuario.
   * @returns Un Observable con la respuesta de la validación.
   */
  validarCodigo(correo: string, codigo: string) {
    return this.http.post(`${this.baseUrl}validar`, {
      correo,
      codigo,
    });
  }
}
