import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { LinkService } from '../services/link.service';
import { Link } from '../shared/models/link.model';
import { NgFor, NgIf } from '@angular/common';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

@Component({
  selector: 'app-links',
  imports: [NgFor, NgIf, SpinnerComponent],
  templateUrl: './links.component.html',
  styleUrl: './links.component.css',
})
export class LinksComponent implements OnInit {
  links: Link[] = [];
  loading = true;
  constructor(
    public theme: ThemeService,
    private linkService: LinkService,
  ) {}

  ngOnInit(): void {
    this.linkService.obtenerLinks().subscribe(
      (res) => {
        this.links = res.data as Link[];
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los links:', error);
      },
    );
  }
}
