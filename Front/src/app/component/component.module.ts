/**
 * Angular core imports
 */
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

/**
 * Third-party library imports
 */
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

/**
 * Application routes
 */
import { ComponentsRoutes } from "./component.routing";

/**
 * Components module decorator
 * Configures the shared module for all components
 */
@NgModule({
  /**
   * Modules imported by this module
   */
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  /**
   * Components declared in this module
   * Currently empty as components are declared in their respective modules
   */
  declarations: [],
})
/**
 * Components module class
 * Serves as a container for component-related functionality
 */
export class ComponentsModule {}
