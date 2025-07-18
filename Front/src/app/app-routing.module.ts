/**
 * Angular router module for defining application routes
 */
import {Routes} from '@angular/router';

/**
 * Feature components for main application pages
 */
import {PrimerosPasosComponent} from './component/primeros-pasos/primeros-pasos.component';
import {RecomendacionesComponent} from './component/recomendaciones/recomendaciones.component';
import {BibliotecaComponent} from './component/biblioteca/biblioteca.component';
import {CpTeoricaComponent} from './component/cp-teorica/cp-teorica.component';
import {ProblemasComponent} from './component/problemas/problemas.component';
import {LibrosComponent} from './component/libros/libros.component';
import {LinksComponent} from './component/links/links.component';
import {ArticulosComponent} from './component/articulos/articulos.component';
import {JuecesComponent} from './component/jueces/jueces.component';
import {EstadisticasComponent} from './component/estadisticas/estadisticas.component';
import {EventosComponent} from './component/eventos/eventos.component';
import {CompetenciasComponent} from './component/competencias/competencias.component';
import {AlianzasComponent} from './component/alianzas/alianzas.component';
import {AboutComponent} from './about/about.component';

/**
 * Error handling components for different HTTP status codes
 */
import {Error400Component} from './errors/error400/error400.component';
import {Error401Component} from './errors/error401/error401.component';
import {Error403Component} from './errors/error403/error403.component';
import {Error404Component} from './errors/error404/error404.component';
import {Error406Component} from './errors/error406/error406.component';
import {Error410Component} from './errors/error410/error410.component';
import {Error418Component} from './errors/error418/error418.component';
import {Error500Component} from './errors/error500/error500.component';
import {Error503Component} from './errors/error503/error503.component';
import {Error521Component} from './errors/error521/error521.component';

/**
 * Layout and core application components
 */
import {FullComponent} from './layouts/full/full.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LoginComponent} from "./component/login/login.component";
import {AdministrarTemasComponent} from "./component/administrar-temas/administrar-temas.component";
import {DashboardModule} from "./dashboard/dashboard.module";

/**
 * Authentication guard service for protecting routes
 */
import {
  AuthGuardService as AuthGuard
} from './auth/auth-guard.service';

/**
 * Application routes configuration
 * Defines all routes and their corresponding components
 */
export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent, // Main layout component that wraps all pages
    children: [
      /**
       * Admin routes - protected by authentication
       */
      {
        path: 'administrador',
        children: [{
          path: 'temas',
          component: AdministrarTemasComponent,
          canActivate: [AuthGuard], // Requires authentication to access
        }]
      },
      /**
       * Default route - Dashboard
       */
      {
        path: '',
        pathMatch: 'full',
        component: DashboardComponent
      },
      /**
       * About page
       */
      {
        path: 'about',
        component: AboutComponent
      },
      /**
       * Main feature routes
       */
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
      },
      {
        path: 'alianzas',
        component: AlianzasComponent
      },
      {
        path: 'articulos',
        component: ArticulosComponent
      },
      {
        path: 'cpteorica',
        component: CpTeoricaComponent
      },
      {
        path: 'jueces',
        component: JuecesComponent
      },
      {
        path: 'primerospasos',
        component: PrimerosPasosComponent
      },
      {
        path: 'recomendaciones',
        component: RecomendacionesComponent
      },
      /**
       * Authentication route
       */
      {
        path: 'login',
        component: LoginComponent,
      },
    ]
  },

  /**
   * Wildcard route - catches all undefined routes and shows 404 page
   */
  {
    path: '**',
    component: Error404Component
  },

  /**
   * Error routes - specific HTTP error status codes
   */
  {
    path: '400',
    component: Error400Component  // Bad Request
  }, {
    path: '401',
    component: Error401Component  // Unauthorized
  }
  , {
    path: '403',
    component: Error403Component  // Forbidden
  }
  , {
    path: '406',
    component: Error406Component  // Not Acceptable
  }
  , {
    path: '410',
    component: Error410Component  // Gone
  }
  , {
    path: '418',
    component: Error418Component  // I'm a teapot
  }
  , {
    path: '500',
    component: Error500Component  // Internal Server Error
  }
  , {
    path: '503',
    component: Error503Component  // Service Unavailable
  }
  , {
    path: '521',
    component: Error521Component  // Web Server Is Down
  },

];
