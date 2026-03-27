import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { MenuBarComponent } from "./menu-bar/menu-bar.component";
import {ThemeService} from './services/theme.service';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {NgClass} from '@angular/common';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBarComponent, FaIconComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'ArtemisaAngular3.0';
  constructor(
    public theme: ThemeService,

    ) {}


  protected readonly faGithub = faGithub;
}
