import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {EditorView} from '@codemirror/view';
import {java} from '@codemirror/lang-java';
import {cpp} from '@codemirror/lang-cpp';
import {python} from '@codemirror/lang-python';
import {materialDark} from '@ddietr/codemirror-themes/material-dark';
import { LanguageSupport } from '@codemirror/language';


export type Language = 'java' | 'cpp' | 'py';


interface LanguageConfig {
  extension: () => LanguageSupport;
  logo: string;
  alt: string;
}

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

@Component({
  selector: 'app-codigo',
  imports: [],
  templateUrl: './codigo.component.html',
  styleUrl: './codigo.component.css',
})
export class CodigoComponent implements AfterViewInit, OnDestroy {
  @Input() language!: Language;
  @Input() codigo: string | null = null;
  @ViewChild('editorContainer') editorContainer?: ElementRef;

  private editorView?: EditorView;

  get config() {
    return LANGUAGE_CONFIG[this.language];
  }

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

  ngOnDestroy(): void {
    this.editorView?.destroy();
  }
}
