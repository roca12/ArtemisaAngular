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
export class RegisterComponent implements OnInit {
  showPassword = false;
  loading = false;
  errorMsg: string | null = null;

  registerForm: FormGroup = new FormGroup({});

  constructor(
    public theme: ThemeService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
  ) {
    this.initiaizeForm();
  }

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

  // server-side captcha endpoint not available; client-side widget validation is sufficient
  onRecaptchaResolved(_token: string) {}

  private openVerificationModal(correo: string, usuario: string) {
    const modalRef = this.modalService.open(ModalMailComponent);
    modalRef.componentInstance.correo = correo;
    modalRef.componentInstance.usuario = usuario;
    modalRef.result.then(
      () => { this.router.navigate(['/login']); },
      () => {},
    );
  }

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
          this.errorMsg = 'Error al registrarse. Por favor, inténtalo de nuevo.';
        }
      },
    });
  }

  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
}
