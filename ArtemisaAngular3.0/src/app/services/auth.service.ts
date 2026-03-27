import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  tokenExpirado(): boolean {
    const token = this.obtenerToken();
    if (!token) return true;
    try {
      const decodedToken: any = jwtDecode(token);
      if (!decodedToken.exp) return true;
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
  }
}
