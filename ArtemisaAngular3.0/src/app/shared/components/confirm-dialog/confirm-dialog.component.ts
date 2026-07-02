import { Component, inject } from '@angular/core';
import { ConfirmService } from '../../../services/confirm.service';
import { CrudModalComponent } from '../crud-modal/crud-modal.component';

/**
 * Diálogo de confirmación global. Se monta una sola vez en la raíz de la app y
 * se muestra cuando `ConfirmService` tiene un estado activo (tras llamar a
 * `ask(...)`). Reutiliza `CrudModalComponent` para el fondo y el centrado.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CrudModalComponent],
  template: `
    @if (state(); as s) {
      <app-crud-modal (close)="confirm.cancelar()">
        <div class="card cd-card">
          <div class="card-head">
            <h3>{{ s.titulo }}</h3>
          </div>
          <p class="cd-message">{{ s.mensaje }}</p>
          <div class="cd-actions">
            <button type="button" class="btn btn-ghost" (click)="confirm.cancelar()">
              {{ s.textoCancelar }}
            </button>
            <button
              type="button"
              class="btn"
              [class.btn-danger]="s.peligro"
              [class.btn-primary]="!s.peligro"
              (click)="confirm.confirmar()"
            >
              {{ s.textoConfirmar }}
            </button>
          </div>
        </div>
      </app-crud-modal>
    }
  `,
  styles: [
    `
      .cd-card {
        width: min(440px, 100%);
      }
      .cd-message {
        margin: 4px 0 20px;
        line-height: 1.5;
      }
      .cd-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  /** Servicio de confirmación (usado también desde la plantilla). */
  readonly confirm = inject(ConfirmService);
  /** Estado del diálogo (visible cuando no es `null`). */
  readonly state = this.confirm.state;
}
