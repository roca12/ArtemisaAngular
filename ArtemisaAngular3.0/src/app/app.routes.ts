import { Routes } from '@angular/router';
import { PanelComponent } from './admin/panel/panel.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';
import { LinksComponent } from './links/links.component';
import { LoginComponent } from './login/login.component';
import { ProblemasComponent } from './problemas/problemas.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { adminGuardGuard } from './shared/guards/admin-guard.guard';
import { authGuardGuard } from './shared/guards/auth-guard.guard';
import { TemarioComponent } from './temario/temario.component';

/**
 * Tabla de rutas de la aplicación.
 * Asocia cada `path` con su componente. La ruta `perfil` está protegida por
 * `authGuardGuard`, que exige sesión vigente y redirige a `/login` si no la hay.
 */
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
  {
    path: 'admin',
    component: PanelComponent,
    canActivate: [adminGuardGuard],
  },
];
