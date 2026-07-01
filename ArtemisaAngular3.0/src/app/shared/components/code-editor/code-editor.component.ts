import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Compartment, EditorState } from '@codemirror/state';
import {
  EditorView,
  ViewUpdate,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import {
  LanguageSupport,
  bracketMatching,
  foldGutter,
  indentOnInput,
} from '@codemirror/language';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { materialDark } from '@ddietr/codemirror-themes/material-dark';

/**
 * Conjunto de extensiones base del editor, compuesto a partir de los paquetes
 * `@codemirror/*` individuales (versión 6.x) que ya usa el resto de la app.
 *
 * IMPORTANTE: no se usa `basicSetup` del meta-paquete `codemirror` porque
 * arrastra una instancia distinta de `@codemirror/state`, lo que provoca el
 * error "Unrecognized extension value" y rompe TODOS los editores CodeMirror
 * (incluido el visor de la biblioteca).
 */
const BASE_EXTENSIONS = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightActiveLine(),
  foldGutter(),
  bracketMatching(),
  indentOnInput(),
  history(),
  keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
];

/** Lenguajes soportados por el editor de código. */
export type CodeLanguage = 'java' | 'cpp' | 'py';

/** Extensión de CodeMirror para cada lenguaje. */
const LANG_EXT: Record<CodeLanguage, () => LanguageSupport> = {
  java,
  cpp,
  py: python,
};

/**
 * Editor de código editable basado en CodeMirror 6.
 *
 * Ofrece resaltado de sintaxis, números de línea, plegado, autoindentado y
 * emparejado de llaves para Java, C++ y Python. Implementa `ControlValueAccessor`
 * para integrarse con formularios reactivos mediante `formControlName`.
 *
 * Nota: el resaltado y las ayudas de edición son del lado del cliente; el
 * linting real por lenguaje requeriría un servidor de lenguaje.
 */
@Component({
  selector: 'app-code-editor',
  standalone: true,
  template: `<div #host class="cm-host"></div>`,
  styles: [
    `
      :host {
        display: block;
        border: 1.5px solid var(--line-strong, #d0d0d0);
        border-radius: 9px;
        overflow: hidden;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeEditorComponent),
      multi: true,
    },
  ],
})
export class CodeEditorComponent
  implements AfterViewInit, OnDestroy, ControlValueAccessor
{
  /** Lenguaje del editor. */
  @Input() language: CodeLanguage = 'java';
  /** Contenedor donde se monta CodeMirror. */
  @ViewChild('host') host!: ElementRef<HTMLElement>;

  /** Instancia de la vista del editor. */
  private view?: EditorView;
  /** Valor actual (usado antes de que la vista exista). */
  private value = '';
  /** Compartimento para poder alternar el estado de solo lectura. */
  private readonly editable = new Compartment();
  /** Indica si el control está deshabilitado. */
  private disabled = false;

  /** Callbacks de ControlValueAccessor. */
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.view = new EditorView({
      parent: this.host.nativeElement,
      state: EditorState.create({
        doc: this.value,
        extensions: [
          ...BASE_EXTENSIONS,
          LANG_EXT[this.language](),
          materialDark,
          this.editable.of(EditorView.editable.of(!this.disabled)),
          EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.docChanged) {
              this.value = update.state.doc.toString();
              this.onChange(this.value);
            }
            if (update.focusChanged && !update.view.hasFocus) {
              this.onTouched();
            }
          }),
        ],
      }),
    });
  }

  ngOnDestroy(): void {
    this.view?.destroy();
  }

  /** ControlValueAccessor: recibe el valor del formulario. */
  writeValue(value: string | null): void {
    this.value = value ?? '';
    if (!this.view) {
      return;
    }
    const actual = this.view.state.doc.toString();
    if (actual !== this.value) {
      this.view.dispatch({
        changes: { from: 0, to: actual.length, insert: this.value },
      });
    }
  }

  /** ControlValueAccessor: registra el callback de cambios. */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /** ControlValueAccessor: registra el callback de "tocado". */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /** ControlValueAccessor: habilita/deshabilita la edición. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.view?.dispatch({
      effects: this.editable.reconfigure(
        EditorView.editable.of(!isDisabled),
      ),
    });
  }
}
