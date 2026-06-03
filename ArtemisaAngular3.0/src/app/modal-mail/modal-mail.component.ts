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

@Component({
  selector: 'app-modal-mail',
  imports: [FormsModule, ReactiveFormsModule, ToastrModule, CommonModule],
  templateUrl: './modal-mail.component.html',
  styleUrl: './modal-mail.component.css',
})
export class ModalMailComponent {
  @Input() correo = '';
  @Input() usuario = '';

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
      num1: ['', Validators.required],
      num2: ['', Validators.required],
      num3: ['', Validators.required],
      num4: ['', Validators.required],
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
