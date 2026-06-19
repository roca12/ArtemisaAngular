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

export function recomendationInitializer() {
  return () => {
    const service = inject(RecomendationService);
    return service.initializeRecomendationsAsync();
  };
}

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
