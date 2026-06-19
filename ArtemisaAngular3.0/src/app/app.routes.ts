import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TemarioComponent } from './temario/temario.component';
import { ProblemasComponent } from './problemas/problemas.component';
import { LinksComponent } from './links/links.component';
import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuardGuard } from './shared/guards/auth-guard.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'temario', component: TemarioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegisterComponent },
  { path: 'problemas', component: ProblemasComponent },
  { path: 'links', component: LinksComponent },
  { path: 'calendar', component: CalendarComponent },
  {
    path: 'perfil',
    component: ProfileComponent,
    canActivate: [authGuardGuard],
  },
];
