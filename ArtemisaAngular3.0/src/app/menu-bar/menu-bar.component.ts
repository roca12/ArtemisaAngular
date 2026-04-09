import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBolt,
  faHouse,
  faBookOpen,
  faPuzzlePiece,
  faLink,
  faCalendar,
  faBars,
  faXmark,
  faSun,
  faMoon,
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
  private lastFocusedElement: HTMLElement | null = null;

  protected readonly faBolt = faBolt;
  protected readonly faHouse = faHouse;
  protected readonly faBookOpen = faBookOpen;
  protected readonly faPuzzlePiece = faPuzzlePiece;
  protected readonly faLink = faLink;
  protected readonly faCalendar = faCalendar;
  protected readonly faBars = faBars;
  protected readonly faXmark = faXmark;
  protected readonly faSun = faSun;
  protected readonly faMoon = faMoon;

  constructor(
    public theme: ThemeService,
    private authService: AuthService,
  ) {}

  toggleDarkMode() {
    this.theme.toggle();
  }

  toggleDrawer() {
    if (!this.drawerOpen) {
      this.lastFocusedElement = document.activeElement as HTMLElement;
    }
    this.drawerOpen = !this.drawerOpen;
  }

  closeDrawer() {
    this.drawerOpen = false;
    this.lastFocusedElement?.focus();
    this.lastFocusedElement = null;
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
