import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../services/auth.service';

/**
 * Permite activar la ruta solo si hay sesión vigente Y el usuario es admin.
 *
 * Como la sesión vive en una cookie httpOnly (no legible desde JS), se verifica
 * contra el backend con `GET /usuario/me`, que además devuelve el rol. Tras la
 * verificación:
 *  - sin sesión válida → redirige a `/login`.
 *  - con sesión pero sin rol admin → redirige a `/perfil`.
 *  - admin → permite el acceso.
 *
 * Esto es solo control de UI: el backend debe validar el rol en cada endpoint
 * del panel, ya que un guard del front no protege los datos.
 */
export const adminGuardGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.cargarSesion().pipe(
    map((valida) => {
      if (!valida) {
        return router.createUrlTree(['/login']);
      }
      const esAdmin = authService.usuario()?.rol?.toLowerCase() === 'admin';
      return esAdmin ? true : router.createUrlTree(['/perfil']);
    }),
  );
};
