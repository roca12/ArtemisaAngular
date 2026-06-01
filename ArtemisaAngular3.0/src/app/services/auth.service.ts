import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

/**
 * Servicio encargado de la gestión de autenticación y manejo de tokens JWT.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Clave para el almacenamiento del token. */
  private readonly TOKEN_KEY = 'token';

  /**
   * Guarda el token de autenticación en el almacenamiento local.
   * @param token El token JWT a guardar.
   */
  guardarToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Obtiene el token de autenticación del almacenamiento local.
   * @returns El token JWT si existe, de lo contrario null.
   */
  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica si el token de autenticación ha expirado.
   * @returns true si el token ha expirado o no existe, false en caso contrario.
   */
  tokenExpirado(): boolean {
    const token = this.obtenerToken();
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
  cerrarSesion() {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
