import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';

import { authGuardGuard } from './auth-guard.guard';
import { AuthService } from '../../services/auth.service';

describe('authGuardGuard', () => {
  const executeGuard: CanActivateFn = (...params) =>
    TestBed.runInInjectionContext(() => authGuardGuard(...params));

  function configure(sesionValida: boolean) {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { cargarSesion: () => of(sesionValida) } },
      ],
    });
  }

  it('permite el paso con sesión válida', async () => {
    configure(true);
    const result = await firstValueFrom(executeGuard({} as any, {} as any) as any);
    expect(result).toBeTrue();
  });

  it('redirige a /login (UrlTree) sin sesión', async () => {
    configure(false);
    const result = await firstValueFrom(executeGuard({} as any, {} as any) as any);
    expect(result instanceof UrlTree).toBeTrue();
    expect((result as UrlTree).toString()).toBe('/login');
  });
});
