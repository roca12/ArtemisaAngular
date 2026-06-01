import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../shared/models/usuario.model';
import { environment } from '../../environments/environment';

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
   * @param user El objeto Usuario con la información de registro.
   * @returns Un Observable con la respuesta de la creación.
   */
  register(user: Usuario) {
    return this.http.post(`${this.baseUrl}crear`, user);
  }

  /**
   * Autentica a un usuario para iniciar sesión.
   * @param usuario Nombre de usuario.
   * @param contrasenia Contraseña del usuario.
   * @returns Un Observable con el token de autenticación generado.
   */
  login(usuario: string, contrasenia: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}autenticar`, {
      usuario,
      contrasenia,
    });
  }
}
