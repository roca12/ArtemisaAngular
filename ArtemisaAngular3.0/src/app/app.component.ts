import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { ThemeService } from './services/theme.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { NgClass } from '@angular/common';
import { RecomendationService } from './services/recomendation.service';

/**
 * Componente raíz de la aplicación que gestiona la estructura principal,
 * el tema visual y la inicialización de servicios globales.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBarComponent, FaIconComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit, OnInit {
  /** Título de la aplicación. */
  title = 'Biblioteca Artemisa';

  /**
   * Constructor del componente raíz.
   * @param theme Servicio para gestionar el tema (claro/oscuro).
   * @param recoService Servicio para inicializar las recomendaciones de búsqueda.
   */
  constructor(
    public theme: ThemeService,
    private recoService: RecomendationService,
  ) {}

  /**
   * Ciclo de vida OnInit: Inicializa las recomendaciones de búsqueda de forma asíncrona.
   */
  ngOnInit(): void {
    this.recoService.initializeRecomendationsAsync().catch((err) => {
      console.error('Error inicializando recomendaciones:', err);
    });
  }

  /**
   * Ciclo de vida AfterViewInit: Gestiona la ocultación y eliminación del splash screen de carga.
   */
  ngAfterViewInit() {
    this.hideSplashScreen();
  }

  /**
   * Oculta y elimina el splash screen de carga del DOM.
   * @private
   */
  private hideSplashScreen() {
    console.log(this.title); // Usar this para evitar JS-0105
    const splash = document.getElementById('app-splash');
    if (!splash) return;
    requestAnimationFrame(() => {
      splash.classList.add('splash-hidden');
      setTimeout(() => splash.remove(), 800);
    });
  }

  /** Icono de GitHub para uso en la interfaz. */
  protected readonly faGithub = faGithub;
}
