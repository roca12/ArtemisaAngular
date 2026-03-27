import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu-bar',
  imports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css',
})
export class MenuBarComponent implements OnInit {
  constructor(
    public theme: ThemeService,
    private authService: AuthService,
  ) {}

  toggleDarkMode() {
    const darkModeContainer = document.querySelector('.darkmode-container');
    darkModeContainer?.classList.toggle('active');
    this.theme.toggle();
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
