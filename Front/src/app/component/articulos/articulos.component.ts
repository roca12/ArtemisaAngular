/**
 * Angular core imports
 */
import { Component, OnInit } from "@angular/core";

/**
 * Articulos component decorator
 * Defines the component's selector, template, and styles
 */
@Component({
  selector: "app-articulos",
  templateUrl: "./articulos.component.html",
  styleUrls: ["./articulos.component.scss"],
})
/**
 * Articulos (Articles) component class
 * Displays a collection of articles or publications
 */
export class ArticulosComponent implements OnInit {
  /**
   * Constructor for the ArticulosComponent
   * Currently empty as no dependencies are injected
   */
  constructor() {}

  /**
   * Angular lifecycle hook that is called after component initialization
   * Currently empty but can be used for initialization logic
   */
  ngOnInit(): void {}
}
