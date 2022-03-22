import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsRoutes } from './component.routing';
import { ProblemasComponent } from './problemas/problemas.component';
import { LibrosComponent } from './libros/libros.component';
import { LinksComponent } from './links/links.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { EventosComponent } from './eventos/eventos.component';
import { CompetenciasComponent } from './competencias/competencias.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  declarations: [
    
  
    ProblemasComponent,
             LibrosComponent,
             LinksComponent,
             EstadisticasComponent,
             EventosComponent,
             CompetenciasComponent
  ]
})
export class ComponentsModule { }
