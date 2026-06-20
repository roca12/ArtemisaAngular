/**
 * Forma estándar de respuesta de la API de ArtemisaExpress.
 * Tanto los éxitos como los errores 4xx siguen este shape: `{ ok, message? }`.
 */
export interface ApiResult {
  /** Indica si la operación fue exitosa. */
  ok: boolean;
  /** Mensaje descriptivo opcional (presente sobre todo en errores). */
  message?: string;
}
