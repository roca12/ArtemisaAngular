import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faListUl,
  faPen,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { QuillEditorComponent } from 'ngx-quill';
import { CodeEditorComponent } from '../../shared/components/code-editor/code-editor.component';
import { CrudModalComponent } from '../../shared/components/crud-modal/crud-modal.component';
import { CrearTemario, SyllabusService } from '../../services/syllabus.service';
import { ConfirmService } from '../../services/confirm.service';
import { Temario } from '../../shared/models/temario.model';
import { mensajeDeError } from '../../shared/utils/http-error';
import { quillTemarioModules } from '../../shared/utils/quill-config';

/** Estado de carga del listado. */
type CrudStatus = 'loading' | 'ready' | 'error';
/** Modo del formulario: oculto, creando o editando. */
type FormMode = 'hidden' | 'create' | 'edit';

/**
 * Sección de administración del temario (CRUD completo).
 *
 * Lista los temas en una tabla y permite crear, editar y eliminar. Incluye los
 * campos de código (Java, C++, Python) en áreas de texto y un `datalist` de
 * supergrupos existentes. El identificador para editar/eliminar es el `_id`.
 *
 * El selector es `app-admin-temario` para no chocar con el `app-temario` de la
 * vista pública del temario.
 */
@Component({
  selector: 'app-admin-temario',
  imports: [
    ReactiveFormsModule,
    FaIconComponent,
    QuillEditorComponent,
    CodeEditorComponent,
    CrudModalComponent,
  ],
  templateUrl: './temario.component.html',
  styleUrl: '../crud-section.css',
})
export class AdminTemarioComponent implements OnInit {
  /** Servicio de temario. */
  private readonly syllabus = inject(SyllabusService);
  /** Servicio de notificaciones. */
  private readonly toastr = inject(ToastrService);
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);
  /** Servicio de diálogos de confirmación. */
  private readonly confirm = inject(ConfirmService);

  /** Estado del listado. */
  readonly status = signal<CrudStatus>('loading');
  /** Temas cargados. */
  readonly temas = signal<Temario[]>([]);
  /** Supergrupos existentes (para el datalist del formulario). */
  readonly supergrupos = signal<string[]>([]);
  /** Modo actual del formulario. */
  readonly formMode = signal<FormMode>('hidden');
  /** `_id` del tema en edición (null al crear). */
  private editingId: string | null = null;
  /** Flag de envío del formulario. */
  readonly saving = signal(false);
  /** `_id` del tema que se está eliminando. */
  readonly deletingId = signal<string | null>(null);

  /** Título del formulario según el modo. */
  readonly formTitle = computed(() =>
    this.formMode() === 'edit' ? 'Editar tema' : 'Nuevo tema',
  );

  /** Campos que están en modo "escribir uno nuevo". */
  temaNuevo: Record<string, boolean> = { supergrupo: false, tema: false };

  /** Nombres de tema existentes (valores distintos), para el selector. */
  readonly temasDisponibles = computed(() =>
    AdminTemarioComponent.valoresUnicos(this.temas().map((t) => t.tema)),
  );

  /** Formulario reactivo del tema. */
  readonly form = this.fb.group({
    supergrupo: ['', Validators.required],
    tema: ['', Validators.required],
    complejidad_tiempo: [''],
    texto: [''],
    java: [''],
    cpp: [''],
    py: [''],
    orden: [null as number | null],
    suborden: [null as number | null],
  });

  /** Configuración (barra de herramientas) del editor de texto enriquecido. */
  readonly quillModules = quillTemarioModules;

  /** Iconos. */
  readonly faListUl = faListUl;
  readonly faPlus = faPlus;
  readonly faPen = faPen;
  readonly faTrash = faTrash;

  /** Carga el temario y los supergrupos al inicializar el componente. */
  ngOnInit(): void {
    this.cargar();
    this.cargarSupergrupos();
  }

  /** Carga (o recarga) la lista de temas desde el backend. */
  cargar(): void {
    this.status.set('loading');
    this.syllabus.getSyllabus().subscribe({
      next: (data) => {
        this.temas.set(data);
        this.status.set('ready');
      },
      error: () => this.status.set('error'),
    });
  }

  /** Carga los supergrupos para el datalist (silencioso si falla). */
  private cargarSupergrupos(): void {
    this.syllabus.getSuperGrupos().subscribe({
      next: (data) => this.supergrupos.set(data),
      error: () => this.supergrupos.set([]),
    });
  }

  /** Abre el formulario en modo creación. */
  nuevoTema(): void {
    this.editingId = null;
    this.form.reset({
      supergrupo: '',
      tema: '',
      complejidad_tiempo: '',
      texto: '',
      java: '',
      cpp: '',
      py: '',
      orden: null,
      suborden: null,
    });
    this.resetTemaNuevo();
    this.formMode.set('create');
  }

  /**
   * Abre el formulario en modo edición con los datos del tema.
   * @param t Tema a editar.
   */
  editarTema(t: Temario): void {
    if (!t._id) {
      this.toastr.error('Este tema no tiene identificador.');
      return;
    }
    this.editingId = t._id;
    this.form.reset({
      supergrupo: t.supergrupo,
      tema: t.tema,
      complejidad_tiempo: t.complejidad_tiempo ?? '',
      texto: t.texto ?? '',
      java: t.java ?? '',
      cpp: t.cpp ?? '',
      py: t.py ?? '',
      orden: t.orden ?? null,
      suborden: t.suborden ?? null,
    });
    this.resetTemaNuevo();
    this.formMode.set('edit');
  }

  /** Cierra el formulario sin guardar. */
  cancelar(): void {
    this.formMode.set('hidden');
  }

  /** Crea o actualiza el tema según el modo del formulario. */
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const valores = this.form.getRawValue();
    const payload: CrearTemario = {
      supergrupo: valores.supergrupo ?? '',
      tema: valores.tema ?? '',
      complejidad_tiempo: valores.complejidad_tiempo ?? '',
      texto: valores.texto ?? '',
      java: valores.java ?? '',
      cpp: valores.cpp ?? '',
      py: valores.py ?? '',
      orden: valores.orden == null ? 0 : Number(valores.orden),
      suborden: valores.suborden == null ? 0 : Number(valores.suborden),
    };

    this.saving.set(true);
    const id = this.editingId;
    const esEdicion = this.formMode() === 'edit';
    const req$ =
      esEdicion && id != null
        ? this.syllabus.actualizarTema(id, payload)
        : this.syllabus.crearTema(payload);

    req$.subscribe({
      next: () => {
        this.toastr.success(esEdicion ? 'Tema actualizado.' : 'Tema creado.');
        this.saving.set(false);
        this.formMode.set('hidden');
        this.cargar();
        this.cargarSupergrupos();
      },
      error: (err) => {
        this.toastr.error(mensajeDeError(err, 'No se pudo guardar.'));
        this.saving.set(false);
      },
    });
  }

  /**
   * Elimina un tema, previa confirmación.
   * @param t Tema a eliminar.
   */
  async eliminarTema(t: Temario): Promise<void> {
    if (!t._id) {
      this.toastr.error('Este tema no tiene identificador.');
      return;
    }
    const confirmado = await this.confirm.ask({
      titulo: 'Eliminar tema',
      mensaje: `¿Eliminar el tema "${t.tema}"? Esta acción es permanente.`,
      textoConfirmar: 'Eliminar',
      peligro: true,
    });
    if (!confirmado) {
      return;
    }
    this.deletingId.set(t._id);
    this.syllabus.eliminarTema(t._id).subscribe({
      next: () => {
        this.toastr.success('Tema eliminado.');
        this.deletingId.set(null);
        this.cargar();
      },
      error: (err) => {
        this.toastr.error(mensajeDeError(err, 'No se pudo eliminar.'));
        this.deletingId.set(null);
      },
    });
  }

  /**
   * Indica si un control del formulario debe mostrarse como inválido.
   * @param nombreControl Nombre del control.
   */
  invalido(nombreControl: string): boolean {
    const control = this.form.get(nombreControl);
    return control != null && control.invalid && control.touched;
  }

  /**
   * Guarda en el control el valor elegido en el selector.
   * @param campo Nombre del control (supergrupo o tema).
   * @param event Evento del `<select>`.
   */
  onSelect(campo: string, event: Event): void {
    this.form.get(campo)?.setValue((event.target as HTMLSelectElement).value);
  }

  /**
   * Activa el modo de escritura para introducir un valor nuevo.
   * @param campo Nombre del control (supergrupo o tema).
   */
  activarNuevo(campo: string): void {
    this.temaNuevo[campo] = true;
    this.form.get(campo)?.setValue('');
  }

  /**
   * Vuelve del modo "escribir nuevo" al selector.
   * @param campo Nombre del control (supergrupo o tema).
   */
  volverASelector(campo: string): void {
    this.temaNuevo[campo] = false;
    this.form.get(campo)?.setValue('');
  }

  /** Restablece los campos con selector al modo lista. */
  private resetTemaNuevo(): void {
    this.temaNuevo = { supergrupo: false, tema: false };
  }

  /**
   * Devuelve los valores no vacíos, sin duplicados y ordenados alfabéticamente.
   * @param valores Lista de valores (posiblemente con vacíos/repetidos).
   */
  private static valoresUnicos(valores: (string | undefined)[]): string[] {
    const unicos = new Set<string>();
    for (const valor of valores) {
      const limpio = valor?.trim();
      if (limpio) {
        unicos.add(limpio);
      }
    }
    return [...unicos].sort((a, b) => a.localeCompare(b));
  }
}
