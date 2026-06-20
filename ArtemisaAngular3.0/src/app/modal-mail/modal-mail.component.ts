import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MailService } from '../services/mail.service';
import { UserService } from '../services/user.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';

/**
 * Modal de verificación de correo: solicita el código de 4 dígitos enviado al
 * usuario, lo valida contra el backend y permite reenviarlo.
 */
@Component({
  selector: 'app-modal-mail',
  imports: [FormsModule, ReactiveFormsModule, ToastrModule, CommonModule],
  templateUrl: './modal-mail.component.html',
  styleUrl: './modal-mail.component.css',
})
export class ModalMailComponent {
  /** Correo al que se envió el código de verificación. */
  @Input() correo = '';
  /** Nombre de usuario asociado a la verificación. */
  @Input() usuario = '';

  /** Indica si hay una petición de verificación en curso. */
  cargando = false;
  /** Mensaje de error a mostrar, o `null` si no hay error. */
  errorMsg: string | null = null;
  /** Formulario reactivo con los cuatro dígitos del código. */
  validationForm: FormGroup = new FormGroup({});

  /**
   * Inyecta dependencias e inicializa el formulario de verificación.
   * @param activeModal Referencia al modal activo, para cerrarlo o descartarlo.
   * @param mailService Servicio de correo para reenviar el código.
   * @param fb Constructor de formularios reactivos.
   * @param userService Servicio de usuario para verificar el código.
   * @param toastr Servicio de notificaciones.
   * @param theme Servicio de tema (claro/oscuro), expuesto a la plantilla.
   */
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

  /** Crea el formulario reactivo con los cuatro dígitos del código. */
  initializeForm() {
    this.validationForm = this.fb.group({
      num1: ['', Validators.required],
      num2: ['', Validators.required],
      num3: ['', Validators.required],
      num4: ['', Validators.required],
    });
  }

  /**
   * Envía el código ingresado para verificar el correo. Si es válido cierra el
   * modal con `'verified'`; si no, muestra el mensaje de error correspondiente.
   */
  enviarCodigo() {
    if (this.validationForm.invalid) return;

    const codigo = `${this.validationForm.value.num1}${this.validationForm.value.num2}${this.validationForm.value.num3}${this.validationForm.value.num4}`;
    this.cargando = true;
    this.errorMsg = null;

    this.userService.verifyEmail(this.correo, codigo).subscribe({
      next: () => {
        this.cargando = false;
        localStorage.removeItem('pendingVerification');
        this.toastr.success('Correo verificado exitosamente.', 'Éxito');
        this.activeModal.close('verified');
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 400 || err.status === 410) {
          this.errorMsg = 'Código inválido o expirado.';
        } else {
          this.errorMsg = 'Error al verificar. Inténtalo de nuevo.';
        }
      },
    });
  }

  /** Solicita al backend reenviar el código de verificación al correo. */
  reenviarCodigo() {
    this.mailService.reenviarCodigo(this.correo, this.usuario).subscribe({
      next: () => {
        this.toastr.success('Código reenviado con éxito.', 'Éxito');
      },
      error: () => {
        this.toastr.error('Error al reenviar el código.', 'Error');
      },
    });
  }
}
