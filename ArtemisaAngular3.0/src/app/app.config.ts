import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RecomendationService } from './services/recomendation.service';
import { credentialsInterceptor } from './shared/interceptors/credentials.interceptor';

/**
 * Factory para `provideAppInitializer`: precarga las recomendaciones antes de
 * que la aplicación termine de arrancar.
 * @returns Una función que inicializa las recomendaciones de forma asíncrona.
 */
export function recomendationInitializer() {
  return () => {
    const service = inject(RecomendationService);
    return service.initializeRecomendationsAsync();
  };
}

/**
 * Configuración global de la aplicación: enrutador, cliente HTTP con el
 * interceptor de credenciales, notificaciones (Toastr), animaciones y la
 * precarga de recomendaciones durante el arranque.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([credentialsInterceptor])),
    provideToastr(),
    provideAnimations(),
    provideAppInitializer(recomendationInitializer()),
  ],
};
