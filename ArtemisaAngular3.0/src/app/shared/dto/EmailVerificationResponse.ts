/**
 * Respuesta del backend al solicitar o validar la verificación por correo.
 */
export interface EmailVerificationResponse {
  /** Indica si la operación de verificación fue exitosa. */
  ok: boolean;
  /** Mensaje descriptivo del resultado. */
  message: string;
}
