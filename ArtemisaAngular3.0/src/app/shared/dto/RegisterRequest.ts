/**
 * Cuerpo de la petición de registro de un nuevo usuario.
 */
export interface RegisterRequest {
  /** Nombre de usuario elegido. */
  usuario: string;
  /** Correo electrónico del usuario. */
  correo: string;
  /** Contraseña en texto plano (se envía sobre HTTPS). */
  contrasenia: string;
  /** Código de verificación recibido por correo. */
  verificacion: string;
}
