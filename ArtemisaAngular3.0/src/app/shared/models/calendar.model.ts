export interface GoogleCalendarDateTime {
  dateTime?: string;
  date?: string;
  timeZone?: string;
}

export interface GoogleCalendarItem {
  summary: string;
  description?: string;
  url?: string;
  start: GoogleCalendarDateTime;
  end: GoogleCalendarDateTime;
}

export interface GoogleCalendar {
  items?: GoogleCalendarItem[];
}

export interface CalendarEvent {
  title: string;
  start: string | undefined;
  end: string | undefined;
  url: string | undefined;
  color: string;
  description: string | undefined;
}
