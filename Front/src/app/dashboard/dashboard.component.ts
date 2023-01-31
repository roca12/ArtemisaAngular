import {Component} from '@angular/core';
import * as fas from '@fortawesome/free-solid-svg-icons';
@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  fain = fas.faLongArrowAltRight;
  faquestion = fas.faQuestion;
  fasmile = fas.faSmile;
  facheck = fas.faCheck;

  constructor() {

  }
}
