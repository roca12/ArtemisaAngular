import jwt_decode from "jwt-decode";
import { FormControl } from "@angular/forms";
import { RouteInfo } from "./sidebar.metadata";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { HttpClient } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OverlayContainer } from "@angular/cdk/overlay";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  OnInit,
  Output,
} from "@angular/core";

//declare var $: any;
interface SideNavToogle {
  collapsed: boolean;
  screenWidth: number;
}

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
  animations: [],
})
export class SidebarComponent implements OnInit {
  screenWidth = 0;
  toggleControl = new FormControl(false);

  @BlockUI() blockUI: NgBlockUI;
  @HostListener("window:resize", ["$event"])
  @HostBinding("class")
  className = "";
  @Output() onToogleSlidenav: EventEmitter<SideNavToogle> = new EventEmitter();

  public sidebarnavItems: RouteInfo[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private overlay: OverlayContainer,
  ) {}

  ngOnInit() {
    this.blockUI.start();
    this.screenWidth = window.innerWidth;
    let perfil = 3;
    if (localStorage.getItem("token") ?? false) {
      const data: any = jwt_decode(localStorage.getItem("token") ?? "");
      perfil = data?.data?.cod_perfil;
    }
    this.http
      .get(`${environment.artemisaExpress}/api/usuario/acceso/${perfil}`)
      .toPromise()
      .then((res: any) => {
        this.sidebarnavItems = res.map((e: any) => {
          return {
            path: e.path,
            title: e.title,
            icon: e.icon,
            class: e.class,
            extralink: e.extralink,
            submenu: e.submenu,
          };
        });
        this.blockUI.stop();
      })
      .catch((e) => {
        console.log("[ERROR]");
        console.log(e);
        this.blockUI.stop();
      });
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = "darkMode";
      this.className = darkMode ? darkClassName : "";
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
  }

  openLink(url: string, newTab = true): void {
    if (!newTab) {
      this.router.navigate([url]);
      return;
    }
    window.open(url, "_blank");
  }
}
