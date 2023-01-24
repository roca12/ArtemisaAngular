import {Component, OnInit, HostListener} from "@angular/core";
import {Router} from "@angular/router";
import * as fab from '@fortawesome/free-brands-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';

interface SideNavToogle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: "app-full-layout",
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
})
export class FullComponent implements OnInit {
  fadiscord = fab.faDiscord;
  fagithub = fab.faGithub;
  famail = fab.faGoogle;

  constructor(public router: Router) {
    this.router = router;
  }

  public isCollapsed = false;
  public innerWidth: number = 0;
  public defaultSidebar: string = "";
  public showMobileMenu = false;
  public expandLogo = false;
  public sidebartype = "full";

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {
    if (this.router.url === "/") {
      this.router.navigate(["/dashboard"]);
    }
    this.defaultSidebar = this.sidebartype;
    this.handleSidebar();
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.handleSidebar();
  }

  handleSidebar() {
    this.year = new Date().toString().split(' ')[3];
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.sidebartype = "full";
    } else {
      this.sidebartype = this.defaultSidebar;
    }
  }

  toggleSidebarType() {
    switch (this.sidebartype) {
      case "full":
        this.sidebartype = "mini-sidebar";
        break;

      case "mini-sidebar":
        this.sidebartype = "full";
        break;

      default:
    }
  }

  openLink(url: string, newTab: boolean = true): void {
    if (!newTab) {
      this.router.navigate([url]);
      return;
    }
    window.open(url, "_blank");
  }

  isSideNavCollapsed = false;
  screenWidth = 0;
  year: string;

  onToogleSlidenav(data: SideNavToogle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  getClass(): string {
    let strClass = '';
    if (this.showMobileMenu) {
      strClass += 'show-sidebar';
    }
    if (!this.isSideNavCollapsed && this.screenWidth > 768) {
      strClass += ' body-trimmed';
    } else if (!this.isSideNavCollapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      strClass += 'body-md-screen';
    }
    return strClass.trim();
  }
}
