import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RegisterRequest } from '../shared/dto/RegisterRequest';
import { EmailVerificationResponse } from '../shared/dto/EmailVerificationResponse';
import { ApiResult } from '../shared/dto/ApiResult';
import { UsuarioMeResponse } from '../shared/dto/UsuarioMeResponse';

/**
 * Servicio encargado de gestionar las operaciones relacionadas con los usuarios, como registro e inicio de sesión.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /** URL base para los endpoints de usuario. */
  private readonly baseUrl: string = `${environment.apiUrl}usuario/`;

  /**
   * Constructor del servicio UserService.
   * @param http Cliente HTTP para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * Registra un nuevo usuario en el sistema.
   * @returns Un Observable con la respuesta de la creación.
   * @param req Register request with user info
   */
  register(req: RegisterRequest) {
    return this.http.post(`${this.baseUrl}crear`, req);
  }

  /**
   * Verifica el correo del usuario mediante un código.
   * @param correo Correo electrónico del usuario.
   * @param codigo Código de verificación del correo.
   */
  verifyEmail(correo: string, codigo: string) {
    return this.http.post<EmailVerificationResponse>(
      `${this.baseUrl}verificar-correo`,
      { correo, codigo },
    );
  }

  /**
   * Autentica a un usuario para iniciar sesión.
   * La sesión se establece mediante una cookie httpOnly que fija el servidor;
   * el token NO viaja en el cuerpo de la respuesta.
   * @param usuario Nombre de usuario.
   * @param contrasenia Contraseña del usuario.
   * @returns Un Observable con la respuesta estándar `{ ok, message? }`.
   */
  login(usuario: string, contrasenia: string) {
    return this.http.post<ApiResult>(`${this.baseUrl}autenticar`, {
      usuario,
      contrasenia,
    });
  }

  /**
   * Obtiene los datos del usuario autenticado. Requiere sesión (cookie httpOnly).
   * @returns `{ ok: true, usuario }` con 200; lanza HttpErrorResponse 401 si no hay sesión.
   */
  me() {
    return this.http.get<UsuarioMeResponse>(`${this.baseUrl}me`);
  }

  /**
   * Cambia el correo del usuario.
   * @param nombreDeUsuario Usuario actual (tomado de /usuario/me, no de un input).
   * @param correo Nuevo correo.
   */
  cambiarCorreo(nombreDeUsuario: string, correo: string) {
    return this.http.patch<ApiResult>(`${this.baseUrl}cambiar-correo`, {
      nombreDeUsuario,
      correo,
    });
  }

  /**
   * Cambia la contraseña del usuario.
   * @param nombreDeUsuario Usuario actual (tomado de /usuario/me, no de un input).
   * @param nuevaContrasenia Nueva contraseña.
   */
  cambiarContrasenia(nombreDeUsuario: string, nuevaContrasenia: string) {
    return this.http.patch<ApiResult>(`${this.baseUrl}cambiar-contrasenia`, {
      nombreDeUsuario,
      nuevaContrasenia,
    });
  }

  /**
   * Cierra la sesión en el servidor (limpia la cookie httpOnly).
   */
  logout() {
    return this.http.post<ApiResult>(`${this.baseUrl}logout`, {});
  }
}
