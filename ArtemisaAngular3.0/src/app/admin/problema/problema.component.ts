import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faArrowUpRightFromSquare,
  faCode,
  faPen,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { CrearProblema, ProblemService } from '../../services/problem.service';
import { ConfirmService } from '../../services/confirm.service';
import { Problema } from '../../shared/models/problema.model';
import { mensajeDeError } from '../../shared/utils/http-error';
import { CrudModalComponent } from '../../shared/components/crud-modal/crud-modal.component';

/** Estado de carga del listado. */
type CrudStatus = 'loading' | 'ready' | 'error';
/** Modo del formulario: oculto, creando o editando. */
type FormMode = 'hidden' | 'create' | 'edit';

/**
 * Sección de administración de problemas (CRUD completo).
 *
 * Lista los problemas en una tabla y permite crear, editar y eliminar. Las
 * mutaciones recargan el listado desde el backend para reflejar el estado real.
 * El identificador usado para editar/eliminar es el `_id` de MongoDB.
 */
@Component({
  selector: 'app-problema',
  imports: [ReactiveFormsModule, FaIconComponent, CrudModalComponent],
  templateUrl: './problema.component.html',
  styleUrl: '../crud-section.css',
})
export class ProblemaComponent implements OnInit {
  /** Servicio de problemas. */
  private readonly problemService = inject(ProblemService);
  /** Servicio de notificaciones. */
  private readonly toastr = inject(ToastrService);
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);
  /** Servicio de diálogos de confirmación. */
  private readonly confirm = inject(ConfirmService);

  /** Estado del listado. */
  readonly status = signal<CrudStatus>('loading');
  /** Problemas cargados. */
  readonly problemas = signal<Problema[]>([]);
  /** Modo actual del formulario. */
  readonly formMode = signal<FormMode>('hidden');
  /** `_id` del problema en edición (null al crear). */
  private editingId: string | null = null;
  /** Flag de envío del formulario. */
  readonly saving = signal(false);
  /** `_id` del problema que se está eliminando (para el spinner de la fila). */
  readonly deletingId = signal<string | null>(null);

  /** Título del formulario según el modo. */
  readonly formTitle = computed(() =>
    this.formMode() === 'edit' ? 'Editar problema' : 'Nuevo problema',
  );

  /** Campos con selector (juez y temas) que están en modo "escribir uno nuevo". */
  campoNuevo: Record<string, boolean> = {
    juez: false,
    tema_1: false,
    tema_2: false,
    tema_3: false,
    tema_4: false,
  };

  /** Jueces en línea existentes (valores distintos de `juez`), para el selector. */
  readonly jueces = computed(() =>
    ProblemaComponent.valoresUnicos(this.problemas().map((p) => p.juez)),
  );

  /** Temas principales existentes (valores distintos de `tema_1`), para el selector. */
  readonly temasPrincipales = computed(() =>
    ProblemaComponent.valoresUnicos(this.problemas().map((p) => p.tema_1)),
  );

  /** Subtemas existentes (valores distintos de `tema_2/3/4`), para el selector. */
  readonly subtemas = computed(() =>
    ProblemaComponent.valoresUnicos(
      this.problemas().flatMap((p) => [p.tema_2, p.tema_3, p.tema_4]),
    ),
  );

  /** Formulario reactivo del problema. */
  readonly form = this.fb.group({
    titulo: ['', Validators.required],
    juez: ['', Validators.required],
    alias: [''],
    dificultad: [null as number | null, Validators.required],
    tema_1: [''],
    tema_2: [''],
    tema_3: [''],
    tema_4: [''],
    url: ['', Validators.required],
  });

  /** Iconos. */
  readonly faCode = faCode;
  readonly faPlus = faPlus;
  readonly faPen = faPen;
  readonly faTrash = faTrash;
  readonly faExternal = faArrowUpRightFromSquare;

  /** Carga la lista de problemas al inicializar el componente. */
  ngOnInit(): void {
    this.cargar();
  }

  /** Carga (o recarga) la lista de problemas desde el backend. */
  cargar(): void {
    this.status.set('loading');
    this.problemService.getProblems().subscribe({
      next: (data) => {
        this.problemas.set(data);
        this.status.set('ready');
      },
      error: () => this.status.set('error'),
    });
  }

  /** Abre el formulario en modo creación. */
  nuevoProblema(): void {
    this.editingId = null;
    this.form.reset({
      titulo: '',
      juez: '',
      alias: '',
      dificultad: null,
      tema_1: '',
      tema_2: '',
      tema_3: '',
      tema_4: '',
      url: '',
    });
    this.resetCamposNuevo();
    this.formMode.set('create');
  }

  /**
   * Abre el formulario en modo edición con los datos del problema.
   * @param p Problema a editar.
   */
  editarProblema(p: Problema): void {
    if (!p._id) {
      this.toastr.error('Este problema no tiene identificador.');
      return;
    }
    this.editingId = p._id;
    this.form.reset({
      titulo: p.titulo,
      juez: p.juez,
      alias: p.alias ?? '',
      dificultad: p.dificultad,
      tema_1: p.tema_1 ?? '',
      tema_2: p.tema_2 ?? '',
      tema_3: p.tema_3 ?? '',
      tema_4: p.tema_4 ?? '',
      url: p.url,
    });
    this.resetCamposNuevo();
    this.formMode.set('edit');
  }

  /** Cierra el formulario sin guardar. */
  cancelar(): void {
    this.formMode.set('hidden');
  }

  /** Crea o actualiza el problema según el modo del formulario. */
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const valores = this.form.getRawValue();
    const payload: CrearProblema = {
      titulo: valores.titulo ?? '',
      juez: valores.juez ?? '',
      alias: valores.alias ?? '',
      dificultad: Number(valores.dificultad),
      tema_1: valores.tema_1 ?? '',
      tema_2: valores.tema_2 ?? '',
      tema_3: valores.tema_3 ?? '',
      tema_4: valores.tema_4 ?? '',
      url: valores.url ?? '',
    };

    this.saving.set(true);
    const id = this.editingId;
    const esEdicion = this.formMode() === 'edit';
    const req$ =
      esEdicion && id != null
        ? this.problemService.updateProblem(id, payload)
        : this.problemService.createProblem(payload);

    req$.subscribe({
      next: () => {
        this.toastr.success(
          esEdicion ? 'Problema actualizado.' : 'Problema creado.',
        );
        this.saving.set(false);
        this.formMode.set('hidden');
        this.cargar();
      },
      error: (err) => {
        this.toastr.error(mensajeDeError(err, 'No se pudo guardar.'));
        this.saving.set(false);
      },
    });
  }

  /**
   * Elimina un problema, previa confirmación.
   * @param p Problema a eliminar.
   */
  async eliminarProblema(p: Problema): Promise<void> {
    if (!p._id) {
      this.toastr.error('Este problema no tiene identificador.');
      return;
    }
    const confirmado = await this.confirm.ask({
      titulo: 'Eliminar problema',
      mensaje: `¿Eliminar el problema "${p.titulo}"? Esta acción es permanente.`,
      textoConfirmar: 'Eliminar',
      peligro: true,
    });
    if (!confirmado) {
      return;
    }
    this.deletingId.set(p._id);
    this.problemService.deleteProblem(p._id).subscribe({
      next: () => {
        this.toastr.success('Problema eliminado.');
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
   * Devuelve los valores no vacíos, sin duplicados y ordenados alfabéticamente.
   * @param valores Lista de valores (posiblemente con vacíos/repetidos).
   */
  /**
   * Guarda en el control el tema elegido en el selector.
   * @param campo Nombre del control (tema_1..4).
   * @param event Evento del `<select>`.
   */
  onCampoSelect(campo: string, event: Event): void {
    this.form.get(campo)?.setValue((event.target as HTMLSelectElement).value);
  }

  /**
   * Activa el modo de escritura para introducir un valor nuevo.
   * @param campo Nombre del control (juez o tema_1..4).
   */
  activarNuevo(campo: string): void {
    this.campoNuevo[campo] = true;
    this.form.get(campo)?.setValue('');
  }

  /**
   * Vuelve del modo "escribir nuevo" al selector.
   * @param campo Nombre del control (juez o tema_1..4).
   */
  volverASelector(campo: string): void {
    this.campoNuevo[campo] = false;
    this.form.get(campo)?.setValue('');
  }

  /** Restablece juez y todos los campos de tema al modo selector. */
  private resetCamposNuevo(): void {
    this.campoNuevo = {
      juez: false,
      tema_1: false,
      tema_2: false,
      tema_3: false,
      tema_4: false,
    };
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

  /**
   * Une los temas no vacíos de un problema para mostrarlos como chips.
   * @param problema Problema.
   * @returns Lista de temas presentes.
   */
  readonly temasDe = (problema: Problema): string[] =>
    [problema.tema_1, problema.tema_2, problema.tema_3, problema.tema_4].filter(
      (tema): tema is string => tema.trim().length > 0,
    );

  /**
   * Indica si un control del formulario debe mostrarse como inválido.
   * @param nombreControl Nombre del control.
   */
  invalido(nombreControl: string): boolean {
    const control = this.form.get(nombreControl);
    return control != null && control.invalid && control.touched;
  }
}
