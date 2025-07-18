/**
 * Angular core imports
 */
import { Component, OnInit } from '@angular/core';

/**
 * Competencias component decorator
 * Defines the component's selector, template, and styles
 */
@Component({
  selector: 'app-competencias',
  templateUrl: './competencias.component.html',
  styleUrls: ['./competencias.component.scss']
})
/**
 * Competencias (Competitions) component class
 * Displays information about programming competitions
 */
export class CompetenciasComponent implements OnInit {

  /**
   * Constructor for the CompetenciasComponent
   * Currently empty as no dependencies are injected
   */
  constructor() { }

  /**
   * Angular lifecycle hook that is called after component initialization
   * Currently empty but can be used for initialization logic
   */
  ngOnInit(): void {
  }

}
