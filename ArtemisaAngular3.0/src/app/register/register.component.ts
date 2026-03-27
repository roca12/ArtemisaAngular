import { Component, ViewChild, NgModule } from '@angular/core';
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
import { CommonModule, NgIf } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [
    FaIconComponent,
    RouterLink,
    FormsModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    CommonModule,
    ToastrModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  showPassword = false;

  registerForm: FormGroup = new FormGroup({});

  @ViewChild('captchaRef') captchaElem?: ReCaptcha2Component;

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
      { validator: this.passwordsMatchValidator },
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('passwordConfirm')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

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

  register() {
    const { username, email, password, passwordConfirm, recaptcha } =
      this.registerForm.value;
    const modalRef = this.modalService.open(ModalMailComponent);
    modalRef.componentInstance.correo = email;
    this.mailService.enviarCodigo(email, username).subscribe({
      next: (response) => {
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
