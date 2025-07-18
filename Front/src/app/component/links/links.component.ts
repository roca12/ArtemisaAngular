/**
 * UI blocking functionality for loading states
 */
import {BlockUI, NgBlockUI} from 'ng-block-ui';

/**
 * Angular core and HTTP imports
 */
import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

/**
 * Links component decorator
 * Defines the component's selector, template, and styles
 */
@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
/**
 * Links component class
 * Displays a collection of valuable links and resources
 */
export class LinksComponent implements OnInit {
  /**
   * BlockUI decorator for showing loading indicator
   * Used during API calls to prevent user interaction
   */
  @BlockUI() blockUI: NgBlockUI;

  /**
   * Data source for the links collection
   * Stores the links retrieved from the API
   */
  dataSource: Array<{}> = [];

  /**
   * Constructor for the LinksComponent
   * @param http - HttpClient for making API requests
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Fetches valuable links from the API
   * Processes the response to format tags as arrays
   */
  async obtenerLinks() {
    await this.http.get('https://artemisaback.netlify.app/.netlify/functions/api/link-valioso').toPromise().then((response: any) => {
      if (response?.data) {
        // Process each link to convert comma-separated tags into arrays
        for (const current of response['data']) {
          current['tags'] = current['tags'].split(',');
        }
        // Update the data source with the processed links
        this.dataSource = response['data'];
      }
    });
  }

  /**
   * Angular lifecycle hook that is called after component initialization
   * Shows loading indicator, fetches links, and hides the indicator when done
   * @returns Promise that resolves when initialization is complete
   */
  async ngOnInit(): Promise<any> {
    // Show loading indicator
    this.blockUI.start();

    await Promise.resolve().then(async () => {
      // Fetch links data
      await this.obtenerLinks();

      // Hide loading indicator after a short delay for better UX
      setTimeout(() => {
        this.blockUI.stop()
      }, 500)
    });
  }
}
