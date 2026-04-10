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
  @Input() message: string = 'Cargando...';

  @Input() fullscreen: boolean = false;

  constructor(public theme: ThemeService) {}
}
