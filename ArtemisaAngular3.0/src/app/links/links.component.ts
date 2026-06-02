import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { LinkService } from '../services/link.service';
import { Link } from '../shared/models/link.model';
import { NgFor, NgIf } from '@angular/common';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';

/**
 * Componente que muestra una lista de enlaces valiosos y recursos externos.
 */
@Component({
  selector: 'app-links',
  imports: [NgFor, NgIf, SpinnerComponent],
  templateUrl: './links.component.html',
  styleUrl: './links.component.css',
})
export class LinksComponent implements OnInit {
  /** Arreglo que contiene la lista de enlaces a mostrar. */
  links: Link[] = [];
  /** Indica si los enlaces se están cargando. */
  loading = true;

  /**
   * Constructor del componente de enlaces.
   * @param theme Servicio para gestionar el tema visual.
   * @param linkService Servicio para obtener los enlaces desde la API.
   */
  constructor(
    public theme: ThemeService,
    private linkService: LinkService,
  ) {}

  /**
   * Ciclo de vida OnInit: Carga los enlaces desde el servidor al iniciar el componente.
   */
  ngOnInit(): void {
    this.linkService.obtenerLinks().subscribe(
      (res) => {
        this.links = res as Link[];
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los links:', error);
      },
    );
  }
}
