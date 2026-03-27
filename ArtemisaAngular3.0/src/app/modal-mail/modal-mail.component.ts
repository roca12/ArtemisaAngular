import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MailService } from '../services/mail.service';
import { Usuario } from '../shared/models/usuario.model';
import { UserService } from '../services/user.service';
import {  ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-modal-mail',
  imports: [FormsModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './modal-mail.component.html',
  styleUrl: './modal-mail.component.css'
})
export class ModalMailComponent {
 @Input() correo: string = '';
 @Input() usuario: Usuario = {contrasenia: '', rol: '', correo: '', usuario: '', verificacion: ''};
 
  cargando: boolean = false;
  validationForm: FormGroup = new FormGroup({});

  constructor(
    public activeModal: NgbActiveModal,
    private mailService: MailService,
    private fb:FormBuilder, 
    private userService: UserService, 
    private toastr: ToastrService, 
    private router:Router,
    public theme: ThemeService
  ) {
    this.initializeForm();
  }

  initializeForm(){
    this.validationForm = this.fb.group({
      num1: ['', Validators.required],
      num2: ['', Validators.required],
      num3: ['', Validators.required],
      num4: ['', Validators.required]
    });
  }


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
      }
    });
    
  }

  registrarUsuario() {
    this.userService.register(this.usuario).subscribe({
      next: (response) => {
        console.log(this.usuario);
        console.log(response);
        this.activeModal.close("Usuario creado y válidado exitosamente.");
        this.toastr.success('Usuario creado y validado exitosamente.', 'Éxito');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status !== 409) {
          this.toastr.error('Error al enviar el código de verificación. Por favor, inténtalo de nuevo.', 'Error');
        }
        console.error("Error al enviar el código:", error);
      }
  });
  }



  reenviarCodigo() {}
  
}
