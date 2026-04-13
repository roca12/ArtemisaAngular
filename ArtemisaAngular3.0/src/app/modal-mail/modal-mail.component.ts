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
import { Usuario } from '../shared/models/usuario.model';
import { UserService } from '../services/user.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';

/**
 * Componente modal para la validación del código enviado por correo electrónico.
 * Maneja la entrada del código de 4 dígitos y el registro final del usuario.
 */
@Component({
  selector: 'app-modal-mail',
  imports: [FormsModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './modal-mail.component.html',
  styleUrl: './modal-mail.component.css',
})
export class ModalMailComponent {
  /** Dirección de correo electrónico a la que se envió el código. */
  @Input() correo: string = '';
  /** Objeto usuario con los datos pendientes de registro definitivo. */
  @Input() usuario: Usuario = {
    contrasenia: '',
    rol: '',
    correo: '',
    usuario: '',
    verificacion: '',
  };

  /** Indica si se está procesando una petición al servidor. */
  cargando: boolean = false;
  /** Formulario reactivo para capturar los 4 dígitos del código. */
  validationForm: FormGroup = new FormGroup({});

  /**
   * Constructor del componente modal.
   * @param activeModal Referencia al modal activo para poder cerrarlo.
   * @param mailService Servicio para validación de códigos de correo.
   * @param fb Constructor de formularios reactivos.
   * @param userService Servicio para registrar al usuario.
   * @param toastr Servicio para notificaciones.
   * @param router Servicio de enrutamiento.
   * @param theme Servicio para el tema visual.
   */
  constructor(
    public activeModal: NgbActiveModal,
    private mailService: MailService,
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    public theme: ThemeService,
  ) {
    this.initializeForm();
  }

  /**
   * Inicializa el formulario con los 4 campos para el código de verificación.
   */
  initializeForm() {
    this.validationForm = this.fb.group({
      num1: ['', Validators.required],
      num2: ['', Validators.required],
      num3: ['', Validators.required],
      num4: ['', Validators.required],
    });
  }

  /**
   * Concatena los dígitos e invoca al servicio de validación de código.
   * Si es exitoso, procede a registrar al usuario.
   */
  enviarCodigo() {
    if (this.validationForm.invalid) {
      return;
    }

    const codigo = `${this.validationForm.value.num1}${this.validationForm.value.num2}${this.validationForm.value.num3}${this.validationForm.value.num4}`;
    this.cargando = true;

    this.mailService.validarCodigo(this.correo, codigo).subscribe({
      next: (response) => {
        this.cargando = false;
        this.registrarUsuario();
        this.activeModal.close(response);
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al validar el código:', error);
      },
    });
  }

  /**
   * Realiza el registro definitivo del usuario en la base de datos tras validar el correo.
   */
  registrarUsuario() {
    this.userService.register(this.usuario).subscribe({
      next: (response) => {
        console.log(this.usuario);
        console.log(response);
        this.activeModal.close('Usuario creado y válidado exitosamente.');
        this.toastr.success('Usuario creado y validado exitosamente.', 'Éxito');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status !== 409) {
          this.toastr.error(
            'Error al enviar el código de verificación. Por favor, inténtalo de nuevo.',
            'Error',
          );
        }
        console.error('Error al enviar el código:', error);
      },
    });
  }

  /**
   * Método (pendiente de implementar) para reenviar el código de verificación.
   */
  reenviarCodigo() {}
}
