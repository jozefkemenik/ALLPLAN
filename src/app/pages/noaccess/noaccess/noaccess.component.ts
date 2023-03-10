import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { EmptyTable } from '@shared/components/empty-section/empty-section.component';

@Component({
  selector: 'ap-noaccess',
  templateUrl: './noaccess.component.html',
  styleUrls: ['./noaccess.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class NoaccessComponent implements OnInit {

  config: EmptyTable = new EmptyTable();

  constructor() {
  }

  ngOnInit(): void {
    this.config.textOne = "accessDenied";
    this.config.textTwo = "accessDeniedMessage";
    this.config.icon = null;
    this.config.img = 'assets/images/lock.svg';
    this.config.learnMore = null;
    this.config.url = null;

  }

}
