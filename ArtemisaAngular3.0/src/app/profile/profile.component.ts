import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faArrowRightFromBracket,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ProfileUser } from '../shared/models/profile-user.model';

/** Estado de carga del perfil. */
type ProfileStatus = 'loading' | 'ready' | 'error';
/** Pestañas reales del perfil (solo las que tienen respaldo de backend). */
type ProfileTab = 'cuenta' | 'seguridad';

/**
 * Página de Perfil de Usuario (sistema visual "paper & ink" del handoff).
 *
 * Al montar consulta `GET /usuario/me` (sesión por cookie httpOnly):
 *  - 401 → redirige a /login sin mostrar el perfil.
 *  - 200 → muestra usuario, correo y rol, y habilita la edición.
 *  - error de red → estado de error con opción de reintento.
 *
 * El `nombreDeUsuario` de los PATCH se toma de la respuesta de /usuario/me
 * (nunca de un input), para que nadie pueda editar la cuenta de otro.
 */
@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, FaIconComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  /** Servicio de usuario para consultar y actualizar la cuenta. */
  private readonly userService = inject(UserService);
  /** Servicio de autenticación para cerrar sesión. */
  private readonly authService = inject(AuthService);
  /** Router para redirigir (p. ej. a /login). */
  private readonly router = inject(Router);
  /** Servicio de notificaciones. */
  private readonly toastr = inject(ToastrService);
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);
  /** Servicio de tema (claro/oscuro), expuesto a la plantilla. */
  readonly theme = inject(ThemeService);

  /** Estado de la carga inicial. */
  readonly status = signal<ProfileStatus>('loading');
  /** Usuario autenticado (datos reales del backend). */
  readonly usuario = signal<ProfileUser | null>(null);

  /** Pestaña activa del panel principal. */
  readonly activeTab = signal<ProfileTab>('cuenta');

  /** Edición inline del correo (patrón del handoff). */
  readonly editingEmail = signal(false);

  /** Flags de envío para deshabilitar botones y mostrar spinners. */
  readonly savingEmail = signal(false);
  readonly savingPassword = signal(false);
  readonly loggingOut = signal(false);

  /** Visibilidad de los campos de contraseña. */
  show = { nueva: false, confirmar: false };

  /** Iniciales para el avatar (derivadas del nombre de usuario). */
  readonly initials = computed(() => {
    const u = this.usuario()?.usuario ?? '';
    const parts = u.split(/[._\-\s]+/).filter(Boolean);
    const chars = parts.length >= 2 ? parts[0][0] + parts[1][0] : u.slice(0, 2);
    return chars.toUpperCase() || '?';
  });

  /** Formulario de cambio de correo. */
  readonly emailForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
  });

  /** Formulario de cambio de contraseña (con validador de coincidencia). */
  readonly passwordForm = this.fb.group(
    {
      nuevaContrasenia: ['', [Validators.required, Validators.minLength(8)]],
      confirmar: ['', [Validators.required]],
    },
    { validators: ProfileComponent.passwordsMatch },
  );

  /** Ciclo de vida OnInit: carga el perfil del usuario autenticado. */
  ngOnInit(): void {
    this.cargarPerfil();
  }

  /** Carga (o recarga) los datos del perfil desde /usuario/me. */
  cargarPerfil(): void {
    this.status.set('loading');
    this.userService.me().subscribe({
      next: (res) => {
        this.usuario.set(res.usuario);
        this.emailForm.get('correo')!.setValue(res.usuario.correo);
        this.status.set('ready');
      },
      error: (err) => {
        if (err?.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.status.set('error');
        }
      },
    });
  }

  /**
   * Cambia la pestaña activa del panel principal.
   * @param tab Pestaña a activar ('cuenta' o 'seguridad').
   */
  setTab(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }

  /** Abre la edición inline del correo con el valor actual. */
  startEditEmail(): void {
    this.emailForm.get('correo')!.setValue(this.usuario()?.correo ?? '');
    this.editingEmail.set(true);
  }

  /** Cancela la edición y restablece el valor actual. */
  cancelEditEmail(): void {
    this.emailForm.get('correo')!.setValue(this.usuario()?.correo ?? '');
    this.editingEmail.set(false);
  }

  /** Envía el cambio de correo. Tras éxito, recarga /usuario/me. */
  onSubmitEmail(): void {
    const u = this.usuario();
    if (!u || this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    const correo = this.emailForm.get('correo')!.value!;
    this.savingEmail.set(true);
    this.userService.cambiarCorreo(u.usuario, correo).subscribe({
      next: () => {
        this.savingEmail.set(false);
        this.editingEmail.set(false);
        this.toastr.success('Correo actualizado.', 'Éxito');
        this.cargarPerfil();
      },
      error: (err) => {
        this.savingEmail.set(false);
        this.toastr.error(
          this.mensajeError(err),
          'No se pudo cambiar el correo',
        );
      },
    });
  }

  /** Envía el cambio de contraseña. Tras éxito, limpia el formulario. */
  onSubmitPassword(): void {
    const u = this.usuario();
    if (!u || this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const nueva = this.passwordForm.get('nuevaContrasenia')!.value!;
    this.savingPassword.set(true);
    this.userService.cambiarContrasenia(u.usuario, nueva).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.toastr.success('Contraseña actualizada.', 'Éxito');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.savingPassword.set(false);
        this.toastr.error(
          this.mensajeError(err),
          'No se pudo cambiar la contraseña',
        );
      },
    });
  }

  /** Cierra la sesión en el servidor y redirige a /login. */
  onLogout(): void {
    this.loggingOut.set(true);
    this.authService.cerrarSesion().subscribe(() => {
      this.loggingOut.set(false);
      this.router.navigate(['/login']);
    });
  }

  /**
   * Alterna la visibilidad de un campo de contraseña.
   * @param field Campo a alternar ('nueva' o 'confirmar').
   */
  toggle(field: 'nueva' | 'confirmar'): void {
    this.show[field] = !this.show[field];
  }

  /**
   * Fuerza de la contraseña (0–3): +1 si ≥8 caracteres, +1 si mezcla
   * mayúsculas y minúsculas, +1 si combina dígito y símbolo.
   */
  passwordScore(value: string): number {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
    return score;
  }

  /**
   * Devuelve la etiqueta textual de fuerza de la contraseña.
   * @param score Puntaje de fuerza (0–3).
   * @returns Etiqueta correspondiente ('Débil', 'Aceptable', 'Buena', 'Excelente').
   */
  strengthLabel(score: number): string {
    return ['Débil', 'Aceptable', 'Buena', 'Excelente'][score] ?? 'Débil';
  }

  /** Extrae el `message` que devuelve la API, con un fallback genérico. */
  private mensajeError(err: unknown): string {
    const message = (err as { error?: { message?: string } })?.error?.message;
    return message ?? 'Ocurrió un error. Inténtalo de nuevo más tarde.';
  }

  /** Validador de grupo: la confirmación debe coincidir con la nueva contraseña. */
  static passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const nueva = group.get('nuevaContrasenia')?.value;
    const confirmar = group.get('confirmar')?.value;
    return nueva === confirmar ? null : { mismatch: true };
  }

  /** Icono de "ojo" para mostrar la contraseña. */
  protected readonly faEye = faEye;
  /** Icono de "ojo tachado" para ocultar la contraseña. */
  protected readonly faEyeSlash = faEyeSlash;
  /** Icono de usuario para la pestaña de cuenta. */
  protected readonly faUser = faUser;
  /** Icono de candado para la pestaña de seguridad. */
  protected readonly faLock = faLock;
  /** Icono de cerrar sesión. */
  protected readonly faArrowRightFromBracket = faArrowRightFromBracket;
}
