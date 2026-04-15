import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TemarioComponent } from './temario/temario.component';
import { ProblemasComponent } from './problemas/problemas.component';
import { LinksComponent } from './links/links.component';
import { CalendarComponent } from './calendar/calendar.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'temario',
    component: TemarioComponent,
  },
  /*{
    path:'login',
    component:LoginComponent
  },*/
  {
    path: 'problemas',
    component: ProblemasComponent,
  },
  {
    path: 'links',
    component: LinksComponent,
  },
  /*{
    path: 'registrar',
    component: RegisterComponent
  },*/
  {
    path: 'calendar',
    component: CalendarComponent,
  },
];
