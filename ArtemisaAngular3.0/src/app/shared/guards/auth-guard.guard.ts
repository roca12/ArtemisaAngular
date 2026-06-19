import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from '../../services/auth.service';

/**
 * Permite activar la ruta solo si hay sesión vigente.
 *
 * Como la sesión vive en una cookie httpOnly (no legible desde JS), se verifica
 * contra el backend con `GET /usuario/me`. Si no hay sesión válida, redirige a
 * `/login` devolviendo un `UrlTree`.
 */
export const authGuardGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService
    .cargarSesion()
    .pipe(map((valida) => (valida ? true : router.createUrlTree(['/login']))));
};
