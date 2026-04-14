import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

/**
 * Servicio encargado de la gestión de autenticación y manejo de tokens JWT.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Guarda el token de autenticación en el almacenamiento local.
   * @param token El token JWT a guardar.
   */
  static guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  /**
   * Obtiene el token de autenticación del almacenamiento local.
   * @returns El token JWT si existe, de lo contrario null.
   */
  static obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verifica si el token de autenticación ha expirado.
   * @returns true si el token ha expirado o no existe, false en caso contrario.
   */
  static tokenExpirado(): boolean {
    const token = AuthService.obtenerToken();
    if (!token) return true;
    try {
      const decodedToken = jwtDecode<{ exp?: number }>(token);
      if (!decodedToken.exp) return true;
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Elimina el token de autenticación del almacenamiento local para cerrar la sesión.
   */
  static cerrarSesion() {
    localStorage.removeItem('token');
  }
}
