import { Subject } from "rxjs";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { endOfDay, isSameDay, isSameMonth, startOfDay } from "date-fns";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http";

const colors: any = [
  {
    primary: "#9643A5",
    secondary: "#FAE3E3",
  },
  {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  {
    primary: "#e3bc08",
    secondary: "#FDF1BA",
  },
  {
    primary: "#D47F1E",
    secondary: "#FDF1BA",
  },
];

@Component({
  selector: "app-eventos",
  templateUrl: "./eventos.component.html",
  styleUrls: ["./eventos.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventosComponent implements OnInit, AfterViewInit {
  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;
  @BlockUI() blockUI: NgBlockUI;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: "Edit",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent("Edited", event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: "Delete",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent("Deleted", event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  constructor(
    private modal: NgbModal,
    private http: HttpClient,
  ) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !(
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen) ||
        events.length === 0
      );
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: "lg" });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: "New event",
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors[0],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  async ngAfterViewInit(): Promise<any> {}

  async ngOnInit(): Promise<any> {
    this.blockUI.start();
    try {
      await Promise.resolve().then(async () => {
        await this.http
          .get(
            "https://artemisaback.netlify.app/.netlify/functions/api/calendario",
          )
          .toPromise()
          .then((calendars: any) => {
            let index = 0;
            let event = [];
            for (const calendar of calendars) {
              for (const e of calendar["items"]) {
                if (e["start"]["dateTime"] !== undefined) {
                  index++;
                  event.push({
                    start: startOfDay(
                      new Date(e["start"]["dateTime"].replace(/T/g, " ")),
                    ),
                    end: endOfDay(
                      new Date(e["end"]["dateTime"].replace(/T/g, " ")),
                    ),
                    title: e["summary"],
                    color: colors[index % 4],
                    actions: [],
                    allDay: true,
                    resizable: {
                      beforeStart: true,
                      afterEnd: true,
                    },
                    draggable: true,
                    description: e["description"],
                    url: e["url"],
                  });
                }
              }
            }
            this.events = event;
            this.refresh.next();
          });
        setTimeout(() => {
          this.blockUI.stop();
        }, 500);
      });
    } catch (e) {
      setTimeout(() => {
        this.blockUI.stop();
      }, 500);
    }
  }

  redirectTo(url: string): void {
    window.open(url);
  }
}
