import { Component, Input } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-spinner',
  imports: [NgIf],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent {
  @Input() message = 'Cargando...';

  @Input() fullscreen = false;

  constructor(public theme: ThemeService) {}
}
