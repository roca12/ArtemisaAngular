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
  Calendario,
  CalendarioEvento,
  CalendariosResponse,
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
      .subscribe((res: CalendariosResponse) => {
        this.calendarOptions.events = CalendarComponent.mapearEventos(
          res.calendarios,
        );
        this.loading = false;
      });
  }

  /**
   * Mapea todos los eventos de una lista de calendarios al formato de FullCalendar.
   * @param calendarios Lista de calendarios con sus eventos.
   * @returns Arreglo plano de CalendarEvent listos para renderizar.
   */
  private static mapearEventos(calendarios: Calendario[]): CalendarEvent[] {
    return calendarios.flatMap((calendario) =>
      (calendario.eventos ?? []).map((evento) =>
        CalendarComponent.mapearEvento(evento),
      ),
    );
  }

  /**
   * Mapea un evento de Google Calendar al formato esperado por FullCalendar.
   * @param evento Evento del calendario en formato interno.
   * @returns Objeto CalendarEvent listo para renderizar en FullCalendar.
   */
  private static mapearEvento(evento: CalendarioEvento): CalendarEvent {
    return {
      title: evento.titulo,
      start: evento.inicio,
      end: evento.fin,
      url: evento.url,
      color: '#1F5E67',
      description: evento.descripcion,
    };
  }
}
