import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { UserService } from './user.service';
import { ProfileUser } from '../shared/models/profile-user.model';

/**
 * Servicio de autenticación.
 *
 * La sesión se mantiene con una cookie `token` httpOnly que fija el backend, NO
 * accesible desde JavaScript. Por eso el estado de sesión del front no se deriva
 * de un token local, sino que se verifica contra el backend (`GET /usuario/me`)
 * y se cachea en una señal reactiva.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userService = inject(UserService);

  /** Usuario autenticado actual; `null` si no hay sesión (o aún no se verificó). */
  private readonly _usuario = signal<ProfileUser | null>(null);
  /** Señal de solo lectura con el usuario autenticado actual. */
  readonly usuario = this._usuario.asReadonly();

  /** `true` si hay un usuario en sesión. Reactivo. */
  readonly isLoggedIn = computed(() => this._usuario() !== null);

  /**
   * Verifica la sesión contra el backend y actualiza el estado local.
   * @returns `true` si la sesión es válida; `false` ante 401/error de red.
   */
  cargarSesion(): Observable<boolean> {
    return this.userService.me().pipe(
      tap((res) => this._usuario.set(res.usuario)),
      map(() => true),
      catchError(() => {
        this._usuario.set(null);
        return of(false);
      }),
    );
  }

  /**
   * Cierra la sesión en el servidor (limpia la cookie) y borra el estado local.
   * El estado local se limpia siempre, aunque la petición falle.
   */
  cerrarSesion(): Observable<boolean> {
    return this.userService.logout().pipe(
      map(() => true),
      catchError(() => of(false)),
      tap(() => this._usuario.set(null)),
    );
  }
}
