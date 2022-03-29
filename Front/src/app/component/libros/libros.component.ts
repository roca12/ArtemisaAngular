import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {book,bookscards} from './books-data';

import * as fab from '@fortawesome/free-brands-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.scss']
})
export class LibrosComponent implements OnInit {

  bookcards:book[];

  fabooks=fas.faBook;
  fadownload=fas.faFileDownload;

  sourcePath1=window.location.protocol+"\\\\"+window.location.host+"/assets/pdfs/";
  constructor() { 
    this.bookcards=bookscards;
  }

  ngOnInit(): void {
  }

}
