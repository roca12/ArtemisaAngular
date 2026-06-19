import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';

describe('UserService (endpoints de perfil)', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiUrl}usuario/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('me() hace GET a usuario/me', () => {
    const fake = { ok: true, usuario: { usuario: 'juan123', correo: 'a@b.c', rol: 'admin' } };
    let result: unknown;
    service.me().subscribe((r) => (result = r));

    const req = httpMock.expectOne(`${base}me`);
    expect(req.request.method).toBe('GET');
    req.flush(fake);
    expect(result).toEqual(fake);
  });

  it('cambiarCorreo() hace PATCH con nombreDeUsuario y correo', () => {
    service.cambiarCorreo('juan123', 'nuevo@b.c').subscribe();

    const req = httpMock.expectOne(`${base}cambiar-correo`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ nombreDeUsuario: 'juan123', correo: 'nuevo@b.c' });
    req.flush({ ok: true });
  });

  it('cambiarContrasenia() hace PATCH con nombreDeUsuario y nuevaContrasenia', () => {
    service.cambiarContrasenia('juan123', 'Secreta1!').subscribe();

    const req = httpMock.expectOne(`${base}cambiar-contrasenia`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({
      nombreDeUsuario: 'juan123',
      nuevaContrasenia: 'Secreta1!',
    });
    req.flush({ ok: true });
  });

  it('logout() hace POST a usuario/logout', () => {
    service.logout().subscribe();

    const req = httpMock.expectOne(`${base}logout`);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
