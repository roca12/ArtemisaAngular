import { Component, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Contenedor de modal reutilizable para los formularios de los CRUD del panel.
 *
 * Muestra su contenido proyectado (normalmente una `.card` con el formulario)
 * centrado sobre un fondo oscuro. Se cierra al hacer clic fuera, con la tecla
 * Escape o desde los botones del propio formulario (que llaman a `cancelar`).
 * Emite `cerrar` en esos casos para que el CRUD oculte el formulario.
 *
 * Hereda las variables de color de `.adm-paper`, por lo que respeta el modo
 * claro/oscuro.
 */
@Component({
  selector: 'app-crud-modal',
  standalone: true,
  template: `
    <div class="cm-backdrop" (click)="onBackdrop($event)">
      <div class="cm-dialog"><ng-content></ng-content></div>
    </div>
  `,
  styles: [
    `
      .cm-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1050;
        display: flex;
        justify-content: center;
        padding: 40px 16px;
        overflow-y: auto;
        background: rgb(0 0 0 / 0.5);
        animation: cm-fade 0.15s ease;
      }
      .cm-dialog {
        width: min(760px, 100%);
        margin: auto;
      }
      @keyframes cm-fade {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .cm-backdrop {
          animation: none;
        }
      }
    `,
  ],
})
export class CrudModalComponent {
  /** Se emite cuando el usuario pide cerrar (fondo o Escape). */
  @Output() readonly cerrar = new EventEmitter<void>();

  /**
   * Cierra el modal solo si el clic fue sobre el fondo, no sobre el diálogo.
   * @param event Evento de clic.
   */
  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cerrar.emit();
    }
  }

  /** Cierra el modal con la tecla Escape. */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cerrar.emit();
  }
}
