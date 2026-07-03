import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

/**
 * Fragmento de URL de las rutas de autenticación cuyo 401 es *esperado* y NO
 * debe forzar una redirección: `/usuario/me` (comprobación de sesión que corre
 * en cada página desde la barra de menú), `/usuario/autenticar`, `/logout`,
 * registro, etc. Cada uno maneja su propio error.
 */
const RUTAS_AUTH = '/usuario/';

/**
 * Interceptor que redirige a `/login` cuando la sesión expira.
 *
 * Solo actúa ante un **401** (cookie ausente/expirada) en rutas que NO son de
 * autenticación. Un **403** (sesión válida pero sin rol admin) no se toca: ahí
 * el usuario está logueado y redirigir a login no ayudaría.
 */
export const sessionExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: unknown) => {
      const esSesionExpirada =
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes(RUTAS_AUTH) &&
        !router.url.startsWith('/login');

      if (esSesionExpirada) {
        authService.limpiarSesionLocal();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
