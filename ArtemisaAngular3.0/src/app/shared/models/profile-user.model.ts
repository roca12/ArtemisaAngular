/**
 * Datos del usuario autenticado tal como los entrega `GET /usuario/me`.
 * Los nombres de campo replican el contrato del backend (en español)
 * para evitar mapeos propensos a error.
 */
export interface ProfileUser {
  /** Nombre de usuario (← usuario.usuario). Se usa como `nombreDeUsuario` en los PATCH. */
  usuario: string;
  /** Correo electrónico (← usuario.correo). */
  correo: string;
  /** Rol del usuario, p. ej. "admin" (← usuario.rol). Solo se muestra. */
  rol: string;
}
