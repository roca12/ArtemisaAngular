import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faArrowUpRightFromSquare,
  faLink,
  faPen,
  faPlus,
  faTrash,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { CrearLink, LinkService } from '../../services/link.service';
import { Link } from '../../shared/models/link.model';
import { mensajeDeError } from '../../shared/utils/http-error';
import { CrudModalComponent } from '../../shared/components/crud-modal/crud-modal.component';

/** Estado de carga del listado. */
type CrudStatus = 'loading' | 'ready' | 'error';
/** Modo del formulario: oculto, creando o editando. */
type FormMode = 'hidden' | 'create' | 'edit';

/**
 * Sección de administración de enlaces valiosos (CRUD completo).
 *
 * Lista los enlaces en una tabla y permite crear, editar y eliminar. El campo
 * `tags` es un string separado por comas (contrato del backend); se muestra
 * como chips. El identificador para editar/eliminar es el `_id` de MongoDB.
 */
@Component({
  selector: 'app-link',
  imports: [ReactiveFormsModule, FaIconComponent, CrudModalComponent],
  templateUrl: './link.component.html',
  styleUrl: '../crud-section.css',
})
export class LinkComponent implements OnInit {
  /** Servicio de enlaces. */
  private readonly linkService = inject(LinkService);
  /** Servicio de notificaciones. */
  private readonly toastr = inject(ToastrService);
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);

  /** Estado del listado. */
  readonly status = signal<CrudStatus>('loading');
  /** Enlaces cargados. */
  readonly links = signal<Link[]>([]);
  /** Modo actual del formulario. */
  readonly formMode = signal<FormMode>('hidden');
  /** `_id` del enlace en edición (null al crear). */
  private editingId: string | null = null;
  /** Flag de envío del formulario. */
  readonly saving = signal(false);
  /** `_id` del enlace que se está eliminando. */
  readonly deletingId = signal<string | null>(null);
  /** Claves de los logos cuya imagen no se pudo cargar. */
  readonly logosRotos = signal<Set<string>>(new Set());

  /** Título del formulario según el modo. */
  readonly formTitle = computed(() =>
    this.formMode() === 'edit' ? 'Editar enlace' : 'Nuevo enlace',
  );

  /** Formulario reactivo del enlace. */
  readonly form = this.fb.group({
    nombre: ['', Validators.required],
    url: ['', Validators.required],
    tags: ['', Validators.required],
    icono: ['', Validators.required],
  });

  /** Iconos. */
  readonly faLink = faLink;
  readonly faPlus = faPlus;
  readonly faPen = faPen;
  readonly faTrash = faTrash;
  readonly faExternal = faArrowUpRightFromSquare;
  readonly faImagenRota = faTriangleExclamation;

  ngOnInit(): void {
    this.cargar();
  }

  /** Carga (o recarga) la lista de enlaces desde el backend. */
  cargar(): void {
    this.status.set('loading');
    this.logosRotos.set(new Set());
    this.linkService.obtenerLinks().subscribe({
      next: (data) => {
        this.links.set(data);
        this.status.set('ready');
      },
      error: () => this.status.set('error'),
    });
  }

  /** Abre el formulario en modo creación. */
  nuevoLink(): void {
    this.editingId = null;
    this.form.reset({ nombre: '', url: '', tags: '', icono: '' });
    this.formMode.set('create');
  }

  /**
   * Abre el formulario en modo edición con los datos del enlace.
   * @param l Enlace a editar.
   */
  editarLink(l: Link): void {
    if (!l._id) {
      this.toastr.error('Este enlace no tiene identificador.');
      return;
    }
    this.editingId = l._id;
    this.form.reset({
      nombre: l.nombre,
      url: l.url,
      tags: l.tags,
      icono: l.icono,
    });
    this.formMode.set('edit');
  }

  /** Cierra el formulario sin guardar. */
  cancelar(): void {
    this.formMode.set('hidden');
  }

  /** Crea o actualiza el enlace según el modo del formulario. */
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: CrearLink = {
      nombre: v.nombre ?? '',
      url: v.url ?? '',
      tags: v.tags ?? '',
      icono: v.icono ?? '',
    };

    this.saving.set(true);
    const esEdicion = this.formMode() === 'edit' && this.editingId;
    const req$ = esEdicion
      ? this.linkService.actualizarLink(this.editingId!, payload)
      : this.linkService.crearLink(payload);

    req$.subscribe({
      next: () => {
        this.toastr.success(esEdicion ? 'Enlace actualizado.' : 'Enlace creado.');
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
   * Elimina un enlace, previa confirmación.
   * @param l Enlace a eliminar.
   */
  eliminarLink(l: Link): void {
    if (!l._id) {
      this.toastr.error('Este enlace no tiene identificador.');
      return;
    }
    if (!confirm(`¿Eliminar el enlace "${l.nombre}"? Esta acción es permanente.`)) {
      return;
    }
    this.deletingId.set(l._id);
    this.linkService.eliminarLink(l._id).subscribe({
      next: () => {
        this.toastr.success('Enlace eliminado.');
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
   * Clave estable para identificar el logo de un enlace.
   * @param l Enlace.
   */
  private claveLogo(l: Link): string {
    return l._id ?? l.icono;
  }

  /**
   * Marca el logo de un enlace como no cargable (imagen rota).
   * @param l Enlace cuyo `<img>` disparó el evento `error`.
   */
  onLogoError(l: Link): void {
    const rotos = new Set(this.logosRotos());
    rotos.add(this.claveLogo(l));
    this.logosRotos.set(rotos);
  }

  /**
   * Indica si el logo de un enlace no se pudo cargar.
   * @param l Enlace.
   */
  logoFallo(l: Link): boolean {
    return this.logosRotos().has(this.claveLogo(l));
  }

  /**
   * Separa el string de tags (por comas) en una lista de etiquetas no vacías.
   * @param tags String de tags separado por comas.
   * @returns Lista de etiquetas.
   */
  tagsDe(tags: string): string[] {
    return (tags ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }

  /**
   * Indica si un control del formulario debe mostrarse como inválido.
   * @param control Nombre del control.
   */
  invalido(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && c.touched;
  }
}
