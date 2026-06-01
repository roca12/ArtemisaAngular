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
import { SearchEngine } from '../shared/util/search-engine';

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

  private searchEngine = new SearchEngine();

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
    // peek() en lugar de dequeue() — lee el top sin mutar la cola cacheada
    const bestReco = this.filterRecomendations(cadena).peek();

    if (bestReco) {
      // Limpia el input para que la próxima búsqueda empiece desde cero
      if (this.inputRef) this.inputRef.nativeElement.value = '';

      switch (bestReco.type) {
        case 'libro': {
          const libro = this.libros.find((l) => l.titulo === bestReco.data);
          if (libro) this.verPdf(libro.archivoPdf);
          break;
        }
        case 'tema-problema':
        case 'dificultad-problema':
        case 'juez-problema':
        case 'subtema-problema':
        case 'problema': {
          this.router.navigate(['/problemas'], {
            queryParams: { filtro: bestReco.data },
          });
          break;
        }
        case 'grupo-temario': {
          this.irATemario(bestReco.data);
          break;
        }
        case 'tema': {
          this.router.navigate(['/temario'], {
            queryParams: { filtro: bestReco.data },
          });
          break;
        }
      }
    }
  }

  getValorInput(): string {
    return this.inputRef?.nativeElement.value ?? '';
  }

  autocompletar(reco: Recomendation): void {
    if (this.inputRef) this.inputRef.nativeElement.value = reco.data;
    this.search(reco.data);
  }

  ngOnInit(): void {
    this.bookService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
        console.log(data);
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
      this.index = 0;
      this.phraseIdx = (this.phraseIdx + 1) % this.placeholderText.length;
      setTimeout(() => this.typePlaceHolder(), 1500);
    }
  }

  scrollCarousel(direction: 'left' | 'right'): void {
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

  verPdf(pdf: string): void {
    window.open(`assets/pdfs/${pdf}`, '_blank');
  }

  irATemario(filtro: string): void {
    this.router.navigate(['/temario'], { queryParams: { filtro } });
  }

  filterRecomendations(cadena: string): PriorityQueue<Recomendation> {
    const query = cadena.trim();
    if (!query) return new PriorityQueue<Recomendation>();
    if (this.cache.has(query))
      return this.cache.get(query) ?? new PriorityQueue<Recomendation>();

    const threshold = this.searchEngine.thresholdPara(query);
    const result = new PriorityQueue<Recomendation>();

    this.recomendationsService.getRecomendations().forEach((rec) => {
      const score = this.searchEngine.scoreIntencion(query, rec.data);
      if (score >= threshold && result.find(rec) === undefined) {
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
