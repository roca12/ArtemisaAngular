import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

const USUARIO = {
  usuario: 'juan123',
  correo: 'juan@ejemplo.com',
  rol: 'admin',
};

describe('ProfileComponent', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;
  let userSpy: jasmine.SpyObj<UserService>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  function setup(meResult = of({ ok: true, usuario: USUARIO })) {
    userSpy = jasmine.createSpyObj<UserService>('UserService', [
      'me',
      'cambiarCorreo',
      'cambiarContrasenia',
    ]);
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'cerrarSesion',
    ]);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj<ToastrService>('ToastrService', [
      'success',
      'error',
    ]);

    userSpy.me.and.returnValue(meResult);

    TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit -> me()
  }

  it('con 200 pasa a estado "ready" y guarda el usuario', () => {
    setup();
    expect(component.status()).toBe('ready');
    expect(component.usuario()).toEqual(USUARIO);
  });

  it('precarga el correo actual en el formulario de correo', () => {
    setup();
    expect(component.emailForm.controls.correo.value).toBe('juan@ejemplo.com');
  });

  it('con 401 redirige a /login y no muestra el perfil', () => {
    setup(throwError(() => ({ status: 401 })));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.status()).not.toBe('ready');
  });

  it('con error de red pasa a estado "error"', () => {
    setup(throwError(() => ({ status: 0 })));
    expect(component.status()).toBe('error');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('detecta contraseñas que no coinciden', () => {
    setup();
    component.passwordForm.controls.nuevaContrasenia.setValue('Secreta1!');
    component.passwordForm.controls.confirmar.setValue('otra');
    expect(component.passwordForm.errors?.['mismatch']).toBeTrue();
  });

  it('cambiar correo usa el usuario de /usuario/me, no un input', () => {
    setup();
    userSpy.cambiarCorreo.and.returnValue(of({ ok: true }));
    component.emailForm.controls.correo.setValue('nuevo@ejemplo.com');
    component.onSubmitEmail();
    expect(userSpy.cambiarCorreo).toHaveBeenCalledWith(
      'juan123',
      'nuevo@ejemplo.com',
    );
    expect(toastrSpy.success).toHaveBeenCalled();
  });

  it('muestra el message de la API si cambiar correo falla', () => {
    setup();
    userSpy.cambiarCorreo.and.returnValue(
      throwError(() => ({
        status: 400,
        error: { ok: false, message: 'Correo en uso' },
      })),
    );
    component.emailForm.controls.correo.setValue('nuevo@ejemplo.com');
    component.onSubmitEmail();
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'Correo en uso',
      'No se pudo cambiar el correo',
    );
  });

  it('cambiar contraseña usa el usuario de /usuario/me y resetea el form', () => {
    setup();
    userSpy.cambiarContrasenia.and.returnValue(of({ ok: true }));
    component.passwordForm.controls.nuevaContrasenia.setValue('Secreta1!');
    component.passwordForm.controls.confirmar.setValue('Secreta1!');
    component.onSubmitPassword();
    expect(userSpy.cambiarContrasenia).toHaveBeenCalledWith(
      'juan123',
      'Secreta1!',
    );
    expect(component.passwordForm.controls.nuevaContrasenia.value).toBeNull();
  });

  it('cerrar sesión llama a cerrarSesion y redirige a /login', () => {
    setup();
    authSpy.cerrarSesion.and.returnValue(of(true));
    component.onLogout();
    expect(authSpy.cerrarSesion).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
