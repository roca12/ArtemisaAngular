import { Component, OnInit } from '@angular/core';
import { SyllabusService } from '../services/syllabus.service';
import { Temario } from '../shared/models/temario.model';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../services/theme.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { RecomendationService } from '../services/recomendation.service';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { TemaDetalleComponent } from '../shared/components/tema-detalle/tema-detalle.component';

@Component({
  selector: 'app-temario',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    NgbAccordionModule,
    SpinnerComponent,
    TemaDetalleComponent,
  ],
  templateUrl: './temario.component.html',
  styleUrl: './temario.component.css',
})
export class TemarioComponent implements OnInit {
  loading = false;
  temario: Temario[] = [];
  superGrupos: string[] = [];
  filtrosSeleccionados: { [key: string]: boolean } = {};

  constructor(
    private syllabus: SyllabusService,
    private toastService: ToastrService,
    public theme: ThemeService,
    private route: ActivatedRoute,
    private recoService: RecomendationService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.initializeTemario();
    this.initializeSupergrupos();
    this.leerFiltroDeRuta();
  }

  private leerFiltroDeRuta(): void {
    this.route.queryParamMap.subscribe((params) => {
      const filtro = params.get('filtro');
      if (filtro) {
        this.filtrosSeleccionados[filtro] = true;
      }
    });
  }

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

  temarioFiltrado(): Temario[] {
    const activos = this.filtrosActivos();
    if (activos.length === 0) return this.temario;
    return this.temario.filter(
      (t) => activos.includes(t.supergrupo) || activos.includes(t.tema),
    );
  }

  private filtrosActivos(): string[] {
    return Object.entries(this.filtrosSeleccionados)
      .filter(([, val]) => val)
      .map(([key]) => key);
  }
}
