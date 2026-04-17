import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { EditorView } from '@codemirror/view';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { materialDark } from '@ddietr/codemirror-themes/material-dark';
import { LanguageSupport } from '@codemirror/language';

/**
 * Tipos de lenguajes de programación soportados por el componente de visualización de código.
 */
export type Language = 'java' | 'cpp' | 'py';

/**
 * Interfaz que define la configuración específica para cada lenguaje de programación.
 */
interface LanguageConfig {
  /** Función que devuelve la extensión de CodeMirror para el lenguaje. */
  extension: () => LanguageSupport;
  /** Ruta al logo del lenguaje. */
  logo: string;
  /** Texto alternativo para el logo. */
  alt: string;
}

/**
 * Configuración estática para los lenguajes soportados.
 */
const LANGUAGE_CONFIG: Record<Language, LanguageConfig> = {
  java: {
    extension: java,
    logo: 'assets/images/logos/JAVA-logo.png',
    alt: 'Java Logo',
  },
  cpp: {
    extension: cpp,
    logo: 'assets/images/logos/CPP-logo.png',
    alt: 'C++ Logo',
  },
  py: {
    extension: python,
    logo: 'assets/images/logos/PYTHON-logo.png',
    alt: 'Python Logo',
  },
};

/**
 * Componente que utiliza CodeMirror para mostrar fragmentos de código con resaltado de sintaxis.
 */
@Component({
  selector: 'app-codigo',
  imports: [],
  templateUrl: './codigo.component.html',
  styleUrl: './codigo.component.css',
})
export class CodigoComponent implements AfterViewInit, OnDestroy {
  /** Lenguaje del código a mostrar. */
  @Input() language!: Language; // skipcq: JS-0339
  /** El fragmento de código a visualizar. */
  @Input() codigo: string | null = null;
  /** Referencia al contenedor del editor en el DOM. */
  @ViewChild('editorContainer') editorContainer?: ElementRef;

  /** Instancia de la vista del editor CodeMirror. */
  private editorView?: EditorView;

  /**
   * Obtiene la configuración del lenguaje actual.
   * @returns El objeto LanguageConfig correspondiente al lenguaje seleccionado.
   */
  get config() {
    return LANGUAGE_CONFIG[this.language];
  }

  /**
   * Ciclo de vida AfterViewInit: Inicializa el editor CodeMirror con la configuración y el código proporcionado.
   */
  ngAfterViewInit(): void {
    if (this.codigo && this.editorContainer) {
      this.editorView = new EditorView({
        parent: this.editorContainer.nativeElement,
        doc: this.codigo,
        extensions: [
          materialDark,
          this.config.extension(),
          EditorView.editable.of(false),
        ],
      });
    }
  }

  /**
   * Ciclo de vida OnDestroy: Destruye la instancia del editor para liberar recursos.
   */
  ngOnDestroy(): void {
    this.editorView?.destroy();
  }
}
