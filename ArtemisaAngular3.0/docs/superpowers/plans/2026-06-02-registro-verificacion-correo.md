# Registro con Verificación de Correo — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar el flujo form-first de registro: el usuario llena el formulario → se crea la cuenta inactiva en el backend → se abre un modal para verificar el correo → al verificar se redirige al login.

**Architecture:** RegisterComponent llama a UserService.register() para crear la cuenta, luego abre ModalMailComponent pasando correo y usuario. El modal llama a UserService.verifyEmail() con el código ingresado y cierra el modal al éxito. RegisterComponent escucha el resultado del modal (modalRef.result) y navega a /login.

**Tech Stack:** Angular 17+ standalone, NgbModal (ng-bootstrap), ReactiveFormsModule, ngx-toastr, FontAwesome.

---

### Task 1: Corregir URL bug en UserService.verifyEmail()

**Files:**

- Modify: `src/app/services/user.service.ts:40`

- [ ] **Step 1: Corregir la URL**

Cambiar:

```typescript
return this.http.post<EmailVerificationResponse>(`${this.baseUrl}/verificar-correo}`, { correo, codigo });
```

Por:

```typescript
return this.http.post<EmailVerificationResponse>(`${this.baseUrl}verificar-correo`, { correo, codigo });
```

- [ ] **Step 2: Commit**

```bash
git add src/app/services/user.service.ts
git commit -m "fix: corregir URL de verifyEmail en UserService"
```

---

### Task 2: Habilitar rutas de login y registro

**Files:**

- Modify: `src/app/app.routes.ts`

- [ ] **Step 1: Descomentar las rutas**

Reemplazar las rutas comentadas con:

```typescript
import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { TemarioComponent } from "./temario/temario.component";
import { ProblemasComponent } from "./problemas/problemas.component";
import { LinksComponent } from "./links/links.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "temario", component: TemarioComponent },
  { path: "login", component: LoginComponent },
  { path: "registrar", component: RegisterComponent },
  { path: "problemas", component: ProblemasComponent },
  { path: "links", component: LinksComponent },
  { path: "calendar", component: CalendarComponent },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app.routes.ts
git commit -m "feat: habilitar rutas de login y registro"
```

---

### Task 3: Actualizar ModalMailComponent — verificación en el modal

**Files:**

- Modify: `src/app/modal-mail/modal-mail.component.ts`
- Modify: `src/app/modal-mail/modal-mail.component.html`

El modal ya NO registra al usuario. Solo verifica el código y cierra el modal con éxito.

- [ ] **Step 1: Reescribir modal-mail.component.ts**

```typescript
import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MailService } from "../services/mail.service";
import { UserService } from "../services/user.service";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { ThemeService } from "../services/theme.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-modal-mail",
  imports: [FormsModule, ReactiveFormsModule, ToastrModule, CommonModule],
  templateUrl: "./modal-mail.component.html",
  styleUrl: "./modal-mail.component.css",
})
export class ModalMailComponent {
  @Input() correo = "";
  @Input() usuario = "";

  cargando = false;
  errorMsg: string | null = null;
  validationForm: FormGroup = new FormGroup({});

  constructor(
    public activeModal: NgbActiveModal,
    private mailService: MailService,
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    public theme: ThemeService,
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.validationForm = this.fb.group({
      num1: ["", Validators.required],
      num2: ["", Validators.required],
      num3: ["", Validators.required],
      num4: ["", Validators.required],
    });
  }

  enviarCodigo() {
    if (this.validationForm.invalid) return;

    const codigo = `${this.validationForm.value.num1}${this.validationForm.value.num2}${this.validationForm.value.num3}${this.validationForm.value.num4}`;
    this.cargando = true;
    this.errorMsg = null;

    this.userService.verifyEmail(this.correo, codigo).subscribe({
      next: () => {
        this.cargando = false;
        this.toastr.success("Correo verificado exitosamente.", "Éxito");
        this.activeModal.close("verified");
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 400 || err.status === 410) {
          this.errorMsg = "Código inválido o expirado.";
        } else {
          this.errorMsg = "Error al verificar. Inténtalo de nuevo.";
        }
      },
    });
  }

  reenviarCodigo() {
    this.mailService.reenviarCodigo(this.correo, this.usuario).subscribe({
      next: () => {
        this.toastr.success("Código reenviado con éxito.", "Éxito");
      },
      error: () => {
        this.toastr.error("Error al reenviar el código.", "Error");
      },
    });
  }
}
```

- [ ] **Step 2: Actualizar modal-mail.component.html — agregar mensaje de error**

```html
<div [class.dark]="theme.isDark()" [class.light]="!theme.isDark()" class="modal-content-custom">
  <div class="modal-header">
    <h4 class="modal-title">Verificación de correo</h4>
  </div>
  <div class="modal-body">
    <p>Ingresa el código de verificación enviado a tu correo:</p>
    <form [formGroup]="validationForm" class="d-flex justify-content-center gap-2">
      <input type="text" maxlength="1" formControlName="num1" class="form-control text-center" style="width: 50px" />
      <input type="text" maxlength="1" formControlName="num2" class="form-control text-center" style="width: 50px" />
      <input type="text" maxlength="1" formControlName="num3" class="form-control text-center" style="width: 50px" />
      <input type="text" maxlength="1" formControlName="num4" class="form-control text-center" style="width: 50px" />
    </form>
    <div *ngIf="errorMsg" class="text-danger text-center mt-2">
      <small>{{ errorMsg }}</small>
    </div>
    <p class="text-center mt-2">Si no recibiste el código, puedes reenviarlo.</p>
    <p class="text-center">Recuerda que el código es válido durante 5 minutos</p>
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary" (click)="reenviarCodigo()" [disabled]="cargando">Reenviar código</button>
    <button class="btn btn-primary" (click)="enviarCodigo()" [disabled]="validationForm.invalid || cargando">{{ cargando ? 'Verificando...' : 'Verificar' }}</button>
  </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/modal-mail/modal-mail.component.ts src/app/modal-mail/modal-mail.component.html
git commit -m "feat: modal verifica correo con UserService.verifyEmail y cierra al éxito"
```

---

### Task 4: Actualizar RegisterComponent — llamar register() antes de abrir el modal

**Files:**

- Modify: `src/app/register/register.component.ts`
- Modify: `src/app/register/register.component.html`

- [ ] **Step 1: Reescribir register.component.ts**

```typescript
import { Component, ViewChild } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Router, RouterLink } from "@angular/router";
import { ThemeService } from "../services/theme.service";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgxCaptchaModule, ReCaptcha2Component } from "ngx-captcha";
import { RecaptchaService } from "../services/recaptcha.service";
import { ModalMailComponent } from "../modal-mail/modal-mail.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { UserService } from "../services/user.service";
import { RegisterRequest } from "../shared/dto/RegisterRequest";

@Component({
  selector: "app-register",
  imports: [FaIconComponent, RouterLink, FormsModule, NgxCaptchaModule, ReactiveFormsModule, CommonModule, ToastrModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  showPassword = false;
  loading = false;
  errorMsg: string | null = null;

  registerForm: FormGroup = new FormGroup({});

  @ViewChild("captchaRef") captchaElem?: ReCaptcha2Component;

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
        username: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9]+$")]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(10), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$#!%*?&])[A-Za-z\\d@$#!%*?&]{10,32}$")]],
        passwordConfirm: ["", Validators.required],
        recaptcha: ["", Validators.required],
      },
      { validator: RegisterComponent.passwordsMatchValidator },
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  static passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get("password")?.value;
    const confirmPassword = formGroup.get("passwordConfirm")?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onRecaptchaResolved(token: string) {
    this.recaptchaService.verificarCaptcha(token).subscribe({
      next: (data) => {
        if (!data) {
          this.toastr.error("Captcha inválido. Por favor, inténtalo de nuevo.", "Error");
          this.captchaElem?.resetCaptcha();
          this.registerForm.get("recaptcha")?.setValue("");
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
      verificacion: "",
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
          () => {
            this.router.navigate(["/login"]);
          },
          () => {},
        );
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.errorMsg = "El usuario o correo ya está registrado.";
        } else {
          this.errorMsg = "Error al registrarse. Por favor, inténtalo de nuevo.";
        }
      },
    });
  }

  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
}
```

- [ ] **Step 2: Actualizar register.component.html — mostrar loading y error**

Reemplazar el botón y agregar el mensaje de error antes de él:

```html
<div *ngIf="errorMsg" class="text-danger text-center">
  <small>{{ errorMsg }}</small>
</div>
<button [disabled]="registerForm.invalid || loading" (click)="register()" type="submit">{{ loading ? 'Registrando...' : 'Registrar' }}</button>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/register/register.component.ts src/app/register/register.component.html
git commit -m "feat: RegisterComponent llama register() antes de abrir modal de verificación"
```
