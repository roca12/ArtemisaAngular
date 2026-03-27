import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SyllabusService } from '../services/syllabus.service';
import { Temario } from '../shared/models/temario.model';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../services/theme.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { EditorView } from '@codemirror/view';
import {materialDark} from '@ddietr/codemirror-themes/material-dark'
import { ActivatedRoute } from '@angular/router';
import {RecomendationService} from '../services/recomendation.service';

@Component({
  selector: 'app-temario',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    NgbAccordionModule,
    NgIf
],
  templateUrl: './temario.component.html',
  styleUrl: './temario.component.css'
})
export class TemarioComponent implements AfterViewInit, OnInit{

  @ViewChildren('editorContainerJava') editorContainersJava!: QueryList<ElementRef>;
  @ViewChildren('editorContainerCpp') editorContainersCpp!: QueryList<ElementRef>;
  @ViewChildren('editorContainerPython') editorContainersPython!: QueryList<ElementRef>;

  temario: Temario [] =[];
  superGrupos: string[] = [];

  ngAfterViewInit(): void {

    this.initializeTemario();
    this.initializeSupergrupos();
    this.editorContainersJava.changes.subscribe(() => {
      this.initJavaEditors();
    });
    this.editorContainersCpp.changes.subscribe(() => {
      this.initCppEditors();
    });
    this.editorContainersPython.changes.subscribe(() => {
      this.initPythonEditors();
    });

  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const filtro = params.get('filtro');
      if (filtro) {
        this.filtrosSeleccionados[filtro] = true;
      }
    });

  }



  constructor(
    private syllabus: SyllabusService,
    private toastService: ToastrService,
    public theme: ThemeService,
    private route: ActivatedRoute,
    private recoService:RecomendationService
  ) {



   }

  filtrosSeleccionados: { [key: string]: boolean } = {};

  initializeTemario(){
    this.syllabus.getSyllabus().subscribe({
      next: (response) => {
        this.temario = response.data as Temario[];
      },
      error: (error) => {
        this.toastService.error('Error al obtener el temario', 'Error');
      }
    });
  }

  initJavaEditors() {
    if (this.editorContainersJava) {
      this.editorContainersJava.forEach((container) => {
       const codigo = container.nativeElement.getAttribute('data-codigo');
        if (codigo.trim !== '') {
          new EditorView({
            parent: container.nativeElement,
            doc: codigo,
            extensions: [materialDark, java(), EditorView.editable.of(false)]
          });
        }
      });
    }
  }

  initCppEditors() {
    if (this.editorContainersCpp) {
      this.editorContainersCpp.forEach((container) => {
        const codigo = container.nativeElement.getAttribute('data-codigo');
        if (codigo.trim !== '') {
          new EditorView({
            parent: container.nativeElement,
            doc: codigo,
            extensions: [materialDark, cpp(), EditorView.editable.of(false)]
          });
        }
      });
    }
  }

  initPythonEditors() {
    if (this.editorContainersPython) {
      this.editorContainersPython.forEach((container) => {
        const codigo = container.nativeElement.getAttribute('data-codigo');
        if (codigo.trim !== '') {
          new EditorView({
            parent: container.nativeElement,
            doc:codigo,
            extensions: [materialDark, python(), EditorView.editable.of(false)]
          });
        }
      });
    }
  }

  temarioFiltrado() {
  const activos = Object.entries(this.filtrosSeleccionados)
    .filter(([_, val]) => val)
    .map(([key, _]) => key);
    if (activos.length === 0) return this.temario;
  return this.temario.filter(t => activos.includes(t.supergrupo)).concat(
    this.temario.filter(t => activos.includes(t.tema)));
}

  initializeSupergrupos() {
    this.syllabus.getSuperGrupos().subscribe({
      next: (response) => {
        this.superGrupos = response.data as string[];
      },
      error: (error) => {
        this.toastService.error('Error al obtener los supergrupos', 'Error');
      }
    });
  }

  formateaTexto(texto: string): string {

  if (/<\/?[a-z][\s\S]*>/i.test(texto)) {
    return texto;
  }

  return texto.replace(/\n/g, '<br><br>');
}


}
