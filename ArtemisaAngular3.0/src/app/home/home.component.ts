import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  inject,
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

/**
 * Componente de la página de inicio que gestiona la búsqueda global,
 * recomendaciones y visualización de libros.
 */
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
  /** Indica si los libros se están cargando. */
  loading = true;
  /** Estado del modo oscuro, sincronizado con localStorage. */
  active: boolean = localStorage.getItem('darkMode') === 'true';
  /** Caché para almacenar resultados de búsqueda anteriores y mejorar el rendimiento. */
  cache: Map<string, PriorityQueue<Recomendation>> = new Map();

  /** Referencia al elemento input de búsqueda en el DOM. */
  @ViewChild('inputSearch') inputRef?: ElementRef<HTMLInputElement>;

  /** Lista de frases que se muestran cíclicamente en el placeholder del buscador. */
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

  /** Índice del carácter actual que se está escribiendo en el placeholder. */
  index = 0;
  /** Índice de la frase actual en el arreglo placeholderText. */
  phraseIdx = 0;

  /** Referencia al contenedor del carrusel de libros. */
  @ViewChild('carousel', { static: false })
  carousel?: ElementRef<HTMLDivElement>;

  /** Servicio para gestionar el tema (claro/oscuro). */
  public theme = inject(ThemeService);
  /** Servicio para obtener libros. */
  private bookService = inject(BookService);
  /** Servicio para el enrutamiento. */
  private router = inject(Router);
  /** Servicio para obtener recomendaciones de búsqueda. */
  private recomendationsService = inject(RecomendationService);

  /** Lista de libros cargados desde el servicio. */
  public libros: Libro[] = [];

  /**
   * Realiza la búsqueda basada en la cadena ingresada y redirige al usuario.
   * @param cadena Texto a buscar.
   */
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
        default:
          break;
      }
    }
  }

  /**
   * Obtiene el valor actual del input de búsqueda.
   * @returns El valor del input o una cadena vacía si no está disponible.
   */
  getValorInput(): string {
    return this.inputRef?.nativeElement.value ?? '';
  }

  /**
   * Completa el input de búsqueda con una recomendación y ejecuta la búsqueda.
   * @param reco La recomendación seleccionada.
   */
  autocompletar(reco: Recomendation): void {
    if (this.inputRef) this.inputRef.nativeElement.value = reco.data;
    this.search(reco.data);
  }

  /**
   * Ciclo de vida OnInit: Carga la lista de libros inicial.
   */
  ngOnInit(): void {
    this.bookService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
        console.log(data);
        this.loading = false;
      },
    });
  }

  /**
   * Ciclo de vida AfterViewInit: Inicializa el estado del modo oscuro y el efecto de escritura del placeholder.
   */
  ngAfterViewInit(): void {
    this.active = localStorage.getItem('darkMode') === 'true';
    this.applyDarkMode();
    this.typePlaceHolder();
  }

  /**
   * Aplica las clases de CSS necesarias para el modo oscuro en el body.
   */
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

  /**
   * Genera el efecto de escritura (typing) en el placeholder del input de búsqueda.
   */
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

  /**
   * Realiza el desplazamiento horizontal del carrusel de libros.
   * @param direction Dirección del desplazamiento ('left' o 'right').
   */
  scrollCarousel(direction: 'left' | 'right'): void {
    const step = 300;
    const container = this.carousel?.nativeElement;
    if (!container) return;
    const current = container.scrollLeft;
    const next = direction === 'right' ? current + step : current - step;
    container.scrollTo({ left: next, behavior: 'smooth' });
  }

  /**
   * Descarga un archivo PDF de libro.
   * @param pdf Nombre del archivo PDF.
   */
  descargarLibro(pdf: string): void {
    const link = document.body.appendChild(document.createElement('a'));
    link.href = `assets/pdfs/${pdf}`;
    link.download = pdf;
    link.click();
    document.body.removeChild(link);
    console.debug(
      'Downloading:',
      pdf,
      'Theme:',
      this.theme.isDark() ? 'dark' : 'light',
    );
  }

  /**
   * Abre un archivo PDF en una nueva pestaña.
   * @param pdf Nombre del archivo PDF.
   */
  verPdf(pdf: string): void {
    window.open(`assets/pdfs/${pdf}`, '_blank');
    console.debug(
      'Opening:',
      pdf,
      'Theme:',
      this.theme.isDark() ? 'dark' : 'light',
    );
  }

  /**
   * Redirige a la página del temario con un filtro específico.
   * @param filtro Nombre del tema o grupo para filtrar.
   */
  irATemario(filtro: string): void {
    this.router.navigate(['/temario'], { queryParams: { filtro } });
  }

  /**
   * Filtra las recomendaciones disponibles según la cadena ingresada utilizando una cola de prioridad.
   * @param cadena El texto ingresado por el usuario.
   * @returns Una PriorityQueue con las recomendaciones que superan el umbral de similitud.
   */
  filterRecomendations(cadena: string): PriorityQueue<Recomendation> {
    const query = cadena.trim();
    if (!query) return new PriorityQueue<Recomendation>();
    if (this.cache.has(query))
      return this.cache.get(query) ?? new PriorityQueue<Recomendation>();

    const threshold = SearchEngine.thresholdPara(query);
    const result = new PriorityQueue<Recomendation>();

    this.recomendationsService.getRecomendations().forEach((rec) => {
      const score = SearchEngine.scoreIntencion(query, rec.data);
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
