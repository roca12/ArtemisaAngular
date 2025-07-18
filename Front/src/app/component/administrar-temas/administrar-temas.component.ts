/**
 * Angular core and UI components
 */
import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { HttpClient } from "@angular/common/http";

/**
 * Environment configuration for API endpoints
 */
import { environment } from "../../../environments/environment";

/**
 * UI blocking functionality for loading states
 */
import { BlockUI, NgBlockUI } from "ng-block-ui";

/**
 * AdministrarTemas component decorator
 * Defines the component's selector, template, and styles
 */
@Component({
  selector: "app-administrar-temas",
  templateUrl: "./administrar-temas.component.html",
  styleUrls: ["./administrar-temas.component.scss"],
})
/**
 * AdministrarTemas (Manage Topics) component class
 * Provides an administrative interface for managing topics/curriculum
 */
export class AdministrarTemasComponent implements OnInit {
  /**
   * Columns to display in the topics table
   * Defines the order and visibility of columns
   */
  displayedColumns: string[] = [
    "opciones",
    "ID",
    "supergrupo",
    "tema",
    "complejidad_tiempo",
    "orden",
    "suborden",
  ];

  /**
   * BlockUI decorator for showing loading indicator
   * Used during API calls to prevent user interaction
   */
  @BlockUI() blockUI: NgBlockUI;

  /**
   * Data source for the Material table
   * Provides data and functionality for sorting, filtering, and pagination
   */
  dataSource = new MatTableDataSource<any>();

  /**
   * Constructor for the AdministrarTemasComponent
   * @param http - HttpClient for making API requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Angular lifecycle hook that is called after component initialization
   * Loads topic data from the API when the component initializes
   * @returns Promise that resolves when data is loaded
   */
  async ngOnInit(): Promise<any> {
    // Show loading indicator
    this.blockUI.start();

    // Fetch topics data from API
    await this.http
      .get(`${environment.artemisaExpress}/api/temario`)
      .toPromise()
      .then((res: any) => {
        // Use setTimeout to ensure UI updates after data is processed
        setTimeout(() => {
          // Update table data source with API response
          this.dataSource = new MatTableDataSource(res?.data);
          // Hide loading indicator
          this.blockUI.stop();
        });
      })
      .catch((e) => {
        // Log errors to console
        console.log("[ERROR]");
        console.log(e);
        // Hide loading indicator even if there's an error
        this.blockUI.stop();
      });
  }
}
