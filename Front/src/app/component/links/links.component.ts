import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-links",
  templateUrl: "./links.component.html",
  styleUrls: ["./links.component.scss"],
})
export class LinksComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  dataSource: Array<{}> = [];

  constructor(private http: HttpClient) {}

  async obtenerLinks() {
    await this.http
      .get(
        "https://artemisaback.netlify.app/.netlify/functions/api/link-valioso",
      )
      .toPromise()
      .then((response: any) => {
        if (response?.data) {
          for (const current of response["data"]) {
            current["tags"] = current["tags"].split(",");
          }
          this.dataSource = response["data"];
        }
      });
  }

  async ngOnInit(): Promise<any> {
    this.blockUI.start();
    await Promise.resolve().then(async () => {
      await this.obtenerLinks();
      setTimeout(() => {
        this.blockUI.stop();
      }, 500);
    });
  }
}
