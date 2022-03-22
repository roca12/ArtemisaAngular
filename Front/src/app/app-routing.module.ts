import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { BibliotecaComponent } from './component/biblioteca/biblioteca.component';
import { CompetenciasComponent } from './component/competencias/competencias.component';
import { EstadisticasComponent } from './component/estadisticas/estadisticas.component';
import { EventosComponent } from './component/eventos/eventos.component';
import { LibrosComponent } from './component/libros/libros.component';
import { LinksComponent } from './component/links/links.component';
import { ProblemasComponent } from './component/problemas/problemas.component';

import { FullComponent } from './layouts/full/full.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: 'dashboard', redirectTo: '', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'temario',
        component: BibliotecaComponent
      },
      {
        path: 'problemas',
        component: ProblemasComponent
      },
      {
        path: 'libros',
        component: LibrosComponent
      },
      {
        path: 'links',
        component: LinksComponent
      },
      {
        path: 'estadisticas',
        component: EstadisticasComponent
      },
      {
        path: 'eventos',
        component: EventosComponent      
      },
      {
        path: 'competencias',
        component: CompetenciasComponent
      }

    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
