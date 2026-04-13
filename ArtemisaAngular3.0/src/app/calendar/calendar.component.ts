import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { ThemeService } from '../services/theme.service';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import {
  CalendarEvent,
  GoogleCalendar,
  GoogleCalendarItem,
} from '../shared/models/calendar.model';

/**
 * Componente que muestra un calendario de eventos utilizando FullCalendar.
 * Obtiene los eventos desde Google Calendar a través del servicio CalendarService.
 */
@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, SpinnerComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  /**
   * Constructor del componente de calendario.
   * @param calendarService Servicio para obtener los datos del calendario.
   * @param theme Servicio para gestionar el tema visual.
   */
  constructor(
    private calendarService: CalendarService,
    public theme: ThemeService,
  ) {}

  /** Indica si los datos del calendario se están cargando. */
  loading = true;

  /** Configuración y opciones para el componente FullCalendar. */
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek',
    },
    height: 'auto',
  };

  /**
   * Ciclo de vida OnInit: Carga los eventos del calendario al iniciar el componente.
   */
  ngOnInit(): void {
    this.calendarService
      .obtenerCalendario()
      .subscribe((res: GoogleCalendar[]) => {
        this.calendarOptions.events = this.mapearEventos(res);
        this.loading = false;
      });
  }

  /**
   * Mapea una lista de objetos GoogleCalendar a una lista plana de CalendarEvent.
   * @param calendarios Arreglo de calendarios obtenidos de la API.
   * @returns Arreglo de eventos formateados para FullCalendar.
   */
  private mapearEventos(calendarios: GoogleCalendar[]): CalendarEvent[] {
    return calendarios.flatMap((calendario) =>
      (calendario.items ?? []).map((item) =>
        CalendarComponent.mapearItem(item),
      ),
    );
  }

  /**
   * Mapea un ítem individual de Google Calendar a un objeto CalendarEvent.
   * @param item El ítem de Google Calendar a transformar.
   * @returns Un objeto de tipo CalendarEvent.
   */
  private static mapearItem(item: GoogleCalendarItem): CalendarEvent {
    return {
      title: item.summary,
      start: item.start?.dateTime ?? item.start?.date,
      end: item.end?.dateTime ?? item.end?.date,
      url: item.url,
      color: '#1F5E67',
      description: item.description,
    };
  }
}
