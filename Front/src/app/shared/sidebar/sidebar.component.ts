import {Component, AfterViewInit, OnInit, Output, EventEmitter} from '@angular/core';
import {ROUTES} from './menu-items';
import {RouteInfo} from './sidebar.metadata';
import {Router, ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

//declare var $: any;
interface SideNavToogle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() onToogleSlidenav: EventEmitter<SideNavToogle> = new EventEmitter()
  showMenu = '';
  showSubMenu = '';
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

  // End open close
  collapsed = true;
  screenWidth = 0;

  ngOnInit() {
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
  }

  toogleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToogleSlidenav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

  closeSidenav(): void {
    this.collapsed = true;
    this.onToogleSlidenav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

}
