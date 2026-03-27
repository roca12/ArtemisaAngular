import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  constructor(
    private calendarService: CalendarService,
    public theme: ThemeService,
  ) {}

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
    this.calendarService.obtenerCalendario().subscribe((res) => {
      let eventos: any[] = [];
      for (const calendario of res) {
        if (calendario.items) {
          console.log(calendario.items);
          eventos = eventos.concat(
            calendario.items.map((item: any) => ({
              title: item.summary,
              start: item.start?.dateTime || item.start?.date,
              end: item.end?.dateTime || item.end?.date,
              url: item.url,
              color: '#1F5E67', // Color del evento
              description: item.description,
            })),
          );
        }
      }
      this.calendarOptions.events = eventos;
    });
  }
}
