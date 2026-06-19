import { ApiResult } from './ApiResult';
import { ProfileUser } from '../models/profile-user.model';

/**
 * Respuesta de `GET /usuario/me`.
 * 200 → `{ ok: true, usuario: {...} }`.
 * 401 → `{ ok: false, message: "Token no proporcionado" | "Token inválido o expirado" }`
 *        (se recibe como cuerpo del HttpErrorResponse).
 */
export interface UsuarioMeResponse extends ApiResult {
  usuario: ProfileUser;
}
