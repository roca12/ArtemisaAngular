import {Component, Input} from '@angular/core';
import {Temario} from '../../models/temario.model';
import {FormatearTextoPipe} from '../../pipes/formatear-texto.pipe';
import {CodigoComponent} from '../codigo/codigo.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-tema-detalle',
  imports: [
    FormatearTextoPipe,
    CodigoComponent,
    NgIf
  ],
  templateUrl: './tema-detalle.component.html',
  styleUrl: './tema-detalle.component.css'
})
export class TemaDetalleComponent {
  @Input() tema!: Temario;
}
