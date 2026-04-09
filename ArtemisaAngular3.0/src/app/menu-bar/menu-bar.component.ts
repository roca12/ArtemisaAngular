import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBolt, faHouse, faBookOpen, faPuzzlePiece,
  faLink, faCalendar, faBars, faXmark, faSun, faMoon
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu-bar',
  imports: [RouterModule, FontAwesomeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css',
})
export class MenuBarComponent implements OnInit {
  drawerOpen = false;

  faBolt = faBolt;
  faHouse = faHouse;
  faBookOpen = faBookOpen;
  faPuzzlePiece = faPuzzlePiece;
  faLink = faLink;
  faCalendar = faCalendar;
  faBars = faBars;
  faXmark = faXmark;
  faSun = faSun;
  faMoon = faMoon;

  constructor(
    public theme: ThemeService,
    private authService: AuthService,
    public router: Router,
  ) {}

  toggleDarkMode() {
    this.theme.toggle();
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.drawerOpen = false;
  }

  ngOnInit(): void {
    if (this.authService.tokenExpirado()) {
      this.authService.cerrarSesion();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.obtenerToken() !== null;
  }
}
