import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-temario',
  templateUrl: './dialog-temario.component.html',
  styleUrls: ['./dialog-temario.component.scss']
})
export class DialogTemarioComponent implements OnInit {
  codejava: String = "";
  codepython: String = "";
  codecpp: String = "";
  titulotema: String = "Sin tituto disponible";
  textotema: String = "Sin texto disponible";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.titulotema = this.data.titulotema;
    this.codejava = this.data.codejava;
    this.codecpp = this.data.codecpp;
    this.textotema = this.data.textotema;
    this.codepython = this.data.codepython;
  }

}
