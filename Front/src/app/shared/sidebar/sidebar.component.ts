import {Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import {ROUTES} from './menu-items';
import {RouteInfo} from './sidebar.metadata';
import {Router, ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {animate, style, transition, trigger} from "@angular/animations";

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
      console.log(this.collapsed);
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
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
    this.screenWidth = window.innerWidth;
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
