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

export interface CalendarEvent {
  title: string;
  start: string | undefined;
  end: string | undefined;
  url: string | undefined;
  color: string;
  description: string | undefined;
}
