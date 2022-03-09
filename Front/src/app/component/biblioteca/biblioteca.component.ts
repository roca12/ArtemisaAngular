import { Component, OnInit } from '@angular/core';
import temario from '../../../assets/jsons/temariogpc.json'
@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.scss']
})
export class BibliotecaComponent implements OnInit {
  public listatemas: {
    "ID": number,
    "supergrupo": string,
    "tema": string,
    "texto": string
    "complejidad_tiempo": string
    "java": string
    "cpp": string
    "py": string
    "orden": number,
    "suborden": number,
    "fecha_creacion": string,
    "fecha_modificacion": string
  }[] = temario;
  constructor() { }

  ngOnInit(): void {
  }

}
