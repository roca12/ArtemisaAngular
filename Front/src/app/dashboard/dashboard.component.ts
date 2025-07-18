/**
 * Imports required Angular components and FontAwesome icons
 */
import {Component} from '@angular/core';
import * as fas from '@fortawesome/free-solid-svg-icons';

/**
 * Dashboard component decorator
 * Defines the component's template and styles
 */
@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
/**
 * Dashboard component class
 * Main landing page component for the application
 */
export class DashboardComponent {
  /**
   * FontAwesome icon for right arrow
   */
  fain = fas.faLongArrowAltRight;

  /**
   * FontAwesome icon for question mark
   */
  faquestion = fas.faQuestion;

  /**
   * FontAwesome icon for smile
   */
  fasmile = fas.faSmile;

  /**
   * FontAwesome icon for checkmark
   */
  facheck = fas.faCheck;

  /**
   * Constructor for the DashboardComponent
   * Currently empty as no dependencies are injected
   */
  constructor() {

  }
}
