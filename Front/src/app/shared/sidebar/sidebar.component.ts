import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {RouteInfo} from './sidebar.metadata';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {animate, style, transition, trigger} from "@angular/animations";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import jwt_decode from 'jwt-decode';

//declare var $: any;
interface SideNavToogle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('250ms', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('250ms', style({opacity: 0}))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  collapsed = true;
  screenWidth = 0;

  @Output() onToogleSlidenav: EventEmitter<SideNavToogle> = new EventEmitter()

  @HostListener('window:resize', ['$event'])

  resizeWindow(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = true;
      this.onToogleSlidenav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
    }
  }

  public sidebarnavItems: RouteInfo[] = [];

  // this is for the open close
  addExpandClass(element: string) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    let perfil = 3;
    if (localStorage.getItem('token') ?? false) {
      const data: any = jwt_decode(localStorage.getItem('token') ?? '');
      perfil = data?.data?.cod_perfil;
    }
    this.http.get(`${environment.artemisaExpress}/api/usuario/acceso/${perfil}`).toPromise()
      .then((res: any) => {
        this.sidebarnavItems = res.map((e: any) => {
          return {
            path: e.path,
            title: e.title,
            icon: e.icon,
            class: e.class,
            extralink: e.extralink,
            submenu: e.submenu,
          }
        });
      })
      .catch((e) => {
        console.log('[ERROR]');
        console.log(e);
      });

  }

  toogleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToogleSlidenav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

  closeSidenav(): void {
    this.collapsed = true;
    this.onToogleSlidenav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

  openLink(url: string, newTab = true): void {
    if (!newTab) {
      this.router.navigate([url]);
      return;
    }
    window.open(url, "_blank");
  }

}
