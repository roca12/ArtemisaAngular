import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { ThemeService } from './services/theme.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { NgClass } from '@angular/common';
import { RecomendationService } from './services/recomendation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBarComponent, FaIconComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'Biblioteca Artemisa';
  constructor(
    public theme: ThemeService,
    private recoService: RecomendationService,
  ) {}

  ngOnInit(): void {
    this.recoService.initializeRecomendationsAsync().catch((err) => {
      console.error('Error inicializando recomendaciones:', err);
    });
  }

  ngAfterViewInit() {
    const splash = document.getElementById('app-splash');
    if (!splash) return;
    requestAnimationFrame(() => {
      splash.classList.add('splash-hidden');
      setTimeout(() => splash.remove(), 800);
    });
  }

  protected readonly faGithub = faGithub;
}
