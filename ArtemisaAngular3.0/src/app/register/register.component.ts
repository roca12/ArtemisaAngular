import { Component, ViewChild } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxCaptchaModule, ReCaptcha2Component } from 'ngx-captcha';
import { RecaptchaService } from '../services/recaptcha.service';
import { ModalMailComponent } from '../modal-mail/modal-mail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MailService } from '../services/mail.service';

import { ToastrModule, ToastrService } from 'ngx-toastr';

/**
 * Componente que gestiona el registro de nuevos usuarios en la plataforma.
 * Incluye validaciones complejas de formulario, integración con reCAPTCHA y
 * flujo de verificación por correo electrónico mediante un modal.
 */
@Component({
  selector: 'app-register',
  imports: [
    FaIconComponent,
    RouterLink,
    FormsModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  /** Indica si la contraseña es visible en el campo de texto. */
  showPassword = false;

  /** Formulario reactivo para el registro de usuario. */
  registerForm: FormGroup = new FormGroup({});

  /** Referencia al componente reCAPTCHA. */
  @ViewChild('captchaRef') captchaElem?: ReCaptcha2Component;

  /**
   * Constructor del componente de registro.
   * @param theme Servicio para gestionar el tema visual.
   * @param fb Constructor de formularios reactivos.
   * @param recaptchaService Servicio para validación de reCAPTCHA.
   * @param modalService Servicio de NgbModal para abrir ventanas emergentes.
   * @param mailService Servicio para gestionar el envío de códigos de verificación.
   * @param toastr Servicio para mostrar notificaciones.
   */
  constructor(
    public theme: ThemeService,
    private fb: FormBuilder,
    private recaptchaService: RecaptchaService,
    private modalService: NgbModal,
    private mailService: MailService,
    private toastr: ToastrService,
  ) {
    this.initiaizeForm();
  }

  /**
   * Inicializa la estructura del formulario con validaciones de longitud, patrones y coincidencia de contraseñas.
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

  /**
   * Alterna la visibilidad de la contraseña.
   */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Validador personalizado para asegurar que la contraseña y su confirmación coincidan.
   * @param formGroup El grupo de formulario que contiene los campos de contraseña.
   * @returns Un objeto de error si no coinciden, null si son iguales.
   */
  static passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('passwordConfirm')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  /**
   * Maneja la resolución del reCAPTCHA y verifica el token.
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
          this.registerForm.get('recaptcha')?.setValue('');
        }
      },
    });
  }

  /**
   * Inicia el proceso de registro enviando un código de verificación al correo ingresado
   * y abriendo el modal de validación.
   */
  register() {
    const { username, email, password, recaptcha } = this.registerForm.value;
    const modalRef = this.modalService.open(ModalMailComponent);
    modalRef.componentInstance.correo = email;
    this.mailService.enviarCodigo(email, username).subscribe({
      next: () => {
        modalRef.componentInstance.usuario = {
          contrasenia: password,
          rol: 'usuario',
          usuario: username,
          correo: email,
          verificacion: recaptcha,
        };
        modalRef.result
          .then((result) => {
            if (result === 'Usuario creado y válidado exitosamente.') {
              this.toastr.success(
                'Usuario creado y validado exitosamente.',
                'Éxito',
              );
            }
          })
          .catch((error) => {
            if (error.status === 409) {
              this.toastr.warning(
                'El nombre de usuario o correo electrónico ya está en uso.',
                'Aviso',
              );
            }
          });
      },
      error: (error) => {
        if (error.status === 409) {
          this.toastr.error(
            'El nombre de usuario o correo electrónico ya está en uso.',
            'Error',
          );
          console.error(error);
        } else {
          this.toastr.error(
            'Error al enviar el código de verificación. Por favor, inténtalo de nuevo.',
            'Error',
          );
        }
      },
    });
  }

  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
}
