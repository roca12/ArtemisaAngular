import { AfterContentInit, Component, OnInit } from '@angular/core';

import problemas from '../../../assets/jsons/problemas.json'

import * as fab from '@fortawesome/free-brands-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-problemas',
  templateUrl: './problemas.component.html',
  styleUrls: ['./problemas.component.scss']
})
export class ProblemasComponent implements OnInit, AfterContentInit {
  fachevron = far.faArrowAltCircleRight;
  falistchek=fas.faList;

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

  ngOnInit(): void {
    this.dtOptions[0] = this.buildDtOptions();
  }

  ngAfterContentInit(): void {
    this.listaproblemas = problemas;
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

}
