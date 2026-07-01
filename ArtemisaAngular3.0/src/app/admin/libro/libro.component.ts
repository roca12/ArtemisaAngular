import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faBook,
  faFilePdf,
  faImage,
  faPen,
  faPlus,
  faTrash,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BookService } from '../../services/book.service';
import { RecomendationService } from '../../services/recomendation.service';
import { Libro } from '../../shared/models/libro.model';
import { mensajeDeError } from '../../shared/utils/http-error';
import { extraerPortada } from '../../shared/utils/pdf-cover';
import { CrudModalComponent } from '../../shared/components/crud-modal/crud-modal.component';

/** Estado de carga del listado. */
type CrudStatus = 'loading' | 'ready' | 'error';
/** Modo del formulario: oculto, creando o editando. */
type FormMode = 'hidden' | 'create' | 'edit';

/**
 * Sección de administración de libros (CRUD completo).
 *
 * Se sube el **PDF** y el backend lo guarda en **Cloudinary** (multipart, tanto
 * al crear como al editar). La **portada** se genera automáticamente a partir de
 * la primera página del PDF (con pdf.js) y se sube también; opcionalmente puede
 * reemplazarse por una imagen propia.
 *
 * El identificador para editar/eliminar es el `_id` de MongoDB.
 */
@Component({
  selector: 'app-libro',
  imports: [ReactiveFormsModule, FaIconComponent, CrudModalComponent],
  templateUrl: './libro.component.html',
  styleUrl: '../crud-section.css',
})
export class LibroComponent implements OnInit {
  /** Servicio de libros. */
  private readonly bookService = inject(BookService);
  /** Servicio de recomendaciones (para refrescar el buscador tras un cambio). */
  private readonly recoService = inject(RecomendationService);
  /** Servicio de notificaciones. */
  private readonly toastr = inject(ToastrService);
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);

  /** Estado del listado. */
  readonly status = signal<CrudStatus>('loading');
  /** Libros cargados. */
  readonly libros = signal<Libro[]>([]);
  /** Modo actual del formulario. */
  readonly formMode = signal<FormMode>('hidden');
  /** Libro en edición (para mostrar sus archivos actuales). */
  readonly editing = signal<Libro | null>(null);
  /** Flag de envío del formulario. */
  readonly saving = signal(false);
  /** `_id` del libro que se está eliminando. */
  readonly deletingId = signal<string | null>(null);
  /** Claves de las portadas cuya imagen no se pudo cargar. */
  readonly portadasRotas = signal<Set<string>>(new Set());

  /** PDF seleccionado para subir. */
  readonly pdfFile = signal<File | null>(null);
  /** Nombre del PDF seleccionado (para mostrarlo). */
  readonly pdfNombre = signal<string>('');
  /** Imagen de portada a subir (generada del PDF o elegida a mano). */
  readonly coverFile = signal<File | null>(null);
  /** Previsualización de la portada (data URL). */
  readonly coverPreview = signal<string | null>(null);
  /** Indica si se está generando la portada desde el PDF. */
  readonly generandoPortada = signal(false);

  /**
   * Tamaño máximo por archivo (~5 MB). El límite real de Netlify ronda los 6 MB
   * (no 10), así que validamos antes de subir para evitar un 413 del backend.
   */
  private readonly MAX_ARCHIVO = 5 * 1024 * 1024;
  /** Tipos MIME aceptados para la portada elegida a mano. */
  private readonly TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'];

  /** Título del formulario según el modo. */
  readonly formTitle = computed(() =>
    this.formMode() === 'edit' ? 'Editar libro' : 'Nuevo libro',
  );

  /** Formulario reactivo del libro. */
  readonly form = this.fb.group({
    titulo: ['', Validators.required],
  });

  /** Iconos. */
  readonly faBook = faBook;
  readonly faPlus = faPlus;
  readonly faPen = faPen;
  readonly faTrash = faTrash;
  readonly faFilePdf = faFilePdf;
  readonly faImagen = faImage;
  readonly faImagenRota = faTriangleExclamation;

  ngOnInit(): void {
    this.cargar();
  }

  /** Carga (o recarga) la lista de libros desde el backend. */
  cargar(): void {
    this.status.set('loading');
    this.portadasRotas.set(new Set());
    this.bookService.getLibros().subscribe({
      next: (data) => {
        this.libros.set(data);
        this.status.set('ready');
      },
      error: () => this.status.set('error'),
    });
  }

  /** Limpia el PDF y la portada seleccionados. */
  private limpiarArchivos(): void {
    this.pdfFile.set(null);
    this.pdfNombre.set('');
    this.coverFile.set(null);
    this.coverPreview.set(null);
    this.generandoPortada.set(false);
  }

  /** Abre el formulario en modo creación. */
  nuevoLibro(): void {
    this.editing.set(null);
    this.limpiarArchivos();
    this.form.reset({ titulo: '' });
    this.formMode.set('create');
  }

  /**
   * Abre el formulario en modo edición con los datos del libro.
   * @param l Libro a editar.
   */
  editarLibro(l: Libro): void {
    if (!l._id) {
      this.toastr.error('Este libro no tiene identificador.');
      return;
    }
    this.editing.set(l);
    this.limpiarArchivos();
    this.form.reset({ titulo: l.titulo });
    this.formMode.set('edit');
  }

  /** Cierra el formulario sin guardar. */
  cancelar(): void {
    this.formMode.set('hidden');
  }

  /**
   * Al seleccionar un PDF: lo guarda y genera automáticamente la portada
   * a partir de su primera página.
   * @param event Evento del input de archivo.
   */
  async onPdfSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.coverFile.set(null);
    this.coverPreview.set(null);
    if (!file) {
      this.pdfFile.set(null);
      this.pdfNombre.set('');
      return;
    }
    if (file.type !== 'application/pdf') {
      this.toastr.error('El archivo debe ser un PDF.');
      input.value = '';
      this.pdfFile.set(null);
      this.pdfNombre.set('');
      return;
    }
    if (file.size > this.MAX_ARCHIVO) {
      this.toastr.error('El PDF supera el límite de 5 MB.');
      input.value = '';
      this.pdfFile.set(null);
      this.pdfNombre.set('');
      return;
    }
    this.pdfFile.set(file);
    this.pdfNombre.set(file.name);

    this.generandoPortada.set(true);
    try {
      const nombrePortada = file.name.replace(/\.pdf$/i, '') + '-portada.jpg';
      const portada = await extraerPortada(file, nombrePortada);
      this.coverFile.set(portada.file);
      this.coverPreview.set(portada.dataUrl);
    } catch {
      this.toastr.warning(
        'No se pudo generar la portada automáticamente; puedes subir una imagen.',
      );
    } finally {
      this.generandoPortada.set(false);
    }
  }

  /**
   * Reemplaza la portada automática por una imagen elegida a mano.
   * @param event Evento del input de archivo.
   */
  onPortadaManual(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) {
      return;
    }
    if (!this.TIPOS_IMAGEN.includes(file.type)) {
      this.toastr.error('La portada debe ser una imagen JPG, PNG o WebP.');
      input.value = '';
      return;
    }
    if (file.size > this.MAX_ARCHIVO) {
      this.toastr.error('La imagen supera el límite de 5 MB.');
      input.value = '';
      return;
    }
    this.coverFile.set(file);
    this.coverPreview.set(URL.createObjectURL(file));
  }

  /** Crea o actualiza el libro, subiendo el PDF y la portada a Cloudinary. */
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const titulo = this.form.getRawValue().titulo ?? '';
    const pdf = this.pdfFile();
    const cover = this.coverFile();
    const libroEnEdicion = this.editing();
    const esEdicion = this.formMode() === 'edit';

    if (!esEdicion && !pdf) {
      this.toastr.error('Selecciona un archivo PDF.');
      return;
    }

    this.saving.set(true);

    const datos = {
      titulo,
      archivoPdf: pdf ?? undefined,
      imagen: cover ?? undefined,
    };
    const req$: Observable<Libro> =
      esEdicion && libroEnEdicion?._id
        ? this.bookService.actualizarLibro(libroEnEdicion._id, datos)
        : this.bookService.crearLibro(datos);

    req$.subscribe({
      next: () => {
        this.toastr.success(esEdicion ? 'Libro actualizado.' : 'Libro creado.');
        this.saving.set(false);
        this.formMode.set('hidden');
        this.cargar();
        this.recoService.refreshLibros().catch(() => {});
      },
      error: (err) => {
        this.toastr.error(mensajeDeError(err, 'No se pudo guardar.'));
        this.saving.set(false);
      },
    });
  }

  /**
   * Elimina un libro, previa confirmación.
   * @param l Libro a eliminar.
   */
  eliminarLibro(l: Libro): void {
    if (!l._id) {
      this.toastr.error('Este libro no tiene identificador.');
      return;
    }
    if (!confirm(`¿Eliminar el libro "${l.titulo}"? Esta acción es permanente.`)) {
      return;
    }
    this.deletingId.set(l._id);
    this.bookService.eliminarLibro(l._id).subscribe({
      next: () => {
        this.toastr.success('Libro eliminado.');
        this.deletingId.set(null);
        this.cargar();
        this.recoService.refreshLibros().catch(() => {});
      },
      error: (err) => {
        this.toastr.error(mensajeDeError(err, 'No se pudo eliminar.'));
        this.deletingId.set(null);
      },
    });
  }

  /** Base de assets locales para las portadas (mismo path que usa el home). */
  private readonly BASE_PORTADAS = 'assets/images/libros/descargables/';
  /** Base de assets locales para los PDFs (mismo path que usa el home). */
  private readonly BASE_PDFS = 'assets/pdfs/';

  /**
   * Indica si un valor ya es una URL absoluta (p. ej. subida a Cloudinary).
   * @param v Valor a comprobar.
   */
  private esUrlAbsoluta(v: string): boolean {
    return /^https?:\/\//i.test(v);
  }

  /**
   * Resuelve la URL de la portada: los libros existentes guardan solo el nombre
   * de archivo (asset local), mientras que los actualizados vía Cloudinary
   * guardan una URL absoluta.
   * @param l Libro.
   */
  portadaSrc(l: Libro): string {
    const img = l.imagen ?? '';
    return this.esUrlAbsoluta(img) ? img : this.BASE_PORTADAS + img;
  }

  /**
   * Resuelve la URL del PDF (asset local por nombre o URL absoluta de Cloudinary).
   * @param l Libro.
   */
  pdfHref(l: Libro): string {
    const pdf = l.archivoPdf ?? '';
    return this.esUrlAbsoluta(pdf) ? pdf : this.BASE_PDFS + pdf;
  }

  /**
   * Clave estable para identificar la portada de un libro.
   * @param l Libro.
   */
  private clavePortada(l: Libro): string {
    return l._id ?? l.titulo;
  }

  /**
   * Marca la portada de un libro como no cargable (imagen rota).
   * @param l Libro cuyo `<img>` disparó el evento `error`.
   */
  onPortadaError(l: Libro): void {
    const rotas = new Set(this.portadasRotas());
    rotas.add(this.clavePortada(l));
    this.portadasRotas.set(rotas);
  }

  /**
   * Indica si la portada de un libro no se pudo cargar.
   * @param l Libro.
   */
  portadaFallo(l: Libro): boolean {
    return this.portadasRotas().has(this.clavePortada(l));
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
