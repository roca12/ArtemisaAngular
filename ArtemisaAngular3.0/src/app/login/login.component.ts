import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxCaptchaModule, ReCaptcha2Component } from 'ngx-captcha';
import { UserService } from '../services/user.service';
import { RecaptchaService } from '../services/recaptcha.service';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';


/**
 * Componente que gestiona el inicio de sesión de los usuarios.
 * Incluye validación de formulario, integración con reCAPTCHA y manejo de tokens JWT.
 */
@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    RouterModule,
    FaIconComponent,
    NgxCaptchaModule,
    ReactiveFormsModule
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  /** Indica si la contraseña es visible en el campo de texto. */
  showPassword = false;

  /** Formulario reactivo para el inicio de sesión. */
  loginForm: FormGroup = new FormGroup({});

  /** Referencia al componente reCAPTCHA. */
  @ViewChild('captchaRef') captchaElem?: ReCaptcha2Component;

  /**
   * Constructor del componente de inicio de sesión.
   * @param theme Servicio para gestionar el tema visual.
   * @param fb Constructor de formularios reactivos.
   * @param userService Servicio para operaciones de usuario (login).
   * @param recaptchaService Servicio para validación de reCAPTCHA.
   * @param authService Servicio para gestión de autenticación y tokens.
   * @param toastr Servicio para mostrar notificaciones al usuario.
   * @param router Servicio de enrutamiento.
   */
  constructor(
    public theme: ThemeService,
    private fb: FormBuilder,
    private userService: UserService,
    private recaptchaService: RecaptchaService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.initilizeForm();
  }

  /**
   * Inicializa la estructura y validaciones del formulario de inicio de sesión.
   */
  initilizeForm() {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasenia: ['', Validators.required],
      recaptcha: ['', Validators.required],
    });
  }

  /**
   * Ejecuta el proceso de inicio de sesión si el formulario es válido.
   */
  login() {
    const { usuario, contrasenia } = this.loginForm.value;
    if (this.loginForm.invalid) {
      this.toastr.error(
        'Por favor, completa todos los campos correctamente.',
        'Error',
      );
      return;
    }
    console.log('Formulario de inicio de sesión:', usuario, contrasenia);
    this.userService.login(usuario, contrasenia).subscribe({
      next: (data) => {
        this.authService.guardarToken(data.token);
        this.toastr.success('Inicio de sesión exitoso.', 'Éxito');
        this.router.navigate(['']);
      },
      error: (error) => {
        if (error.status === 401) {
          this.toastr.error(
            'Credenciales incorrectas. Por favor, inténtalo de nuevo.',
            'Error',
          );
        } else {
          this.toastr.error(
            'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.',
            'Error',
          );
        }
      },
    });
  }

  /**
   * Alterna la visibilidad de la contraseña en el formulario.
   */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Maneja la resolución del reCAPTCHA y verifica el token con el servidor.
   * @param token El token generado por reCAPTCHA.
   */
  onRecaptchaResolved(token: string) {
    this.recaptchaService.verificarCaptcha(token).subscribe({
      next: (data) => {
        if (!data) {
          this.toastr.error(
            'Captcha inválido. Por favor, inténtalo de nuevo.',
            'Error',
          );
          this.captchaElem?.resetCaptcha();
          this.loginForm.get('recaptcha')?.setValue('');
        }
      },
    });
  }

  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
}
