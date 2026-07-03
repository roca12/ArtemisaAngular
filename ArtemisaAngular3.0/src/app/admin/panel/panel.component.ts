import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  IconDefinition,
  faArrowLeft,
  faBook,
  faCode,
  faLink,
  faListUl,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../../services/theme.service';
import { LibroComponent } from '../libro/libro.component';
import { LinkComponent } from '../link/link.component';
import { ProblemaComponent } from '../problema/problema.component';
import { AdminTemarioComponent } from '../temario/temario.component';

/** Secciones (CRUD) disponibles en el panel de administración. */
type AdminSection = 'libros' | 'problemas' | 'links' | 'temario';

/** Descriptor de una opción del menú lateral. */
interface AdminNavItem {
  readonly id: AdminSection;
  readonly label: string;
  readonly icon: IconDefinition;
}

/**
 * Panel de control del administrador.
 *
 * Replica la estética "paper & ink" del perfil: un sidebar a la izquierda con
 * las secciones (CRUD de libros, problemas, enlaces y temario) y, a la derecha,
 * el componente exclusivo de la sección activa. La sección se mantiene en una
 * señal (sin cambios de URL), igual que las pestañas del perfil.
 *
 * El acceso está protegido por `adminGuardGuard` en la tabla de rutas.
 */
@Component({
  selector: 'app-panel',
  imports: [
    FaIconComponent,
    LibroComponent,
    ProblemaComponent,
    LinkComponent,
    AdminTemarioComponent,
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css',
})
export class PanelComponent {
  /** Router para volver al perfil. */
  private readonly router = inject(Router);
  /** Servicio de tema (claro/oscuro), expuesto a la plantilla. */
  readonly theme = inject(ThemeService);

  /** Sección activa del panel principal. */
  readonly activeSection = signal<AdminSection>('libros');

  /** Opciones del menú lateral. */
  readonly navItems: readonly AdminNavItem[] = [
    { id: 'libros', label: 'Libros', icon: faBook },
    { id: 'problemas', label: 'Problemas', icon: faCode },
    { id: 'links', label: 'Enlaces', icon: faLink },
    { id: 'temario', label: 'Temario', icon: faListUl },
  ];

  /** Etiqueta de la sección activa (para el breadcrumb). */
  readonly activeLabel = computed(
    () => this.navItems.find((i) => i.id === this.activeSection())?.label ?? '',
  );

  /** Iconos sueltos usados en la plantilla. */
  readonly faUserShield = faUserShield;
  readonly faArrowLeft = faArrowLeft;

  /**
   * Cambia la sección CRUD mostrada a la derecha.
   * @param section Sección a activar.
   */
  setSection(section: AdminSection): void {
    this.activeSection.set(section);
  }

  /** Regresa a la página de perfil. */
  volverAlPerfil(): void {
    this.router.navigate(['/perfil']);
  }
}
