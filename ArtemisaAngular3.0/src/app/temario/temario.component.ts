import { Component, inject, OnInit } from '@angular/core';
import { SyllabusService } from '../services/syllabus.service';
import { Temario } from '../shared/models/temario.model';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../services/theme.service';

import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { TemaDetalleComponent } from '../shared/components/tema-detalle/tema-detalle.component';

/**
 * Componente que muestra el temario de programación competitiva.
 * Permite visualizar temas organizados por supergrupos y filtrarlos.
 */
@Component({
  selector: 'app-temario',
  standalone: true,
  imports: [
    FormsModule,
    NgbAccordionModule,
    SpinnerComponent,
    TemaDetalleComponent
],
  templateUrl: './temario.component.html',
  styleUrl: './temario.component.css',
})
export class TemarioComponent implements OnInit {
  /** Indica si los datos del temario se están cargando. */
  loading = false;
  /** Lista completa de temas del temario. */
  temario: Temario[] = [];
  /** Lista de nombres de supergrupos (categorías principales). */
  superGrupos: string[] = [];
  /** Mapa de filtros activos seleccionados por el usuario. */
  filtrosSeleccionados: { [key: string]: boolean } = {};

  /** Servicio para obtener los datos del temario y supergrupos. */
  private syllabus = inject(SyllabusService);
  /** Servicio para mostrar notificaciones de error. */
  private toastService = inject(ToastrService);
  /** Servicio para gestionar el tema visual. */
  public theme = inject(ThemeService);
  /** Servicio para acceder a los parámetros de la URL. */
  private route = inject(ActivatedRoute);

  /**
   * Ciclo de vida OnInit: Inicializa la carga del temario, supergrupos y procesa filtros de la ruta.
   */
  ngOnInit(): void {
    this.loading = true;
    this.initializeTemario();
    this.initializeSupergrupos();
    this.leerFiltroDeRuta();
  }

  /**
   * Suscribe a los cambios en los parámetros de consulta de la ruta para aplicar filtros iniciales.
   */
  private leerFiltroDeRuta(): void {
    this.route.queryParamMap.subscribe((params) => {
      const filtro = params.get('filtro');
      if (filtro) {
        this.filtrosSeleccionados[filtro] = true;
      }
    });
  }

  /**
   * Obtiene la lista completa de temas desde el servicio Syllabus.
   */
  private initializeTemario(): void {
    this.syllabus.getSyllabus().subscribe({
      next: (response) => {
        this.temario = response.data as Temario[];
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Error al obtener el temario', 'Error');
        this.loading = false;
      },
    });
  }

  /**
   * Obtiene la lista de supergrupos desde el servicio Syllabus.
   */
  private initializeSupergrupos(): void {
    this.syllabus.getSuperGrupos().subscribe({
      next: (response) => {
        this.superGrupos = response.data as string[];
      },
      error: () => {
        this.toastService.error('Error al obtener los supergrupos', 'Error');
      },
    });
  }

  /**
   * Filtra el temario basado en los filtros (supergrupos o temas) seleccionados por el usuario.
   * @returns Arreglo de temas filtrados.
   */
  temarioFiltrado(): Temario[] {
    const activos = this.filtrosActivos();
    if (activos.length === 0) return this.temario;
    return this.temario.filter(
      (t) => activos.includes(t.supergrupo) || activos.includes(t.tema),
    );
  }

  /**
   * Obtiene una lista de los nombres de los filtros que están actualmente activos.
   * @returns Arreglo de strings con los nombres de los filtros activos.
   */
  private filtrosActivos(): string[] {
    return Object.entries(this.filtrosSeleccionados)
      .filter(([, val]) => val)
      .map(([key]) => key);
  }
}
