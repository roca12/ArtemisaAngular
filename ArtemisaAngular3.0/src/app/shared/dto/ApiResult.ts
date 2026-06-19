/**
 * Forma estándar de respuesta de la API de ArtemisaExpress.
 * Tanto los éxitos como los errores 4xx siguen este shape: `{ ok, message? }`.
 */
export interface ApiResult {
  ok: boolean;
  message?: string;
}
