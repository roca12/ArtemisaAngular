import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';

import { authGuardGuard } from './auth-guard.guard';
import { AuthService } from '../../services/auth.service';

describe('authGuardGuard', () => {
  const executeGuard: CanActivateFn = (...params) =>
    TestBed.runInInjectionContext(() => authGuardGuard(...params));

  function configure(sesionValida: boolean) {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: { cargarSesion: () => of(sesionValida) },
        },
      ],
    });
  }

  function run(): Observable<boolean | UrlTree> {
    return executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    ) as Observable<boolean | UrlTree>;
  }

  it('permite el paso con sesión válida', async () => {
    configure(true);
    const result = await firstValueFrom(run());
    expect(result).toBeTrue();
  });

  it('redirige a /login (UrlTree) sin sesión', async () => {
    configure(false);
    const result = await firstValueFrom(run());
    expect(result instanceof UrlTree).toBeTrue();
    expect((result as UrlTree).toString()).toBe('/login');
  });
});
