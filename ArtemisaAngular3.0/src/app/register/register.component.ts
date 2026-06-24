import { Component, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ModalMailComponent } from '../modal-mail/modal-mail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { RegisterRequest } from '../shared/dto/RegisterRequest';

/**
 * Componente de registro de usuarios.
 *
 * Construye y valida el formulario de alta, envía la petición al backend y, tras
 * un registro exitoso, abre el modal de verificación por correo. Si existe una
 * verificación pendiente en `localStorage`, la reanuda al iniciar.
 */
@Component({
  selector: 'app-register',
  imports: [
    FaIconComponent,
    RouterLink,
    FormsModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    CommonModule,
    ToastrModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  /** Controla la visibilidad del campo de contraseña. */
  showPassword = false;
  /** Indica si hay una petición de registro en curso. */
  loading = false;
  /** Mensaje de error a mostrar al usuario, o `null` si no hay error. */
  errorMsg: string | null = null;

  /** Formulario reactivo de registro. */
  registerForm: FormGroup = new FormGroup({});

  /**
   * Inyecta dependencias e inicializa el formulario de registro.
   * @param theme Servicio de tema (claro/oscuro), expuesto a la plantilla.
   * @param fb Constructor de formularios reactivos.
   * @param modalService Servicio para abrir el modal de verificación.
   * @param userService Servicio de usuario para la petición de registro.
   * @param router Router para la navegación tras la verificación.
   */
  constructor(
    public theme: ThemeService,
    private readonly fb: FormBuilder,
    private readonly modalService: NgbModal,
    private readonly userService: UserService,
    private readonly router: Router,
  ) {
    this.initiaizeForm();
  }

  /**
   * Al iniciar, reanuda una verificación pendiente guardada en `localStorage`
   * abriendo el modal correspondiente; limpia el estado si los datos son inválidos.
   */
  ngOnInit() {
    try {
      const raw = localStorage.getItem('pendingVerification');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const correo: string = parsed?.correo;
      const usuario: string = parsed?.usuario;
      if (correo && usuario) {
        this.openVerificationModal(correo, usuario);
      } else {
        localStorage.removeItem('pendingVerification');
      }
    } catch {
      localStorage.removeItem('pendingVerification');
    }
  }

  /**
   * Crea el formulario reactivo con sus validadores (usuario, correo, contraseña,
   * confirmación y reCAPTCHA), incluyendo el validador de coincidencia de contraseñas.
   */
  initiaizeForm() {
    this.registerForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern('^[a-zA-Z0-9]+$'),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$#!%*?&])[A-Za-z\\d@$#!%*?&]{10,32}$',
            ),
          ],
        ],
        passwordConfirm: ['', Validators.required],
        recaptcha: ['', Validators.required],
      },
      { validator: RegisterComponent.passwordsMatchValidator },
    );
  }

  /** Alterna la visibilidad del campo de contraseña. */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Validador de grupo que comprueba que la contraseña y su confirmación coincidan.
   * @param formGroup Grupo de formulario que contiene `password` y `passwordConfirm`.
   * @returns `null` si coinciden, o `{ passwordsMismatch: true }` si no.
   */
  static passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('passwordConfirm')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  /**
   * Abre el modal de verificación por correo y, al confirmarse, navega a `/login`.
   * @param correo Correo del usuario a verificar.
   * @param usuario Nombre de usuario a verificar.
   */
  private openVerificationModal(correo: string, usuario: string) {
    const modalRef = this.modalService.open(ModalMailComponent);
    modalRef.componentInstance.correo = correo;
    modalRef.componentInstance.usuario = usuario;
    modalRef.result.then(
      () => {
        this.router.navigate(['/login']);
      },
      () => {},
    );
  }

  /**
   * Envía la petición de registro al backend si el formulario es válido.
   * Al tener éxito, guarda la verificación pendiente y abre el modal; ante un
   * error, muestra un mensaje (409 = usuario/correo ya registrado).
   */
  register() {
    if (this.registerForm.invalid) return;

    const { username, email, password } = this.registerForm.value;
    const req: RegisterRequest = {
      usuario: username,
      correo: email,
      contrasenia: password,
      verificacion: '',
    };

    this.loading = true;
    this.errorMsg = null;

    this.userService.register(req).subscribe({
      next: () => {
        this.loading = false;
        localStorage.setItem(
          'pendingVerification',
          JSON.stringify({ correo: email, usuario: username }),
        );
        this.openVerificationModal(email, username);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.errorMsg = 'El usuario o correo ya está registrado.';
        } else {
          this.errorMsg =
            'Error al registrarse. Por favor, inténtalo de nuevo.';
        }
      },
    });
  }

  /** Icono de "ojo" para mostrar la contraseña. */
  protected readonly faEye = faEye;
  /** Icono de "ojo tachado" para ocultar la contraseña. */
  protected readonly faEyeSlash = faEyeSlash;
}
