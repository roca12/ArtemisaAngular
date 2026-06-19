import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';

/**
 * Componente que representa la barra de navegación superior (menu bar).
 * Gestiona el cambio de tema y el estado de la sesión del usuario.
 */
@Component({
  selector: 'app-menu-bar',
  imports: [RouterModule, CommonModule, NgbDropdownModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css',
})
export class MenuBarComponent implements OnInit {
  /** Servicio para gestionar el tema visual. */
  public theme = inject(ThemeService);
  /** Servicio para la autenticación. */
  private authService = inject(AuthService);

  /**
   * Alterna el modo oscuro y actualiza visualmente el contenedor del interruptor.
   */
  toggleDarkMode() {
    const darkModeContainer = document.querySelector('.darkmode-container');
    darkModeContainer?.classList.toggle('active');
    this.theme.toggle();
  }

  /**
   * Ciclo de vida OnInit: verifica la sesión vigente contra el backend
   * (cookie httpOnly) e hidrata el estado para reflejarlo en la barra.
   */
  ngOnInit(): void {
    this.authService.cargarSesion().subscribe();
  }

  /**
   * Indica si hay un usuario en sesión. Reactivo (señal del AuthService).
   * @returns true si hay sesión, false en caso contrario.
   */
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
