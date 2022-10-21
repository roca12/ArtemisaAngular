import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Routes, RouterModule} from "@angular/router";
import {NgApexchartsModule} from "ng-apexcharts";
import {DashboardComponent} from "./dashboard.component";
import {TopCardsComponent} from "./dashboard-components/top-cards/top-cards.component";
import {BlogCardsComponent} from "./dashboard-components/blog-cards/blog-cards.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/moment";


const routes: Routes = [
  {
    path: "",
    data: {
      title: "Dashboard",
      urls: [{title: "Dashboard", url: ""}, {title: "Dashboard"}],
    },
    component: DashboardComponent,
  },
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule.forChild(routes),
    NgApexchartsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [
    DashboardComponent,
    TopCardsComponent,
    BlogCardsComponent
  ],
})
export class DashboardModule {
}
