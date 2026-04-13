/**
 * Representa la información de un usuario en el sistema.
 */
export interface Usuario {
  /** Contraseña del usuario (generalmente en texto plano durante el registro). */
  contrasenia: string;
  /** Rol asignado al usuario (e.g., 'admin', 'user'). */
  rol: string;
  /** Nombre de usuario único para inicio de sesión. */
  usuario: string;
  /** Dirección de correo electrónico del usuario. */
  correo: string;
  /** Código o estado de verificación de la cuenta. */
  verificacion: string;
}
