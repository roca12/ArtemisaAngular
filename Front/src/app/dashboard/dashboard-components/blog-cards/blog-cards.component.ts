import { Component, OnInit } from '@angular/core';
import {blogcard,blogcards} from './blog-cards-data';

import * as fab from '@fortawesome/free-brands-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-blog-cards',
  templateUrl: './blog-cards.component.html'
})
export class BlogCardsComponent implements OnInit {
  
  blogcards:blogcard[];

  constructor() { 

    this.blogcards=blogcards;
  }

  ngOnInit(): void {
  }

}
