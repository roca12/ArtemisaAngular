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
  const posibleError = err as {
    error?: { message?: string; errors?: string[] };
    message?: string;
    status?: number;
  };
  if (posibleError?.error?.errors?.length) {
    return posibleError.error.errors.join(' ');
  }
  if (posibleError?.error?.message) {
    return posibleError.error.message;
  }
  // Error lanzado en el cliente (no HTTP): tiene `message` pero no `status`/`error`.
  if (
    posibleError?.message &&
    posibleError.status === undefined &&
    posibleError.error === undefined
  ) {
    return posibleError.message;
  }
  return fallback;
}
