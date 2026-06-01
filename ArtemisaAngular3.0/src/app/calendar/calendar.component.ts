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

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, SpinnerComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  constructor(
    private calendarService: CalendarService,
    public theme: ThemeService,
  ) {}

  loading = true;

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

  ngOnInit(): void {
    this.calendarService
      .obtenerCalendario()
      .subscribe((res: CalendariosResponse) => {
        this.calendarOptions.events = this.mapearEventos(res.calendarios);
        this.loading = false;
      });
  }

  private mapearEventos(calendarios: Calendario[]): CalendarEvent[] {
    return calendarios.flatMap((calendario) =>
      (calendario.eventos ?? []).map((evento) => this.mapearEvento(evento)),
    );
  }

  private mapearEvento(evento: CalendarioEvento): CalendarEvent {
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
