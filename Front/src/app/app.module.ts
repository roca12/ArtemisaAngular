/**
 * Core Angular modules
 */
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule, LocationStrategy, HashLocationStrategy} from '@angular/common';
import {Location, PathLocationStrategy} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

/**
 * Third-party library imports
 */
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

/**
 * Layout components
 */
import {FullComponent} from './layouts/full/full.component';
import {NavigationComponent} from './shared/header/navigation.component';
import {SidebarComponent} from './shared/sidebar/sidebar.component';

/**
 * Core application components and modules
 */
import {Approutes} from './app-routing.module';
import {AppComponent} from './app.component';
import {SpinnerComponent} from './shared/spinner.component';

/**
 * Scrollbar and UI enhancement libraries
 */
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {DataTablesModule} from "angular-datatables";
import {CodemirrorModule} from '@ctrl/ngx-codemirror';

/**
 * Application feature components
 */
import {BibliotecaComponent} from './component/biblioteca/biblioteca.component';
import {ProblemasComponent} from './component/problemas/problemas.component';
import {LibrosComponent} from './component/libros/libros.component';
import {LinksComponent} from './component/links/links.component';
import {EstadisticasComponent} from './component/estadisticas/estadisticas.component';
import {EventosComponent} from './component/eventos/eventos.component';
import {CompetenciasComponent} from './component/competencias/competencias.component';
import {DownloadDirective} from './component/libros/libros.directive';

/**
 * Angular Material UI components
 */
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
import {MatTooltipModule} from '@angular/material/tooltip';

/**
 * Calendar and UI blocking components
 */
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {BlockUiTemplateComponent} from './utils/block-ui-template/block-ui-template.component';
import {BlockUIModule} from 'ng-block-ui';

/**
 * Error handling components
 */
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

/**
 * Additional Angular Material modules
 */
import {MatSortModule} from "@angular/material/sort";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";
import {FlexLayoutModule} from '@angular/flex-layout';

/**
 * Additional feature components
 */
import {ArticulosComponent} from './component/articulos/articulos.component';
import {AlianzasComponent} from './component/alianzas/alianzas.component';
import {PrimerosPasosComponent} from './component/primeros-pasos/primeros-pasos.component';
import {CpTeoricaComponent} from './component/cp-teorica/cp-teorica.component';
import {JuecesComponent} from './component/jueces/jueces.component';
import {RecomendacionesComponent} from './component/recomendaciones/recomendaciones.component';
import {DialogTemarioComponent} from './dialog-temario/dialog-temario.component';
import {LoginComponent} from './component/login/login.component';
import {AdministrarTemasComponent} from './component/administrar-temas/administrar-temas.component';

/**
 * Theme configuration
 */
import {DARK_MODE_OPTIONS} from 'angular-dark-mode';


/**
 * Default configuration for PerfectScrollbar
 * Controls scrollbar behavior and appearance
 */
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,      // Disable horizontal scrolling
  wheelSpeed: 1,              // Scroll speed when using mouse wheel
  wheelPropagation: true,     // Whether wheel events propagate to parent containers
  minScrollbarLength: 20      // Minimum length of scrollbar in pixels
};

/**
 * Main application module decorator
 * Configures the application with all necessary components, modules, and providers
 */
@NgModule({
  /**
   * Components, directives, and pipes that belong to this module
   */
  declarations: [
    // Core components
    AppComponent,
    SpinnerComponent,
    FullComponent,
    NavigationComponent,
    SidebarComponent,

    // Feature components
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

    // Error components
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

    // Additional feature components
    ArticulosComponent,
    AlianzasComponent,
    PrimerosPasosComponent,
    CpTeoricaComponent,
    JuecesComponent,
    RecomendacionesComponent,
    DialogTemarioComponent,
    LoginComponent,
    AdministrarTemasComponent
  ],
  /**
   * Modules imported by this module
   * These provide functionality used throughout the application
   */
  imports: [
    // Angular core modules
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Third-party modules
    NgbModule,
    RouterModule.forRoot(Approutes, {relativeLinkResolution: 'legacy', useHash: true}),
    PerfectScrollbarModule,
    FontAwesomeModule,
    DataTablesModule,
    CodemirrorModule,

    // Angular Material modules
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
    MatSortModule,
    MatSlideToggleModule,
    MatCardModule,
    MatDialogModule,

    // Layout modules
    FlexLayoutModule,

    // Feature modules with configuration
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BlockUIModule.forRoot({
      template: BlockUiTemplateComponent
    }),
  ],

  /**
   * Services and values provided by this module
   * These are available for dependency injection throughout the application
   */
  providers: [
    // Location strategy configuration
    Location,
    {provide: LocationStrategy, useClass: PathLocationStrategy},

    // PerfectScrollbar configuration
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },

    // Dark mode configuration
    {
      provide: DARK_MODE_OPTIONS,
      useValue: {
        darkModeClass: 'my-dark-mode',
        lightModeClass: 'my-light-mode'
      }
    }
  ],

  /**
   * The root component that Angular creates and inserts into the index.html host web page
   */
  bootstrap: [AppComponent]
})

/**
 * Main application module class
 * This is the entry point for the Angular application
 */
export class AppModule {
}
