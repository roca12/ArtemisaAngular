import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowUpShortWide,
  faCode,
  faCodeCompare,
  faDiagramProject,
  faMagnifyingGlass,
  faPenRuler,
  faPlusMinus,
  faSchool,
  faSquareBinary,
  faTextWidth,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../services/theme.service';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { BookService } from '../services/book.service';
import { Libro } from '../shared/models/libro.model';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PriorityQueue } from '../shared/structures/priorityqueue.structures';
import { RecomendationService } from '../services/recomendation.service';
import { Recomendation } from '../shared/models/recomendation.model';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgbCarouselModule,
    NgFor,
    SlicePipe,
    NgIf,
    SpinnerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnInit {
  loading = true;
  active: boolean = localStorage.getItem('darkMode') === 'true';
  cache: Map<string, PriorityQueue<Recomendation>> = new Map();

  @ViewChild('inputSearch') inputRef?: ElementRef<HTMLInputElement>;

  placeholderText: string[] = [
    '¿Qué vas a buscar hoy?',
    'Inspiración divina...',
    'Grafos',
    '...',
    '...',
    'Algoritmos de ordenamiento',
    'Algoritmos de búsqueda',
    '¿Qué es un capa 8?',
    'Programación dinámica',
    '...',
    '...',
    'Divide y Vencerás',
    'DFS o BFS esa es la cuestión',
    '¿Cómo debugeo sin llorar?',
  ];

  index = 0;
  phraseIdx = 0;

  @ViewChild('carousel', { static: false })
  carousel!: ElementRef<HTMLDivElement>;

  constructor(
    public theme: ThemeService,
    private bookService: BookService,
    private router: Router,
    private recomendationsService: RecomendationService,
  ) {}

  public libros: Libro[] = [];

  search(cadena: string): void {
    const bestReco = this.filterRecomendations(cadena).dequeue();
    if (bestReco) {
      switch (bestReco.type) {
        case 'libro': {
          let pdf = '';
          this.libros.forEach((libro) => {
            if (libro.titulo === bestReco.data) {
              pdf = libro.archivoPdf;
            }
          });
          this.verPdf(pdf);
          break;
        }
        case 'tema-problema': {
          this.router.navigate(['/problemas'], {
            queryParams: { filtro: bestReco.data },
          });
          break;
        }
        case 'dificultad-problema': {
          this.router.navigate(['/problemas'], {
            queryParams: { filtro: bestReco.data },
          });
          break;
        }
        case 'juez-problema': {
          this.router.navigate(['/problemas'], {
            queryParams: { filtro: bestReco.data },
          });
          break;
        }
        case 'grupo-temario': {
          this.irATemario(bestReco.data);
          break;
        }
        case 'subtema-problema': {
          this.router.navigate(['/problemas'], {
            queryParams: { filtro: bestReco.data },
          });
          break;
        }
        case 'tema': {
          this.router.navigate(['/temario'], {
            queryParams: { filtro: bestReco.data },
          });
          break;
        }
        case 'problema': {
          this.router.navigate(['/problemas'], {
            queryParams: { filtro: bestReco.data },
          });
          break;
        }
      }
    }
  }

  getValorInput() {
    if (this.inputRef) {
      return this.inputRef.nativeElement.value;
    }
    return '';
  }

  autocompletar(reco: Recomendation) {
    if (this.inputRef) this.inputRef.nativeElement.value = reco.data;
    this.search(reco.data);
  }

  ngOnInit(): void {
    this.bookService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
        this.loading = false;
      },
    });
  }

  ngAfterViewInit(): void {
    this.active = localStorage.getItem('darkMode') === 'true';
    this.applyDarkMode();
    this.typePlaceHolder();
  }

  applyDarkMode(): void {
    const body = document.body;
    if (this.active) {
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      body.classList.remove('dark');
      body.classList.add('light');
    }
  }

  typePlaceHolder(): void {
    const text = this.placeholderText[this.phraseIdx];

    if (this.index <= text.length && this.inputRef) {
      this.inputRef.nativeElement.placeholder = text.slice(0, this.index + 1);
      this.index++;
      setTimeout(() => this.typePlaceHolder(), 100);
    } else {
      // Reinicia
      this.index = 0;
      this.phraseIdx = (this.phraseIdx + 1) % this.placeholderText.length;
      setTimeout(() => this.typePlaceHolder(), 1500);
    }
  }

  scrollCarousel(direction: 'left' | 'right') {
    const step = 300;
    const container = this.carousel.nativeElement;

    const current = container.scrollLeft;
    const next = direction === 'right' ? current + step : current - step;

    container.scrollTo({ left: next, behavior: 'smooth' });
  }

  descargarLibro(pdf: string): void {
    const link = document.createElement('a');
    link.href = `assets/pdfs/${pdf}`;
    link.download = pdf;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  verPdf(pdf: string) {
    window.open(`assets/pdfs/${pdf}`, '_blank');
  }

  irATemario(filtro: string) {
    this.router.navigate(['/temario'], { queryParams: { filtro } });
  }

  calcularSimilitudes(texto1: string, texto2: string): number {
    const s1 = texto1.toLowerCase();
    const s2 = texto2.toLowerCase();
    const m = s1.length;
    const n = s2.length;

    if (m === 0) return n;
    if (n === 0) return m;

    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    let curr = new Array(n + 1).fill(0);

    for (let i = 1; i <= m; i++) {
      curr[0] = i;
      for (let j = 1; j <= n; j++) {
        const costo = s1[i - 1] === s2[j - 1] ? 0 : 1;
        curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + costo);
      }
      [prev, curr] = [curr, prev];
    }

    return prev[n];
  }

  private similitudPalabras(a: string, b: string): number {
    const a2 = a.toLowerCase();
    const b2 = b.toLowerCase();

    if (a2.startsWith(b2) || b2.startsWith(a2)) return 1;

    const dist = this.calcularSimilitudes(a2, b2);
    const maxLen = Math.max(a2.length, b2.length);
    return 1 - dist / maxLen;
  }

  private similitudFrases(consulta: string, candidato: string): number {
    const palabrasConsulta = consulta
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    const palabrasCandidato = candidato
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const scoresPorPalabraCandidato = palabrasCandidato.map((pc) =>
      Math.max(...palabrasConsulta.map((pq) => this.similitudPalabras(pq, pc))),
    );

    const scoreBase =
      scoresPorPalabraCandidato.reduce((a, b) => a + b, 0) /
      scoresPorPalabraCandidato.length;

    const prefixBonus = candidato
      .toLowerCase()
      .startsWith(consulta.toLowerCase().trim())
      ? 0.15
      : 0;

    return Math.min(1, scoreBase + prefixBonus);
  }

  filterRecomendations(cadena: string): PriorityQueue<Recomendation> {
    const query = cadena.trim();
    if (!query) return new PriorityQueue<Recomendation>();
    if (this.cache.has(query))
      return this.cache.get(query) ?? new PriorityQueue<Recomendation>();

    const result = new PriorityQueue<Recomendation>();

    this.recomendationsService.getRecomendations().forEach((rec) => {
      const score = this.similitudFrases(query, rec.data);
      if (score >= 0.3 && result.find(rec) === undefined) {
        result.enqueue(rec, score);
      }
    });

    this.cache.set(query, result);
    return result;
  }

  protected readonly faTextWidth = faTextWidth;
  protected readonly faSchool = faSchool;
  protected readonly faMagnifyingGlass = faMagnifyingGlass;
  protected readonly faArrowUpShortWide = faArrowUpShortWide;
  protected readonly faSquareBinary = faSquareBinary;
  protected readonly faPlusMinus = faPlusMinus;
  protected readonly faPenRuler = faPenRuler;
  protected readonly faDiagramProject = faDiagramProject;
  protected readonly faCodeCompare = faCodeCompare;
  protected readonly faCode = faCode;
  protected readonly Array = Array;
}
