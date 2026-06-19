import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor que adjunta `withCredentials: true` a TODA petición saliente.
 *
 * Es el equivalente Angular de `fetch(..., { credentials: 'include' })` /
 * `axios(..., { withCredentials: true })`: sin esto, el navegador no envía la
 * cookie `token` httpOnly y las rutas protegidas responden 401.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ withCredentials: true }));
