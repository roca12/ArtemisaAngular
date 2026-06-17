# Pending Verification Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persistir el estado de verificación de correo en `localStorage` para que el modal de verificación pueda reabrirse si el usuario recarga la página o navega al login antes de completarla.

**Architecture:** Guardar `{ correo, usuario }` en `localStorage` bajo la clave `pendingVerification` tras un registro exitoso. Tanto `RegisterComponent` como `LoginComponent` verifican este estado en `ngOnInit` y abren el `ModalMailComponent` si existe. El modal elimina la clave al verificar con éxito.

**Tech Stack:** Angular 17+ (standalone components), `localStorage` nativo, `NgbModal` (`@ng-bootstrap/ng-bootstrap`)

---

### Task 1: Guardar estado y reabrir modal en RegisterComponent

**Files:**

- Modify: `src/app/register/register.component.ts`

- [ ] **Step 1: Agregar `OnInit` al import de `@angular/core` y añadir `implements OnInit`**

Reemplazar la línea:

```typescript
import { Component, ViewChild } from "@angular/core";
```

Por:

```typescript
import { Component, OnInit, ViewChild } from "@angular/core";
```

Y cambiar la declaración de la clase:

```typescript
export class RegisterComponent implements OnInit {
```

- [ ] **Step 2: Extraer la lógica de apertura del modal a un método privado**

Agregar este método dentro de la clase, antes de `register()`:

```typescript
private openVerificationModal(correo: string, usuario: string) {
  const modalRef = this.modalService.open(ModalMailComponent);
  modalRef.componentInstance.correo = correo;
  modalRef.componentInstance.usuario = usuario;
  modalRef.result.then(
    () => { this.router.navigate(['/login']); },
    () => {},
  );
}
```

- [ ] **Step 3: Agregar `ngOnInit` que comprueba el estado pendiente**

Agregar este método después del constructor:

```typescript
ngOnInit() {
  const pending = localStorage.getItem('pendingVerification');
  if (pending) {
    const { correo, usuario } = JSON.parse(pending);
    this.openVerificationModal(correo, usuario);
  }
}
```

- [ ] **Step 4: Actualizar el método `register()` para guardar en localStorage y usar el método extraído**

Reemplazar el bloque `next` dentro de `this.userService.register(req).subscribe(...)`:

```typescript
next: () => {
  this.loading = false;
  localStorage.setItem(
    'pendingVerification',
    JSON.stringify({ correo: email, usuario: username }),
  );
  this.openVerificationModal(email, username);
},
```

- [ ] **Step 5: Verificar que el archivo compila sin errores**

```bash
npx tsc --noEmit
```

Esperado: sin errores de compilación.

- [ ] **Step 6: Commit**

```bash
git add src/app/register/register.component.ts
git commit -m "feat(register): persistir verificación pendiente en localStorage y reabrir modal en ngOnInit"
```

---

### Task 2: Comprobar estado pendiente en LoginComponent

**Files:**

- Modify: `src/app/login/login.component.ts`

- [ ] **Step 1: Agregar `OnInit` al import de `@angular/core`**

Reemplazar:

```typescript
import { Component, ViewChild } from "@angular/core";
```

Por:

```typescript
import { Component, OnInit, ViewChild } from "@angular/core";
```

- [ ] **Step 2: Agregar imports de `NgbModal` y `ModalMailComponent`**

Agregar al bloque de imports existente:

```typescript
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalMailComponent } from "../modal-mail/modal-mail.component";
```

- [ ] **Step 3: Inyectar `NgbModal` en el constructor**

El constructor actualmente termina en:

```typescript
  constructor(
    public theme: ThemeService,
    private fb: FormBuilder,
    private userService: UserService,
    private recaptchaService: RecaptchaService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {
```

Cambiarlo a:

```typescript
  constructor(
    public theme: ThemeService,
    private fb: FormBuilder,
    private userService: UserService,
    private recaptchaService: RecaptchaService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
  ) {
```

- [ ] **Step 4: Añadir `implements OnInit` a la clase**

Cambiar:

```typescript
export class LoginComponent {
```

Por:

```typescript
export class LoginComponent implements OnInit {
```

- [ ] **Step 5: Agregar `ngOnInit` que comprueba el estado pendiente**

Agregar después del constructor:

```typescript
ngOnInit() {
  const pending = localStorage.getItem('pendingVerification');
  if (pending) {
    const { correo, usuario } = JSON.parse(pending);
    const modalRef = this.modalService.open(ModalMailComponent);
    modalRef.componentInstance.correo = correo;
    modalRef.componentInstance.usuario = usuario;
    modalRef.result.then(
      () => { this.router.navigate(['/login']); },
      () => {},
    );
  }
}
```

- [ ] **Step 6: Verificar que el archivo compila sin errores**

```bash
npx tsc --noEmit
```

Esperado: sin errores de compilación.

- [ ] **Step 7: Commit**

```bash
git add src/app/login/login.component.ts
git commit -m "feat(login): abrir modal de verificación pendiente al cargar si hay estado en localStorage"
```

---

### Task 3: Limpiar localStorage en ModalMailComponent al verificar con éxito

**Files:**

- Modify: `src/app/modal-mail/modal-mail.component.ts`

- [ ] **Step 1: Agregar `localStorage.removeItem` en el handler de éxito de `enviarCodigo`**

Localizar el bloque `next` dentro de `this.userService.verifyEmail(...).subscribe(...)` (línea 58):

```typescript
next: () => {
  this.cargando = false;
  this.toastr.success('Correo verificado exitosamente.', 'Éxito');
  this.activeModal.close('verified');
},
```

Reemplazarlo por:

```typescript
next: () => {
  this.cargando = false;
  localStorage.removeItem('pendingVerification');
  this.toastr.success('Correo verificado exitosamente.', 'Éxito');
  this.activeModal.close('verified');
},
```

- [ ] **Step 2: Verificar que el archivo compila sin errores**

```bash
npx tsc --noEmit
```

Esperado: sin errores de compilación.

- [ ] **Step 3: Commit**

```bash
git add src/app/modal-mail/modal-mail.component.ts
git commit -m "feat(modal-mail): limpiar estado pendingVerification de localStorage al verificar correo exitosamente"
```

---

### Task 4: Verificación manual del flujo completo

- [ ] **Step 1: Levantar la app**

```bash
ng serve
```

- [ ] **Step 2: Probar flujo de recarga en /registrar**

1. Ir a `http://localhost:4200/registrar`
2. Completar el formulario y resolver el captcha
3. Hacer clic en Registrar (el backend debe estar activo)
4. Cuando aparezca el modal de verificación, recargar la página con F5
5. Esperado: el modal vuelve a abrirse automáticamente con el mismo correo

- [ ] **Step 3: Probar flujo de navegación a /login**

1. Repetir los pasos 1-4 anteriores pero, en vez de recargar, navegar a `http://localhost:4200/login`
2. Esperado: el modal de verificación se abre automáticamente

- [ ] **Step 4: Probar que el estado se limpia tras verificar**

1. Completar la verificación con el código correcto
2. Abrir DevTools → Application → Local Storage
3. Esperado: la clave `pendingVerification` ya no existe

- [ ] **Step 5: Probar que no aparece el modal en sesiones limpias**

1. Verificar que `pendingVerification` no existe en localStorage
2. Navegar a `/login` y a `/registrar`
3. Esperado: el modal NO se abre
