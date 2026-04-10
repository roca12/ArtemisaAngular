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
      .subscribe((res: GoogleCalendar[]) => {
        this.calendarOptions.events = this.mapearEventos(res);
        this.loading = false;
      });
  }

  private mapearEventos(calendarios: GoogleCalendar[]): CalendarEvent[] {
    return calendarios.flatMap((calendario) =>
      (calendario.items ?? []).map((item) => this.mapearItem(item)),
    );
  }

  private mapearItem(item: GoogleCalendarItem): CalendarEvent {
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
