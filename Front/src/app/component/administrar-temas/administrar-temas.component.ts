import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
  selector: "app-administrar-temas",
  templateUrl: "./administrar-temas.component.html",
  styleUrls: ["./administrar-temas.component.scss"],
})
export class AdministrarTemasComponent implements OnInit {
  displayedColumns: string[] = [
    "opciones",
    "ID",
    "supergrupo",
    "tema",
    "complejidad_tiempo",
    "orden",
    "suborden",
  ];
  @BlockUI() blockUI: NgBlockUI;
  dataSource = new MatTableDataSource<any>();

  constructor(private http: HttpClient) {}

  async ngOnInit(): Promise<any> {
    this.blockUI.start();
    await this.http
      .get(`${environment.artemisaExpress}/api/temario`)
      .toPromise()
      .then((res: any) => {
        setTimeout(() => {
          this.dataSource = new MatTableDataSource(res?.data);
          this.blockUI.stop();
        });
      })
      .catch((e) => {
        console.log("[ERROR]");
        console.log(e);
        this.blockUI.stop();
      });
  }
}
