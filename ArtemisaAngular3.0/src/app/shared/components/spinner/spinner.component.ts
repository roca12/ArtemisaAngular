import { Component, Input } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

/**
 * Componente que muestra un indicador de carga (spinner).
 * Puede mostrarse a pantalla completa o dentro de un contenedor específico.
 */
@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent {
  /** Mensaje de texto opcional que se muestra junto al spinner. */
  @Input() message = 'Cargando...';

  /** Indica si el spinner debe cubrir toda la pantalla o no. */
  @Input() fullscreen = false;

  /**
   * Constructor del componente spinner.
   * @param theme Servicio para gestionar el tema visual.
   */
  constructor(public theme: ThemeService) {}
}
