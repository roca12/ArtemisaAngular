import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule, LocationStrategy, HashLocationStrategy} from '@angular/common';

import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {FullComponent} from './layouts/full/full.component';


import {NavigationComponent} from './shared/header/navigation.component';
import {SidebarComponent} from './shared/sidebar/sidebar.component';

import {Approutes} from './app-routing.module';
import {AppComponent} from './app.component';
import {SpinnerComponent} from './shared/spinner.component';

import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {BibliotecaComponent} from './component/biblioteca/biblioteca.component';
import {DataTablesModule} from "angular-datatables";

import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {ProblemasComponent} from './component/problemas/problemas.component';
import {LibrosComponent} from './component/libros/libros.component';
import {LinksComponent} from './component/links/links.component';
import {EstadisticasComponent} from './component/estadisticas/estadisticas.component';
import {EventosComponent} from './component/eventos/eventos.component';
import {CompetenciasComponent} from './component/competencias/competencias.component';
import {DownloadDirective} from './component/libros/libros.directive';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {BlockUiTemplateComponent} from './utils/block-ui-template/block-ui-template.component';
import {BlockUIModule} from 'ng-block-ui';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Error404Component} from './errors/error404/error404.component';
import {Error400Component} from './errors/error400/error400.component';
import {Error401Component} from './errors/error401/error401.component';
import {Error403Component} from './errors/error403/error403.component';
import {Error406Component} from './errors/error406/error406.component';
import {Error410Component} from './errors/error410/error410.component';
import {Error418Component} from './errors/error418/error418.component';
import {Error500Component} from './errors/error500/error500.component';
import {Error503Component} from './errors/error503/error503.component';
import {Error521Component} from './errors/error521/error521.component';

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
    DownloadDirective,
    BlockUiTemplateComponent,
    DownloadDirective,
    Error404Component,
    Error400Component,
    Error401Component,
    Error403Component,
    Error406Component,
    Error410Component,
    Error418Component,
    Error500Component,
    Error503Component,
    Error521Component,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(Approutes, { useHash: false, relativeLinkResolution: 'legacy' }),
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
    MatPaginatorModule,
    MatExpansionModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatAutocompleteModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BlockUIModule.forRoot({
      template: BlockUiTemplateComponent
    }),
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
export class AppModule {
}
