import { Component, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { PositiionType } from './services/alert.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  Position = PositiionType;

  constructor() { }

}
