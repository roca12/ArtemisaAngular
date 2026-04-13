/**
 * Representa la fecha y hora de un evento en Google Calendar.
 */
export interface GoogleCalendarDateTime {
  /** Fecha y hora en formato ISO string. */
  dateTime?: string;
  /** Fecha sola (YYYY-MM-DD). */
  date?: string;
  /** Zona horaria asociada. */
  timeZone?: string;
}

/**
 * Representa un ítem o evento individual de la API de Google Calendar.
 */
export interface GoogleCalendarItem {
  /** Título o resumen del evento. */
  summary: string;
  /** Descripción detallada del evento. */
  description?: string;
  /** URL relacionada con el evento. */
  url?: string;
  /** Información de inicio del evento. */
  start: GoogleCalendarDateTime;
  /** Información de fin del evento. */
  end: GoogleCalendarDateTime;
}

/**
 * Representa la respuesta de la API de Google Calendar.
 */
export interface GoogleCalendar {
  /** Lista de eventos obtenidos. */
  items?: GoogleCalendarItem[];
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
