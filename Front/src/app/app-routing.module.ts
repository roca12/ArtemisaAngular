import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BibliotecaComponent } from './component/biblioteca/biblioteca.component';

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
        loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'temario',
        component:BibliotecaComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
