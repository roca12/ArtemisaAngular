/**
 * Evento de calendario tal como lo entrega el backend.
 */
export interface CalendarioEvento {
  /** Identificador único del evento. */
  id: string;
  /** Título del evento. */
  titulo: string;
  /** Descripción opcional del evento. */
  descripcion?: string;
  /** Fecha/hora de inicio (string ISO). */
  inicio: string;
  /** Fecha/hora de fin (string ISO). */
  fin: string;
  /** URL opcional con más información. */
  url?: string;
  /** Ubicación opcional del evento. */
  ubicacion?: string;
}

/**
 * Calendario con su título y su lista de eventos.
 */
export interface Calendario {
  /** Título del calendario. */
  titulo: string;
  /** Eventos que contiene el calendario. */
  eventos: CalendarioEvento[];
}

/**
 * Respuesta del backend con la colección de calendarios.
 */
export interface CalendariosResponse {
  /** Lista de calendarios devueltos. */
  calendarios: Calendario[];
}

/**
 * Representa un evento de calendario formateado para ser usado por componentes internos.
 */
export interface CalendarEvent {
  /** Título del evento. */
  title: string;
  /** Fecha/hora de inicio en formato string. */
  start: string | undefined;
  /** Fecha/hora de fin en formato string. */
  end: string | undefined;
  /** URL opcional para más información. */
  url: string | undefined;
  /** Color distintivo para el evento en la interfaz. */
  color: string;
  /** Descripción opcional del evento. */
  description: string | undefined;
}
