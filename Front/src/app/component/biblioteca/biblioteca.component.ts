import {
  AfterContentInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import temario from "../../../assets/jsons/temariogpc.json";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

import * as far from "@fortawesome/free-regular-svg-icons";
import * as fas from "@fortawesome/free-solid-svg-icons";
import { Subject } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { DialogTemarioComponent } from "../../dialog-temario/dialog-temario.component";

@Component({
  selector: "app-biblioteca",
  templateUrl: "./biblioteca.component.html",
  styleUrls: ["./biblioteca.component.scss"],
})
export class BibliotecaComponent implements OnInit, AfterContentInit {
  fachevron = far.faArrowAltCircleRight;
  fatodotemario = fas.faGlobeAmericas;
  fateoria = fas.faSchool;
  fabusquedas = fas.faSearch;
  faordenamientos = fas.faSortNumericDownAlt;
  fastrings = fas.faTextWidth;
  fabitwise = fas.faDiceOne;
  faestructuras = fas.faTable;
  famatematicas = fas.faPlus;
  fageometria = fas.faPencilRuler;
  fagrafos = fas.faProjectDiagram;
  fadinamica = fas.faLightbulb;
  faotros = fas.faTerminal;

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
  titulotema: String = "Sin tituto disponible";
  textotema: String = "Sin texto disponible";
  codejava: string = "";
  codepython: string = "";
  codecpp: string = "";

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

  dtOptions: DataTables.Settings[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(MatSort) sort: MatSort;
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

  ngOnInit(): void {
    this.dtOptions[0] = this.buildDtOptions();
    this.dtOptions[1] = this.buildDtOptions();

    //teoria
    for (let tema of this.listatemas) {
      switch (tema.orden) {
        case 0:
          this.listateoria.push(tema);
          break;

        case 1:
          this.listaestructuras.push(tema);
          break;

        case 2:
          this.listabusquedas.push(tema);
          break;

        case 3:
          this.listaordenamientos.push(tema);
          break;
        case 4:
          this.listabitwise.push(tema);
          break;

        case 5:
          this.listastrings.push(tema);
          break;

        case 6:
          this.listamatematica.push(tema);
          break;
        case 7:
          this.listageometria.push(tema);
          break;
        case 8:
          this.listagrafos.push(tema);
          break;

        case 9:
          this.listadp.push(tema);
          break;

        default:
          this.listaeotros.push(tema);
          break;
      }
    }
  }

  ngAfterContentInit(): void {
    this.codejava = "";
    this.codepython = "";
    this.codecpp = "";
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.listatemas);
      this.dataSource.paginator = this.paginatorTemario;
      this.dataSource.sort = this.sort;

      this.dataSourceTeoria = new MatTableDataSource(this.listateoria);
      this.dataSourceTeoria.paginator = this.paginatorTeorias;

      this.dataSourceBusqueda = new MatTableDataSource(this.listabusquedas);
      this.dataSourceBusqueda.paginator = this.paginatorBusquedas;

      this.dataSourceOrdenamiento = new MatTableDataSource(
        this.listaordenamientos,
      );
      this.dataSourceOrdenamiento.paginator = this.paginatorOrdenamiento;

      this.dataSourceStringMatching = new MatTableDataSource(this.listastrings);
      this.dataSourceStringMatching.paginator = this.paginamientoString;

      this.dataSourceBitwise = new MatTableDataSource(this.listabitwise);
      this.dataSourceBitwise.paginator = this.paginamientoBitwise;

      this.dataSourceEstructuras = new MatTableDataSource(
        this.listaestructuras,
      );
      this.dataSourceEstructuras.paginator = this.paginamientoEstructuras;

      this.dataSourceMatematicas = new MatTableDataSource(this.listamatematica);
      this.dataSourceMatematicas.paginator = this.paginamientoMatematicas;

      this.dataSourceGeometria = new MatTableDataSource(this.listageometria);
      this.dataSourceGeometria.paginator = this.paginamientoGeometria;

      this.dataSourceGrafos = new MatTableDataSource(this.listagrafos);
      this.dataSourceGrafos.paginator = this.paginamientoGrafos;

      this.dataSourceDinamica = new MatTableDataSource(this.listadp);
      this.dataSourceDinamica.paginator = this.paginamientoDinamica;

      this.dataSourceCasos = new MatTableDataSource(this.listaeotros);
      this.dataSourceCasos.paginator = this.paginamientoCasos;
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

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

  closeResult: string = "";
  dataSource: MatTableDataSource<any>;
  dataSourceTeoria: MatTableDataSource<any>;
  dataSourceBusqueda: MatTableDataSource<any>;
  dataSourceOrdenamiento: MatTableDataSource<any>;
  dataSourceBitwise: MatTableDataSource<any>;
  dataSourceStringMatching: MatTableDataSource<any>;
  dataSourceEstructuras: MatTableDataSource<any>;
  dataSourceMatematicas: MatTableDataSource<any>;
  dataSourceGeometria: MatTableDataSource<any>;
  dataSourceGrafos: MatTableDataSource<any>;
  dataSourceDinamica: MatTableDataSource<any>;
  dataSourceCasos: MatTableDataSource<any>;
  displayedColumns: String[] = ["ID", "supergrupo", "tipo", "ir"];

  constructor(
    private modalService: NgbModal,
    public dialog: MatDialog,
  ) {}

  obtenerCode(type: number, ID: number): any {
    switch (type) {
      case 0: {
        for (let tema of this.listatemas) {
          if (tema.ID == ID) {
            return tema.tema;
          }
        }
        break;
      }
      case 1: {
        for (let tema of this.listatemas) {
          if (tema.ID == ID) {
            return tema.java;
          }
        }
        break;
      }
      case 2: {
        for (let tema of this.listatemas) {
          if (tema.ID == ID) {
            return tema.cpp;
          }
        }
        break;
      }
      case 3: {
        for (let tema of this.listatemas) {
          if (tema.ID == ID) {
            return tema.py;
          }
        }
        break;
      }
      case 4: {
        for (let tema of this.listatemas) {
          if (tema.ID == ID) {
            let result = tema.texto;
            let lista = result.split("\n");
            let aux: string = "";
            let i = 0;
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

  openDialog(ID: number) {
    this.textotema = this.obtenerCode(4, ID);
    this.titulotema = this.obtenerCode(0, ID);
    this.codejava = this.obtenerCode(1, ID);
    this.codecpp = this.obtenerCode(2, ID);
    this.codepython = this.obtenerCode(3, ID);
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
