/**
 * Extrae un mensaje legible de un error HTTP del backend.
 *
 * El backend responde de dos formas (ver BACKEND_HANDOFF):
 *  - errores generales: `{ ok: false, message: "..." }`
 *  - validaciones de DTO: `{ ok: false, errors: ["...", "..."] }`
 *
 * @param err Error capturado (normalmente un `HttpErrorResponse`).
 * @param fallback Mensaje por defecto si no se reconoce la forma del error.
 * @returns El mensaje más específico disponible.
 */
export function mensajeDeError(
  err: unknown,
  fallback = 'Ocurrió un error inesperado.',
): string {
  const e = err as {
    error?: { message?: string; errors?: string[] };
    message?: string;
    status?: number;
  };
  if (e?.error?.errors?.length) {
    return e.error.errors.join(' ');
  }
  if (e?.error?.message) {
    return e.error.message;
  }
  // Error lanzado en el cliente (no HTTP): tiene `message` pero no `status`/`error`.
  if (e?.message && e.status === undefined && e.error === undefined) {
    return e.message;
  }
  return fallback;
}
