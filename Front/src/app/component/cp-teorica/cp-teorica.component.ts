/**
 * Angular core imports
 */
import { Component, OnInit } from '@angular/core';

/**
 * CpTeorica component decorator
 * Defines the component's selector, template, and styles
 */
@Component({
  selector: 'app-cp-teorica',
  templateUrl: './cp-teorica.component.html',
  styleUrls: ['./cp-teorica.component.scss']
})
/**
 * CpTeorica (Theoretical Competitive Programming) component class
 * Displays theoretical concepts related to competitive programming
 */
export class CpTeoricaComponent implements OnInit {

  /**
   * Constructor for the CpTeoricaComponent
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
