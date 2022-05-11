import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { book, bookscards } from './books-data';

import * as fab from '@fortawesome/free-brands-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.scss']
})
export class LibrosComponent implements OnInit {

  bookcards: book[];
  bookgroups= new Set();  

  fabooks = fas.faBook;
  fadownload = fas.faFileDownload;
  fachevron = fas.faChevronRight;

  sourcePath1 = window.location.protocol + "\\\\" + window.location.host + "/assets/pdfs/";
  sourcePath2 = window.location.protocol + "\\\\" + window.location.host + "/assets/images/libros/descargables/";
  constructor() {
    this.bookcards = bookscards;
    this.bookcards = this.bookcards.sort((a, b) => {
      if (a.group > b.group) {
        return 1;
      }
      if (a.group < b.group) {
        return -1;
      }
      return 0;
    });

    this.bookcards.forEach(element => {
      this.bookgroups.add(element.group);
    });

    

  }

  ngOnInit(): void {
  }

}
