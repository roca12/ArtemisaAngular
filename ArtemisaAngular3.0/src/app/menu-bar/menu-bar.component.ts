import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';

/**
 * Componente que representa la barra de navegación superior (menu bar).
 * Gestiona el cambio de tema y el estado de la sesión del usuario.
 */
@Component({
  selector: 'app-menu-bar',
  imports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css',
})
export class MenuBarComponent implements OnInit {
  /**
   * Constructor del componente de la barra de menú.
   * @param theme Servicio para gestionar el tema visual.
   * @param authService Servicio para gestionar la autenticación.
   */
  constructor(
    public theme: ThemeService,
    private authService: AuthService,
  ) {}

  /**
   * Alterna el modo oscuro y actualiza visualmente el contenedor del interruptor.
   */
  toggleDarkMode() {
    const darkModeContainer = document.querySelector('.darkmode-container');
    darkModeContainer?.classList.toggle('active');
    this.theme.toggle();
  }

  /**
   * Ciclo de vida OnInit: Verifica si el token ha expirado al cargar el componente y cierra la sesión si es necesario.
   */
  ngOnInit(): void {
    if (this.authService.tokenExpirado()) {
      AuthService.cerrarSesion();
    }
  }

  /**
   * Verifica si el usuario ha iniciado sesión.
   * @returns true si existe un token de autenticación, false en caso contrario.
   */
  isLoggedIn(): boolean {
    return AuthService.obtenerToken() !== null;
  }
}
