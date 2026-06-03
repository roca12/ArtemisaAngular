import { Component, ViewChild } from '@angular/core';
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
import { NgxCaptchaModule, ReCaptcha2Component } from 'ngx-captcha';
import { RecaptchaService } from '../services/recaptcha.service';
import { ModalMailComponent } from '../modal-mail/modal-mail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { RegisterRequest } from '../shared/dto/RegisterRequest';

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
export class RegisterComponent {
  showPassword = false;
  loading = false;
  errorMsg: string | null = null;

  registerForm: FormGroup = new FormGroup({});

  @ViewChild('captchaRef') captchaElem?: ReCaptcha2Component;

  constructor(
    public theme: ThemeService,
    private fb: FormBuilder,
    private recaptchaService: RecaptchaService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
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
      { validator: RegisterComponent.passwordsMatchValidator },
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  static passwordsMatchValidator(formGroup: FormGroup) {
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
    if (this.registerForm.invalid) return;

    const { username, email, password } = this.registerForm.value;
    const req: RegisterRequest = {
      usuario: username,
      correo: email,
      contrasena: password,
      verificacion: '',
    };

    this.loading = true;
    this.errorMsg = null;

    this.userService.register(req).subscribe({
      next: () => {
        this.loading = false;
        const modalRef = this.modalService.open(ModalMailComponent);
        modalRef.componentInstance.correo = email;
        modalRef.componentInstance.usuario = username;
        modalRef.result.then(
          () => { this.router.navigate(['/login']); },
          () => {},
        );
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.errorMsg = 'El usuario o correo ya está registrado.';
        } else {
          this.errorMsg = 'Error al registrarse. Por favor, inténtalo de nuevo.';
        }
      },
    });
  }

  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
}
