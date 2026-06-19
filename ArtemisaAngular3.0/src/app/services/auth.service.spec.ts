import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('AuthService (sesión por cookie)', () => {
  let service: AuthService;
  let userSpy: jasmine.SpyObj<UserService>;

  function configure() {
    userSpy = jasmine.createSpyObj<UserService>('UserService', ['me', 'logout']);
    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useValue: userSpy }],
    });
    service = TestBed.inject(AuthService);
  }

  it('arranca sin sesión', () => {
    configure();
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.usuario()).toBeNull();
  });

  it('cargarSesion() guarda el usuario y marca sesión válida (200)', () => {
    configure();
    const usuario = { usuario: 'juan123', correo: 'a@b.c', rol: 'admin' };
    userSpy.me.and.returnValue(of({ ok: true, usuario }));

    let result: boolean | undefined;
    service.cargarSesion().subscribe((r) => (result = r));

    expect(result).toBeTrue();
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.usuario()).toEqual(usuario);
  });

  it('cargarSesion() limpia el estado y devuelve false ante 401', () => {
    configure();
    userSpy.me.and.returnValue(throwError(() => ({ status: 401 })));

    let result: boolean | undefined;
    service.cargarSesion().subscribe((r) => (result = r));

    expect(result).toBeFalse();
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.usuario()).toBeNull();
  });

  it('cerrarSesion() llama a logout y limpia el estado', () => {
    configure();
    userSpy.me.and.returnValue(of({ ok: true, usuario: { usuario: 'j', correo: 'a@b.c', rol: 'admin' } }));
    userSpy.logout.and.returnValue(of({ ok: true }));
    service.cargarSesion().subscribe();
    expect(service.isLoggedIn()).toBeTrue();

    service.cerrarSesion().subscribe();

    expect(userSpy.logout).toHaveBeenCalled();
    expect(service.isLoggedIn()).toBeFalse();
  });
});
