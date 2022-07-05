import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule, LocationStrategy, HashLocationStrategy,
  PathLocationStrategy
} from '@angular/common';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './layouts/full/full.component';


import { NavigationComponent } from './shared/header/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BibliotecaComponent } from './component/biblioteca/biblioteca.component';
import { DataTablesModule } from "angular-datatables";

import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { ProblemasComponent } from './component/problemas/problemas.component';
import { LibrosComponent } from './component/libros/libros.component';
import { LinksComponent } from './component/links/links.component';
import { EstadisticasComponent } from './component/estadisticas/estadisticas.component';
import { EventosComponent } from './component/eventos/eventos.component';
import { CompetenciasComponent } from './component/competencias/competencias.component';
import { DownloadDirective } from './component/libros/libros.directive';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    NavigationComponent,
    SidebarComponent,
    BibliotecaComponent,

    ProblemasComponent,
    LibrosComponent,
    LinksComponent,
    EstadisticasComponent,
    EventosComponent,
    CompetenciasComponent,
    DownloadDirective
  ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,
        RouterModule.forRoot(Approutes, {useHash: false, relativeLinkResolution: 'legacy'}),
        PerfectScrollbarModule,
        FontAwesomeModule,
        DataTablesModule,
        CodemirrorModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule
    ],
  providers: [
    {
      provide: LocationStrategy, useClass: HashLocationStrategy
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
