/**
 * Imports required Angular components and services
 */
import { Component, HostBinding } from "@angular/core";
import { FormControl } from "@angular/forms";
import { OverlayContainer } from "@angular/cdk/overlay";

/**
 * Main application component decorator
 * Defines the component's metadata including selector, template, and styles
 */
@Component({
  selector: "app-root", // The HTML tag used to insert this component
  templateUrl: "./app.component.html", // Path to the component's HTML template
  styleUrls: ["./app.component.css"], // Path to the component's CSS styles
})
/**
 * Main application component class
 * Serves as the root component for the entire application
 */
export class AppComponent {
  /**
   * Title property for the application
   */
  title = "app";

  /**
   * Constructor for the AppComponent
   * @param overlay - Injected OverlayContainer service for managing overlay elements
   */
  constructor(private overlay: OverlayContainer) {}

  /**
   * Angular lifecycle hook that is called after component initialization
   * Currently empty but can be used for initialization logic
   */
  ngOnInit(): void {}
}
