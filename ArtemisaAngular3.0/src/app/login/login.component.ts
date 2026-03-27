import { Component, ViewChild } from '@angular/core';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {ThemeService} from '../services/theme.service';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgxCaptchaModule, ReCaptcha2Component} from 'ngx-captcha';
import { UserService } from '../services/user.service';
import { RecaptchaService } from '../services/recaptcha.service';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink, RouterModule, FaIconComponent, NgxCaptchaModule, ReactiveFormsModule, NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showPassword = false;

  loginForm: FormGroup = new FormGroup({});
  
  @ViewChild('captchaRef') captchaElem?: ReCaptcha2Component;

  constructor(
    public theme: ThemeService, 
    private fb: FormBuilder, 
    private userService: UserService, 
    private recaptchaService: RecaptchaService, 
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.initilizeForm();
  }

  initilizeForm() {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasenia: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }

  login(){
    const { usuario, contrasenia, recaptcha } = this.loginForm.value;
    if (this.loginForm.invalid) {
      this.toastr.error('Por favor, completa todos los campos correctamente.', 'Error');
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
          this.toastr.error('Credenciales incorrectas. Por favor, inténtalo de nuevo.', 'Error');
        } else {
          this.toastr.error('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.', 'Error');
        }
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onRecaptchaResolved(token: string) {
    this.recaptchaService.verificarCaptcha(token).subscribe({
      next: (data) => {
        if(!data){
          this.toastr.error('Captcha inválido. Por favor, inténtalo de nuevo.', 'Error');
          this.captchaElem?.resetCaptcha();
          this.loginForm.get('recaptcha')?.setValue('');
        }
      }
    });
  }


  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;


}
