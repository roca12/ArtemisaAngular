/**
 * Angular core and routing imports
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Application data models
 */
import { book, bookscards } from './books-data';

/**
 * FontAwesome icon imports
 */
import * as fab from '@fortawesome/free-brands-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';

/**
 * Libros component decorator
 * Defines the component's selector, template, and styles
 */
@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.scss']
})
/**
 * Libros (Books) component class
 * Displays a collection of programming books and resources
 */
export class LibrosComponent implements OnInit {

  /**
   * Array of book objects to display
   */
  bookcards: book[];

  /**
   * Set of unique book groups/categories
   */
  bookgroups= new Set();

  /**
   * FontAwesome icons for UI elements
   */
  // Book icon
  fabooks = fas.faBook;
  // Download icon
  fadownload = fas.faFileDownload;
  // Right chevron icon
  fachevron = fas.faChevronRight;

  /**
   * File paths for PDF and image resources
   */
  // Path to PDF files
  sourcePath1 = window.location.protocol + "\\\\" + window.location.host + "/assets/pdfs/";
  // Path to book cover images
  sourcePath2 = window.location.protocol + "\\\\" + window.location.host + "/assets/images/libros/descargables/";

  /**
   * Constructor for the LibrosComponent
   * Initializes and sorts the book data
   */
  constructor() {
    // Initialize book data from imported array
    this.bookcards = bookscards;

    // Sort books by group/category
    this.bookcards = this.bookcards.sort((a, b) => {
      if (a.group > b.group) {
        return 1;
      }
      if (a.group < b.group) {
        return -1;
      }
      return 0;
    });

    // Populate the set of unique book groups
    this.bookcards.forEach(element => {
      this.bookgroups.add(element.group);
    });
  }

  /**
   * Angular lifecycle hook that is called after component initialization
   * Currently empty but can be used for initialization logic
   */
  ngOnInit(): void {
  }

}
