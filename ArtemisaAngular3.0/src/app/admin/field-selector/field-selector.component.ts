import { Component, Input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

/**
 * Selector reutilizable de "elige un valor existente o escribe uno nuevo".
 *
 * Muestra un `<select>` con las `opciones` existentes y un botón `+` que cambia
 * a un `<input>` de texto para introducir un valor nuevo (con botón "Elegir" para
 * volver). Trabaja directamente sobre el `FormControl` que recibe, por lo que se
 * integra con el formulario reactivo del componente padre.
 *
 * Extraído de los CRUD del panel (juez/temas en problemas, supergrupo/tema en
 * temario) para eliminar la duplicación y reducir la complejidad de esas
 * plantillas. Gestiona su propio modo (select/nuevo) internamente.
 */
@Component({
  selector: 'app-field-selector',
  standalone: true,
  imports: [ReactiveFormsModule, FaIconComponent],
  styleUrl: '../crud-section.css',
  template: `
    @if (modoNuevo()) {
      <div class="input-with-btn">
        <input
          class="f-input"
          [class.invalid]="invalido"
          type="text"
          [formControl]="control"
          [placeholder]="placeholderNuevo"
        />
        <button
          type="button"
          class="btn btn-ghost btn-sm"
          (click)="volverASelector()"
        >
          Elegir
        </button>
      </div>
    } @else {
      <div class="input-with-btn">
        <select
          class="f-input"
          [class.invalid]="invalido"
          [formControl]="control"
        >
          <option value="">{{ placeholderVacio }}</option>
          @for (opcion of opciones; track opcion) {
            <option [value]="opcion">{{ opcion }}</option>
          }
        </select>
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-icon"
          (click)="activarNuevo()"
          [attr.aria-label]="ariaLabel"
        >
          <fa-icon [icon]="faPlus"></fa-icon>
        </button>
      </div>
    }
  `,
})
export class FieldSelectorComponent {
  /** Control reactivo cuyo valor edita este selector. */
  @Input({ required: true }) control!: FormControl;
  /** Valores existentes que se ofrecen en el `<select>`. */
  @Input() opciones: string[] = [];
  /** Marca el control como inválido (borde rojo). */
  @Input() invalido = false;
  /** Placeholder del input al escribir un valor nuevo. */
  @Input() placeholderNuevo = 'Nuevo valor';
  /** Texto de la opción vacía del `<select>`. */
  @Input() placeholderVacio = '— Elige —';
  /** Etiqueta accesible del botón de "agregar nuevo". */
  @Input() ariaLabel = 'Agregar valor nuevo';

  /** `true` cuando se está escribiendo un valor nuevo en vez de elegir uno. */
  readonly modoNuevo = signal(false);
  /** Icono del botón de agregar. */
  readonly faPlus = faPlus;

  /** Cambia al modo de escribir un valor nuevo y limpia el control. */
  activarNuevo(): void {
    this.modoNuevo.set(true);
    this.control.setValue('');
  }

  /** Vuelve al modo de selección y limpia el control. */
  volverASelector(): void {
    this.modoNuevo.set(false);
    this.control.setValue('');
  }
}
