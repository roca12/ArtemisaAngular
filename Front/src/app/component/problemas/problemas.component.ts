import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';

import problemas from '../../../assets/jsons/problemas.json'

import * as far from '@fortawesome/free-regular-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';
import {Subject} from 'rxjs';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-problemas',
  templateUrl: './problemas.component.html',
  styleUrls: ['./problemas.component.scss']
})
export class ProblemasComponent implements OnInit, AfterContentInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  fachevron = far.faArrowAltCircleRight;
  falistchek = fas.faList;

  public listaproblemas: {
    "id": number,
    "titulo": string,
    "juez": string,
    "alias": number,
    "dificultad": number,
    "tema_1": string,
    "tema_2": string,
    "tema_3": string,
    "tema_4": string,
    "url": string
  }[] = problemas;

  dtOptions: DataTables.Settings[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  dataSource: MatTableDataSource<any>;
  displayedColumns: String[] = ['id', 'titulo', 'dificultad', 'tema', 'juez', 'option'];


  ngOnInit(): void {
    this.dtOptions[0] = this.buildDtOptions();
  }

  ngAfterContentInit(): void {
    this.listaproblemas = problemas;
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.listaproblemas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private buildDtOptions(): DataTables.Settings {

    return {
      pagingType: 'full_numbers',
      columns: [
        {
          title: '#',
          orderable: true
        },
        {
          title: 'Titulo',
          orderable: false
        },
        {
          title: 'Dificultad',
          orderable: true
        },
        {
          title: 'Tema',
          orderable: true
        },
        {
          title: 'Juez',
          orderable: true
        }, {
          title: 'Ir',
          orderable: false
        }
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
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
