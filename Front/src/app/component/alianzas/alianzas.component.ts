/**
 * Angular core imports
 */
import { Component, OnInit } from "@angular/core";

/**
 * Alianzas component decorator
 * Defines the component's selector, template, and styles
 */
@Component({
  selector: "app-alianzas",
  templateUrl: "./alianzas.component.html",
  styleUrls: ["./alianzas.component.scss"],
})
/**
 * Alianzas (Alliances) component class
 * Displays information about partnerships and alliances
 */
export class AlianzasComponent implements OnInit {
  /**
   * Constructor for the AlianzasComponent
   * Currently empty as no dependencies are injected
   */
  constructor() {}

  /**
   * Angular lifecycle hook that is called after component initialization
   * Currently empty but can be used for initialization logic
   */
  ngOnInit(): void {}
}
