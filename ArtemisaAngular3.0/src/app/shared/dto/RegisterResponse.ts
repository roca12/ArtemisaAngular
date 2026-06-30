/**
 * Respuesta del backend tras un registro exitoso.
 */
export interface RegisterResponse {
  /** Nombre de usuario registrado. */
  usuario: string;
  /** Correo electrónico registrado. */
  correo: string;
}
