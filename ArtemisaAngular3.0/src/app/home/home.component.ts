import {Component, ElementRef, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowUpShortWide, faCode, faCodeCompare, faDiagramProject,
  faMagnifyingGlass, faPenRuler, faPlusMinus,
  faSchool,
  faSquareBinary,
  faTextWidth
} from '@fortawesome/free-solid-svg-icons';
import {ThemeService} from '../services/theme.service';
import {NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import { BookService } from '../services/book.service';
import { Libro } from '../shared/models/libro.model';
import {NgFor, NgIf, SlicePipe} from '@angular/common';
import { Router } from '@angular/router';
import {PriorityQueue} from '../shared/structures/priorityqueue.structures';
import {RecomendationService} from '../services/recomendation.service';
import {Recomendation} from '../shared/models/recomendation.model';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FontAwesomeModule, NgbCarouselModule, NgFor, SlicePipe, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {

  active:boolean = localStorage.getItem('darkMode') === 'true';
  cache:Map<string, PriorityQueue<Recomendation>> = new Map();

  @ViewChild('inputSearch') inputRef?: ElementRef<HTMLInputElement>;

  placeholderText: string[] = [
    "¿Qué vas a buscar hoy?",
    "Inspiración divina...",
    "Grafos",
    "...",
    "...",
    "Algoritmos de ordenamiento",
    "Algoritmos de búsqueda",
    "¿Qué es un capa 8?",
    "Programación dinámica",
    "...",
    "...",
    "Divide y Vencerás",
    "DFS o BFS esa es la cuestión",
    "¿Cómo debugeo sin llorar?"
  ];

  index = 0;
  phraseIdx = 0;

  @ViewChild('carousel', { static: false }) carousel!: ElementRef<HTMLDivElement>;



  constructor(
    public theme: ThemeService,
    private bookService:BookService,
    private router:Router,
    private recomendationsService:RecomendationService
  ) {
  }


  public libros: Libro[] = [];

  search(cadena:string):void{
    const bestReco = this.filterRecomendations(cadena).dequeue();
    if(bestReco){
      switch(bestReco.type){
        case 'libro':{
          let pdf = '';
          this.libros.forEach(libro => {
            if(libro.titulo === bestReco.data){
              pdf = libro.archivoPdf
            }
          });
          this.verPdf(pdf);
          break;
        }
        case 'tema-problema':{
          this.router.navigate(['/problemas'], {queryParams: {filtro: bestReco.data}});
           break;
        }
        case 'dificultad-problema':{
          this.router.navigate(['/problemas'], {queryParams: {filtro: bestReco.data}});
          break;
        }
        case 'juez-problema':{
          this.router.navigate(['/problemas'], {queryParams: {filtro: bestReco.data}});
          break;
        }
        case 'grupo-temario':{
          this.irATemario(bestReco.data);
         break;
        }
        case 'subtema-problema':{
          this.router.navigate(['/problemas'], {queryParams: {filtro: bestReco.data}});
          break;
        }
        case 'tema':{
          this.router.navigate(['/temario'], {queryParams: {filtro: bestReco.data}});
          break;
        }
        case 'problema':{
          this.router.navigate(['/problemas'], {queryParams: {filtro: bestReco.data}});
          break;
        }
      }
    }
  }

  getValorInput(){
    if(this.inputRef){
      return this.inputRef.nativeElement.value;
    }
    return '';
  }

  autocompletar(reco: Recomendation) {

    if(this.inputRef)this.inputRef.nativeElement.value = reco.data;
    this.search(reco.data);
  }

  filterRecomendations(cadena:string){
    if(this.cache.has(cadena)) return this.cache.get(cadena)!;
    let recomendations = new PriorityQueue<Recomendation>();
    this.recomendationsService.getRecomendations().forEach(rec => {
      let priorityList = [];
      let totalPriority = 0;
      const palabra1 = cadena.split(' ');
      const palabra2 = rec.data.split(' ');
      for(let i = 0; i < palabra1.length; i++){
        for(let j = 0; j < palabra2.length; j++){
            priorityList.push(
              (palabra1[i].length>=(palabra2[j].length) ?
                1-  (this.calcularSimilitudes(palabra1[i], palabra2[j])/palabra1[i].length):
               1-  ((this.calcularSimilitudes(palabra2[j], palabra1[i]))/palabra2[j].length)
              )
            )
        }
      }
    totalPriority = priorityList.reduce((a, b) => a + b, 0) / priorityList.length;




       if(totalPriority>=0.3 && recomendations.find(rec) === undefined) {
         recomendations.enqueue(rec, totalPriority);
       }

    });

    this.cache.set(cadena, recomendations);
    return recomendations;
  }




  ngOnInit(): void {
    this.bookService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
      }
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

  descargarLibro(pdf:string): void {
    const link = document.createElement('a');
    link.href = `assets/pdfs/${pdf}`;
    link.download = pdf;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  verPdf(pdf:string){
    window.open(`assets/pdfs/${pdf}`, '_blank');
  }

  irATemario(filtro: string){
    this.router.navigate(['/temario'], { queryParams: { filtro } });
  }

  calcularSimilitudes(texto1:string, texto2:string):number{

    const filas = texto1.length +1;
    const columnas = texto2.length +1;
    const matriz = Array.from({ length: filas }, () => Array(columnas).fill(0));

    for(let i = 0; i < filas; i++) matriz[i][0]=i;
    for(let j = 0; j < columnas; j++) matriz[0][j]=j;

    for(let i = 1; i < filas; i++){
      for(let j = 1; j < columnas; j++){
        const costo = texto1[i-1] === texto2[j-1] ? 0 : 1;
        matriz[i][j] = Math.min(
          matriz[i-1][j] + 1,
          matriz[i][j-1] + 1,
          matriz[i-1][j-1] + costo
        );
      }
    }
    return matriz[texto1.length][texto2.length];
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
