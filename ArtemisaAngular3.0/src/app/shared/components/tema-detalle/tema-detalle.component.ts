import { Component, Input } from '@angular/core';
import { Temario } from '../../models/temario.model';
import { FormatearTextoPipe } from '../../pipes/formatear-texto.pipe';
import { CodigoComponent } from '../codigo/codigo.component';
import { NgIf } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

/**
 * Componente que muestra el detalle de un tema específico del temario.
 * Incluye la descripción teórica, complejidad y ejemplos de código en varios lenguajes.
 */
@Component({
  selector: 'app-tema-detalle',
  imports: [FormatearTextoPipe, CodigoComponent, NgIf],
  templateUrl: './tema-detalle.component.html',
  styleUrl: './tema-detalle.component.css',
})
export class TemaDetalleComponent {
  /** El objeto Temario que contiene la información a detallar. */
  @Input() tema!: Temario; // skipcq: JS-0339

  /**
   * Constructor del componente de detalle de tema.
   * @param theme Servicio para gestionar el tema visual (claro/oscuro).
   */
  constructor(public theme: ThemeService) {}
}
