import { Component, AfterViewInit } from '@angular/core';
import * as fab from '@fortawesome/free-brands-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{
  fain=fas.faLongArrowAltRight;
  faquestion=fas.faQuestion;
  fasmile=fas.faSmile;
  facheck=fas.faCheck;

  constructor() {

  }
}
