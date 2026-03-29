import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProblemService } from '../services/problem.service';
import { Problema } from '../shared/models/problema.model';
import { ActivatedRoute } from '@angular/router';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

@Component({
  selector: 'app-problemas',
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
  loading = true;
  constructor(
    public theme: ThemeService,
    public problemService: ProblemService,
    private route: ActivatedRoute,
  ) {}

  problems: Problema[] = [];
  filtrosSeleccionados: { [key: string]: boolean } = {};
  subtemaSeleccionado: string = '';

  ngOnInit(): void {
    this.problemService.getProblems().subscribe({
      next: (response) => {
        this.problems = response.data as Problema[];
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

  listarTemas(): string[] {
    let conjunto: Set<string> = new Set();
    this.problems.forEach((p) => {
      conjunto.add(p.tema_1);
    });
    return Array.from(conjunto);
  }

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
        delete this.filtrosSeleccionados[key];
      }
    });
  }

  toggleSubtema(subtema: string) {
    this.filtrosSeleccionados[subtema] = !this.filtrosSeleccionados[subtema];
  }

  isSubtemaActivo(subtema: string): boolean {
    return !!this.filtrosSeleccionados[subtema];
  }

  listarDificultades(): string[] {
    let conjunto: Set<string> = new Set();
    this.problems.forEach((p) => {
      conjunto.add(this.determinarNivel(p.dificultad));
    });
    return Array.from(conjunto);
  }

  listarJueces(): string[] {
    let conjunto: Set<string> = new Set();
    this.problems.forEach((p) => {
      conjunto.add(p.juez);
    });
    return Array.from(conjunto);
  }

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

  onSubtemaChange() {
    if (this.subtemaSeleccionado) {
      this.resetSubtemaFilters();
      this.filtrosSeleccionados[this.subtemaSeleccionado] = true;
    } else {
      this.resetSubtemaFilters();
    }
  }

  resetSubtemaFilters() {
    const subtemas = this.listarSubtemas();
    subtemas.forEach((subtema) => {
      this.filtrosSeleccionados[subtema] = false;
    });
  }

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
