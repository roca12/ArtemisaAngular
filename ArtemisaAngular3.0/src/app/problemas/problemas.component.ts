import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProblemService } from '../services/problem.service';
import { Problema } from '../shared/models/problema.model';
import { ActivatedRoute } from '@angular/router';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';

/**
 * Componente que gestiona la visualización y filtrado de problemas de programación competitiva.
 * Permite filtrar por tema, subtema, dificultad y juez.
 */
@Component({
  selector: 'app-problems',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NgSwitchCase,
    NgSwitch,
    SpinnerComponent,
  ],
  templateUrl: './problemas.component.html',
  styleUrl: './problemas.component.css',
})
export class ProblemasComponent implements OnInit {
  /** Indica si los problemas se están cargando desde el servidor. */
  loading = true;

  /** Servicio para gestionar el tema (claro/oscuro). */
  public theme = inject(ThemeService);
  /** Servicio para obtener los problemas. */
  public problemService = inject(ProblemService);
  /** Servicio para el enrutamiento y acceso a parámetros de la URL. */
  private route = inject(ActivatedRoute);

  /** Lista completa de problemas obtenidos del servidor. */
  problems: Problema[] = [];
  /** Mapa de filtros seleccionados por el usuario (clave: nombre del filtro, valor: estado activo). */
  filtrosSeleccionados: { [key: string]: boolean } = {};
  /** Almacena el subtema seleccionado actualmente. */
  subtemaSeleccionado = '';

  /**
   * Ciclo de vida OnInit: Carga los problemas y aplica filtros iniciales desde los parámetros de la URL.
   */
  ngOnInit(): void {
    this.problemService.getProblems().subscribe({
      next: (response) => {
        this.problems = response as Problema[];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener los problemas:', error);
      },
    });
    const filtro = this.route.snapshot.queryParamMap.get('filtro');
    if (filtro) {
      this.filtrosSeleccionados[filtro] = true;
    }
  }

  /**
   * Obtiene una lista única de los temas principales disponibles en los problemas.
   * @returns Arreglo de strings con los nombres de los temas.
   */
  listarTemas(): string[] {
    const conjunto: Set<string> = new Set();
    this.problems.forEach((p) => {
      conjunto.add(p.tema_1);
    });
    return Array.from(conjunto);
  }

  /**
   * Obtiene una lista única de subtemas basados en los temas principales seleccionados.
   * @returns Arreglo de strings con los nombres de los subtemas secundarios.
   */
  listarSubtemas(): string[] {
    const temasFiltrados = Object.entries(this.filtrosSeleccionados)
      .filter(([key, val]) => val && this.listarTemas().includes(key))
      .map(([key]) => key);

    const conjuntoPrincipal: Set<string> = new Set(
      this.problems.map((p) => p.tema_1),
    );
    const conjuntoSecundario: Set<string> = new Set();

    const problemasFiltrados =
      temasFiltrados.length > 0
        ? this.problems.filter((p) => temasFiltrados.includes(p.tema_1))
        : [];

    problemasFiltrados.forEach((p) => {
      [p.tema_2, p.tema_3, p.tema_4].forEach((t) => {
        if (t && !conjuntoPrincipal.has(t)) {
          conjuntoSecundario.add(t);
        }
      });
    });

    return Array.from(conjuntoSecundario);
  }

  /**
   * Maneja los cambios en la selección de temas principales y limpia filtros obsoletos.
   */
  onTemaChange() {
    const subtemasDisponibles = new Set(this.listarSubtemas());
    const temas = new Set(this.listarTemas());
    const dificultades = new Set(this.listarDificultades());
    const jueces = new Set(this.listarJueces());

    Object.keys(this.filtrosSeleccionados).forEach((key) => {
      if (
        !subtemasDisponibles.has(key) &&
        !temas.has(key) &&
        !dificultades.has(key) &&
        !jueces.has(key)
      ) {
        this.filtrosSeleccionados[key] = false;
      }
    });
  }

  /**
   * Alterna el estado de un filtro de subtema.
   * @param subtema Nombre del subtema a alternar.
   */
  toggleSubtema(subtema: string) {
    this.filtrosSeleccionados[subtema] = !this.filtrosSeleccionados[subtema];
  }

  /**
   * Verifica si un subtema específico está marcado como activo.
   * @param subtema Nombre del subtema.
   * @returns true si está activo, false en caso contrario.
   */
  isSubtemaActivo(subtema: string): boolean {
    return Boolean(this.filtrosSeleccionados[subtema]);
  }

  /**
   * Obtiene una lista única de niveles de dificultad disponibles.
   * @returns Arreglo de strings con los nombres de los niveles.
   */
  listarDificultades(): string[] {
    const conjunto: Set<string> = new Set();
    this.problems.forEach((p) => {
      conjunto.add(this.determinarNivel(p.dificultad));
    });
    return Array.from(conjunto);
  }

  /**
   * Obtiene una lista única de jueces disponibles.
   * @returns Arreglo de strings con los nombres de los jueces.
   */
  listarJueces(): string[] {
    const conjunto: Set<string> = new Set();
    this.problems.forEach((p) => {
      conjunto.add(p.juez);
    });
    return Array.from(conjunto);
  }

  /**
   * Clasifica un valor numérico de dificultad en un nivel textual.
   * @param dificultad Valor numérico de la dificultad.
   * @returns Nivel textual (Aprendíz, Básica, Intermedia, Avanzada, Élite).
   */
  determinarNivel(dificultad: number): string {
    if (dificultad <= 5) {
      return 'Aprendíz';
    } else if (dificultad <= 10) {
      return 'Básica';
    } else if (dificultad <= 15) {
      return 'Intermedia';
    } else if (dificultad <= 20) {
      return 'Avanzada';
    } else {
      return 'Élite';
    }
  }

  /**
   * Maneja el cambio en el selector de subtemas y resetea filtros anteriores de subtema.
   */
  onSubtemaChange() {
    if (this.subtemaSeleccionado) {
      this.resetSubtemaFilters();
      this.filtrosSeleccionados[this.subtemaSeleccionado] = true;
    } else {
      this.resetSubtemaFilters();
    }
  }

  /**
   * Desactiva todos los filtros de subtema activos.
   */
  resetSubtemaFilters() {
    const subtemas = this.listarSubtemas();
    subtemas.forEach((subtema) => {
      this.filtrosSeleccionados[subtema] = false;
    });
  }

  /**
   * Aplica la lógica de filtrado a la lista completa de problemas basada en los filtros activos.
   * @returns Arreglo de problemas que cumplen con todos los criterios de filtrado.
   */
  filterProblems(): Problema[] {
    const activos = Object.entries(this.filtrosSeleccionados)
      .filter(([_, val]) => val)
      .map(([key]) => key);

    if (activos.length === 0) return this.problems;

    const temas = new Set(this.listarTemas());
    const dificultades = new Set(this.listarDificultades());
    const jueces = new Set(this.listarJueces());

    const temasFiltro = activos.filter((a) => temas.has(a));
    const dificultadesFiltro = activos.filter((a) => dificultades.has(a));
    const jueceFiltro = activos.filter((a) => jueces.has(a));
    const subtemasFiltro = activos.filter(
      (a) => !temas.has(a) && !dificultades.has(a) && !jueces.has(a),
    );

    return this.problems.filter((p) => {
      const cumpleTema =
        temasFiltro.length === 0 || temasFiltro.includes(p.tema_1);
      const cumpleDificultad =
        dificultadesFiltro.length === 0 ||
        dificultadesFiltro.includes(this.determinarNivel(p.dificultad));
      const cumpleJuez =
        jueceFiltro.length === 0 || jueceFiltro.includes(p.juez);
      const cumpleSubtema =
        subtemasFiltro.length === 0 ||
        [p.tema_2, p.tema_3, p.tema_4].some(
          (t) => t && subtemasFiltro.includes(t),
        );

      return cumpleTema && cumpleDificultad && cumpleJuez && cumpleSubtema;
    });
  }
}
