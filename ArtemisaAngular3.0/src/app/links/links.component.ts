import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { LinkService } from '../services/link.service';
import { Link } from '../shared/models/link.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-links',
  imports: [NgFor],
  templateUrl: './links.component.html',
  styleUrl: './links.component.css',
})
export class LinksComponent implements OnInit {
  links: Link[] = [];

  constructor(
    public theme: ThemeService,
    private linkService: LinkService,
  ) {}

  ngOnInit(): void {
    this.linkService.obtenerLinks().subscribe(
      (res) => {
        this.links = res.data as Link[];
        console.log(this.links);
      },
      (error) => {
        console.error('Error al obtener los links:', error);
      },
    );
  }
}
