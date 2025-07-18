/**
 * Angular core imports
 */
import { Component, OnInit } from '@angular/core';

/**
 * Jueces component decorator
 * Defines the component's selector, template, and styles
 */
@Component({
  selector: 'app-jueces',
  templateUrl: './jueces.component.html',
  styleUrls: ['./jueces.component.scss']
})
/**
 * Jueces (Judges) component class
 * Displays information about online judges and competitive programming platforms
 */
export class JuecesComponent implements OnInit {

  /**
   * Constructor for the JuecesComponent
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
