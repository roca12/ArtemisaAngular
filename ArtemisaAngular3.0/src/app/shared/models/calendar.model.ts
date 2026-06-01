export interface CalendarioEvento {
  id: string;
  titulo: string;
  descripcion?: string;
  inicio: string;
  fin: string;
  url?: string;
  ubicacion?: string;
}

export interface Calendario {
  titulo: string;
  eventos: CalendarioEvento[];
}

export interface CalendariosResponse {
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
