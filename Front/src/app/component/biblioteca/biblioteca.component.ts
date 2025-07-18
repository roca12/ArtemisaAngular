/**
 * Angular core and UI components
 */
import {
  AfterContentInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";

/**
 * Third-party libraries and data
 */
import { DataTableDirective } from "angular-datatables";
import temario from "../../../assets/jsons/temariogpc.json";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

/**
 * Icons and reactive programming
 */
import * as far from "@fortawesome/free-regular-svg-icons";
import * as fas from "@fortawesome/free-solid-svg-icons";
import { Subject } from "rxjs";

/**
 * Angular Material components
 */
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";

/**
 * Application components
 */
import { DialogTemarioComponent } from "../../dialog-temario/dialog-temario.component";

/**
 * Biblioteca component decorator
 * Defines the component's selector, template, and styles
 */
@Component({
  selector: "app-biblioteca",
  templateUrl: "./biblioteca.component.html",
  styleUrls: ["./biblioteca.component.scss"],
})
/**
 * Biblioteca (Library) component class
 * Displays a comprehensive library of programming topics and algorithms
 * Implements OnInit for initialization and AfterContentInit for post-content initialization
 */
export class BibliotecaComponent implements OnInit, AfterContentInit {
  /**
   * FontAwesome icons for UI elements
   */
  // Right arrow icon for navigation
  fachevron = far.faArrowAltCircleRight;
  // Globe icon for all topics
  fatodotemario = fas.faGlobeAmericas;
  // School icon for theory section
  fateoria = fas.faSchool;
  // Search icon for search algorithms
  fabusquedas = fas.faSearch;
  // Sort icon for sorting algorithms
  faordenamientos = fas.faSortNumericDownAlt;
  // Text width icon for string operations
  fastrings = fas.faTextWidth;
  // Dice icon for bitwise operations
  fabitwise = fas.faDiceOne;
  // Table icon for data structures
  faestructuras = fas.faTable;
  // Plus icon for mathematics
  famatematicas = fas.faPlus;
  // Ruler icon for geometry
  fageometria = fas.faPencilRuler;
  // Project diagram icon for graphs
  fagrafos = fas.faProjectDiagram;
  // Lightbulb icon for dynamic programming
  fadinamica = fas.faLightbulb;
  // Terminal icon for other topics
  faotros = fas.faTerminal;

  /**
   * Main list containing all topics from the JSON file
   * This is the source data that gets filtered into category-specific lists
   *
   * @property ID - Unique identifier for the topic
   * @property supergrupo - Category or group the topic belongs to
   * @property tema - Name of the topic or algorithm
   * @property texto - Description text of the topic
   * @property complejidad_tiempo - Time complexity of the algorithm
   * @property java - Java implementation code
   * @property cpp - C++ implementation code
   * @property py - Python implementation code
   * @property orden - Primary sort order (used for categorization)
   * @property suborden - Secondary sort order within a category
   * @property fecha_creacion - Creation date
   * @property fecha_modificacion - Last modification date
   */
  public listatemas: {
    ID: number;
    supergrupo: string;
    tema: string;
    texto: string;
    complejidad_tiempo: string;
    java: string;
    cpp: string;
    py: string;
    orden: number;
    suborden: number;
    fecha_creacion: string;
    fecha_modificacion: string;
  }[] = temario;

  /**
   * List of theory topics (orden = 0)
   * Contains fundamental theoretical concepts
   */
  public listateoria: {
    ID: number;
    supergrupo: string;
    tema: string;
    texto: string;
    complejidad_tiempo: string;
    java: string;
    cpp: string;
    py: string;
    orden: number;
    suborden: number;
    fecha_creacion: string;
    fecha_modificacion: string;
  }[] = [];

  /**
   * List of search algorithms (orden = 2)
   * Contains various search techniques like binary search, linear search, etc.
   */
  public listabusquedas: {
    ID: number;
    supergrupo: string;
    tema: string;
    texto: string;
    complejidad_tiempo: string;
    java: string;
    cpp: string;
    py: string;
    orden: number;
    suborden: number;
    fecha_creacion: string;
    fecha_modificacion: string;
  }[] = [];

  /**
   * List of sorting algorithms (orden = 3)
   * Contains various sorting techniques like quicksort, mergesort, etc.
   */
  public listaordenamientos: {
    ID: number;
    supergrupo: string;
    tema: string;
    texto: string;
    complejidad_tiempo: string;
    java: string;
    cpp: string;
    py: string;
    orden: number;
    suborden: number;
    fecha_creacion: string;
    fecha_modificacion: string;
  }[] = [];

  /**
   * List of string manipulation algorithms (orden = 5)
   * Contains string matching, parsing, and other text processing algorithms
   */
  public listastrings: {
    ID: number;
    supergrupo: string;
    tema: string;
    texto: string;
    complejidad_tiempo: string;
    java: string;
    cpp: string;
    py: string;
    orden: number;
    suborden: number;
    fecha_creacion: string;
    fecha_modificacion: string;
  }[] = [];

  /**
   * List of mathematical algorithms (orden = 6)
   * Contains number theory, combinatorics, and other mathematical algorithms
   */
  public listamatematica: {
    ID: number;
    supergrupo: string;
    tema: string;
    texto: string;
    complejidad_tiempo: string;
    java: string;
    cpp: string;
    py: string;
    orden: number;
    suborden: number;
    fecha_creacion: string;
    fecha_modificacion: string;
  }[] = [];

  /**
   * List of geometric algorithms (orden = 7)
   * Contains computational geometry algorithms like convex hull, line intersections, etc.
   */
  public listageometria: {
    ID: number;
    supergrupo: string;
    tema: string;
    texto: string;
    complejidad_tiempo: string;
    java: string;
    cpp: string;
    py: string;
    orden: number;
    suborden: number;
    fecha_creacion: string;
    fecha_modificacion: string;
  }[] = [];

  /**
   * List of bitwise operation algorithms (orden = 4)
   * Contains bit manipulation techniques and algorithms
   */
  public listabitwise: {
    ID: number;
    supergrupo: string;
    tema: string;
    texto: string;
    complejidad_tiempo: string;
    java: string;
    cpp: string;
    py: string;
    orden: number;
    suborden: number;
    fecha_creacion: string;
    fecha_modificacion: string;
  }[] = [];

  /**
   * List of graph algorithms (orden = 8)
   * Contains graph theory algorithms like DFS, BFS, shortest paths, etc.
   */
  public listagrafos: {
    ID: number;
    supergrupo: string;
    tema: string;
    texto: string;
    complejidad_tiempo: string;
    java: string;
    cpp: string;
    py: string;
    orden: number;
    suborden: number;
    fecha_creacion: string;
    fecha_modificacion: string;
  }[] = [];

  /**
   * List of dynamic programming algorithms (orden = 9)
   * Contains optimization problems solved using dynamic programming techniques
   */
  public listadp: {
    ID: number;
    supergrupo: string;
    tema: string;
    texto: string;
    complejidad_tiempo: string;
    java: string;
    cpp: string;
    py: string;
    orden: number;
    suborden: number;
    fecha_creacion: string;
    fecha_modificacion: string;
  }[] = [];

  /**
   * List of data structures (orden = 1)
   * Contains various data structures like arrays, linked lists, trees, etc.
   */
  public listaestructuras: {
    ID: number;
    supergrupo: string;
    tema: string;
    texto: string;
    complejidad_tiempo: string;
    java: string;
    cpp: string;
    py: string;
    orden: number;
    suborden: number;
    fecha_creacion: string;
    fecha_modificacion: string;
  }[] = [];

  /**
   * List of miscellaneous topics (default case)
   * Contains topics that don't fit into other categories
   */
  public listaeotros: {
    ID: number;
    supergrupo: string;
    tema: string;
    texto: string;
    complejidad_tiempo: string;
    java: string;
    cpp: string;
    py: string;
    orden: number;
    suborden: number;
    fecha_creacion: string;
    fecha_modificacion: string;
  }[] = [];
  /**
   * Properties for displaying topic details in the dialog
   */
  // Title of the current topic
  titulotema: String = "Sin tituto disponible";
  // Description text of the current topic
  textotema: String = "Sin texto disponible";
  // Java implementation code of the current topic
  codejava: string = "";
  // Python implementation code of the current topic
  codepython: string = "";
  // C++ implementation code of the current topic
  codecpp: string = "";

  /**
   * References to DataTable directives in the template
   * Used to access and manipulate the DataTables
   */
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

  /**
   * DataTables configuration options
   */
  dtOptions: DataTables.Settings[] = [];

  /**
   * Subject for triggering DataTable refresh
   */
  dtTrigger: Subject<any> = new Subject<any>();

  /**
   * References to Angular Material components in the template
   * Used for sorting and pagination
   */
  // Sort directive for tables
  @ViewChild(MatSort) sort: MatSort;

  // Paginators for each category table
  @ViewChild("paginatorTemario") paginatorTemario: MatPaginator;
  @ViewChild("paginatorTeorias") paginatorTeorias: MatPaginator;
  @ViewChild("paginatorBusquedas") paginatorBusquedas: MatPaginator;
  @ViewChild("paginatorOrdenamiento") paginatorOrdenamiento: MatPaginator;
  @ViewChild("paginamientoString") paginamientoString: MatPaginator;
  @ViewChild("paginamientoBitwise") paginamientoBitwise: MatPaginator;
  @ViewChild("paginamientoEstructuras") paginamientoEstructuras: MatPaginator;
  @ViewChild("paginamientoMatematicas") paginamientoMatematicas: MatPaginator;
  @ViewChild("paginamientoGeometria") paginamientoGeometria: MatPaginator;
  @ViewChild("paginamientoGrafos") paginamientoGrafos: MatPaginator;
  @ViewChild("paginamientoDinamica") paginamientoDinamica: MatPaginator;
  @ViewChild("paginamientoCasos") paginamientoCasos: MatPaginator;

  /**
   * Angular lifecycle hook that is called after component initialization
   * Initializes DataTable options and categorizes topics into separate lists based on their 'orden' property
   */
  ngOnInit(): void {
    // Initialize DataTable options
    this.dtOptions[0] = this.buildDtOptions();
    this.dtOptions[1] = this.buildDtOptions();

    // Categorize topics into separate lists based on their 'orden' property
    for (let tema of this.listatemas) {
      switch (tema.orden) {
        case 0:
          // Theory topics
          this.listateoria.push(tema);
          break;

        case 1:
          // Data structures
          this.listaestructuras.push(tema);
          break;

        case 2:
          // Search algorithms
          this.listabusquedas.push(tema);
          break;

        case 3:
          // Sorting algorithms
          this.listaordenamientos.push(tema);
          break;
        case 4:
          // Bitwise operations
          this.listabitwise.push(tema);
          break;

        case 5:
          // String manipulation
          this.listastrings.push(tema);
          break;

        case 6:
          // Mathematical algorithms
          this.listamatematica.push(tema);
          break;
        case 7:
          // Geometric algorithms
          this.listageometria.push(tema);
          break;
        case 8:
          // Graph algorithms
          this.listagrafos.push(tema);
          break;

        case 9:
          // Dynamic programming
          this.listadp.push(tema);
          break;

        default:
          // Miscellaneous topics
          this.listaeotros.push(tema);
          break;
      }
    }
  }

  /**
   * Angular lifecycle hook that is called after the component's content has been initialized
   * Initializes code display variables and sets up data sources for all tables with pagination
   */
  ngAfterContentInit(): void {
    // Initialize code display variables
    this.codejava = "";
    this.codepython = "";
    this.codecpp = "";

    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      // Initialize data sources for all tables and connect them to their respective paginators

      // Main topics table
      this.dataSource = new MatTableDataSource(this.listatemas);
      this.dataSource.paginator = this.paginatorTemario;
      this.dataSource.sort = this.sort;

      // Theory topics table
      this.dataSourceTeoria = new MatTableDataSource(this.listateoria);
      this.dataSourceTeoria.paginator = this.paginatorTeorias;

      // Search algorithms table
      this.dataSourceBusqueda = new MatTableDataSource(this.listabusquedas);
      this.dataSourceBusqueda.paginator = this.paginatorBusquedas;

      // Sorting algorithms table
      this.dataSourceOrdenamiento = new MatTableDataSource(
        this.listaordenamientos,
      );
      this.dataSourceOrdenamiento.paginator = this.paginatorOrdenamiento;

      // String manipulation table
      this.dataSourceStringMatching = new MatTableDataSource(this.listastrings);
      this.dataSourceStringMatching.paginator = this.paginamientoString;

      // Bitwise operations table
      this.dataSourceBitwise = new MatTableDataSource(this.listabitwise);
      this.dataSourceBitwise.paginator = this.paginamientoBitwise;

      // Data structures table
      this.dataSourceEstructuras = new MatTableDataSource(
        this.listaestructuras,
      );
      this.dataSourceEstructuras.paginator = this.paginamientoEstructuras;

      // Mathematical algorithms table
      this.dataSourceMatematicas = new MatTableDataSource(this.listamatematica);
      this.dataSourceMatematicas.paginator = this.paginamientoMatematicas;

      // Geometric algorithms table
      this.dataSourceGeometria = new MatTableDataSource(this.listageometria);
      this.dataSourceGeometria.paginator = this.paginamientoGeometria;

      // Graph algorithms table
      this.dataSourceGrafos = new MatTableDataSource(this.listagrafos);
      this.dataSourceGrafos.paginator = this.paginamientoGrafos;

      // Dynamic programming table
      this.dataSourceDinamica = new MatTableDataSource(this.listadp);
      this.dataSourceDinamica.paginator = this.paginamientoDinamica;

      // Miscellaneous topics table
      this.dataSourceCasos = new MatTableDataSource(this.listaeotros);
      this.dataSourceCasos.paginator = this.paginamientoCasos;
    });
  }

  /**
   * Angular lifecycle hook that is called when the component is destroyed
   * Cleans up subscriptions to prevent memory leaks
   */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  /**
   * Builds configuration options for DataTables
   * @returns DataTables.Settings object with configuration options
   * @private
   */
  private buildDtOptions(): DataTables.Settings {
    return {
      pagingType: "full_numbers",
      columns: [
        {
          title: "#",
          orderable: true,
        },
        {
          title: "Tema / Algoritmo",
          orderable: false,
        },
        {
          title: "Tipo",
        },
        {
          title: "Ir ",
          orderable: false,
        },
      ],
      responsive: true,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último",
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending:
            ": Activar para ordenar la tabla en orden descendente",
        },
      },
    };
  }

  /**
   * Result string from modal operations
   */
  closeResult: string = "";

  /**
   * Data sources for Angular Material tables
   * Each data source is connected to a specific category list and paginator
   */
  // Main topics table data source
  dataSource: MatTableDataSource<any>;
  // Theory topics table data source
  dataSourceTeoria: MatTableDataSource<any>;
  // Search algorithms table data source
  dataSourceBusqueda: MatTableDataSource<any>;
  // Sorting algorithms table data source
  dataSourceOrdenamiento: MatTableDataSource<any>;
  // Bitwise operations table data source
  dataSourceBitwise: MatTableDataSource<any>;
  // String manipulation table data source
  dataSourceStringMatching: MatTableDataSource<any>;
  // Data structures table data source
  dataSourceEstructuras: MatTableDataSource<any>;
  // Mathematical algorithms table data source
  dataSourceMatematicas: MatTableDataSource<any>;
  // Geometric algorithms table data source
  dataSourceGeometria: MatTableDataSource<any>;
  // Graph algorithms table data source
  dataSourceGrafos: MatTableDataSource<any>;
  // Dynamic programming table data source
  dataSourceDinamica: MatTableDataSource<any>;
  // Miscellaneous topics table data source
  dataSourceCasos: MatTableDataSource<any>;

  /**
   * Columns to display in the tables
   */
  displayedColumns: String[] = ["ID", "supergrupo", "tipo", "ir"];

  /**
   * Constructor for the BibliotecaComponent
   * @param modalService - NgbModal service for displaying modal dialogs
   * @param dialog - MatDialog service for displaying Material dialogs
   */
  constructor(
    private modalService: NgbModal,
    public dialog: MatDialog,
  ) {}

  /**
   * Retrieves specific information about a topic based on the type parameter
   * @param type - Type of information to retrieve:
   *               0: Topic name
   *               1: Java code
   *               2: C++ code
   *               3: Python code
   *               4: Description text (with HTML formatting)
   * @param ID - ID of the topic to retrieve information for
   * @returns The requested information or undefined if not found
   */
  obtenerCode(type: number, ID: number): any {
    switch (type) {
      case 0: {
        // Get topic name
        for (let tema of this.listatemas) {
          if (tema.ID == ID) {
            return tema.tema;
          }
        }
        break;
      }
      case 1: {
        // Get Java code
        for (let tema of this.listatemas) {
          if (tema.ID == ID) {
            return tema.java;
          }
        }
        break;
      }
      case 2: {
        // Get C++ code
        for (let tema of this.listatemas) {
          if (tema.ID == ID) {
            return tema.cpp;
          }
        }
        break;
      }
      case 3: {
        // Get Python code
        for (let tema of this.listatemas) {
          if (tema.ID == ID) {
            return tema.py;
          }
        }
        break;
      }
      case 4: {
        // Get description text with HTML formatting
        for (let tema of this.listatemas) {
          if (tema.ID == ID) {
            let result = tema.texto;
            let lista = result.split("\n");
            let aux: string = "";
            let i = 0;
            // Add line breaks for proper HTML display
            for (let separado in lista) {
              aux += lista[i];
              aux += "<br></br>";
              i++;
            }
            return aux;
          }
        }
        break;
      }
    }
  }

  /**
   * Opens a dialog to display detailed information about a topic
   * @param ID - ID of the topic to display
   */
  openDialog(ID: number) {
    // Retrieve all information about the topic
    this.textotema = this.obtenerCode(4, ID); // Description text
    this.titulotema = this.obtenerCode(0, ID); // Topic name
    this.codejava = this.obtenerCode(1, ID); // Java code
    this.codecpp = this.obtenerCode(2, ID); // C++ code
    this.codepython = this.obtenerCode(3, ID); // Python code

    // Open the dialog with the retrieved information
    this.dialog.open(DialogTemarioComponent, {
      data: {
        textotema: this.textotema,
        titulotema: this.titulotema,
        codejava: this.codejava,
        codecpp: this.codecpp,
        codepython: this.codepython,
      },
    });
  }
}
