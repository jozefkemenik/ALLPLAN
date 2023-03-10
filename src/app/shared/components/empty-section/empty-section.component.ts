import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

export class EmptyTable {
  textOne: string = "";
  textTwo: string = "";
  learnMore?: string = "";
  url?: string = "";
  icon?: string;
  img?: string;
}


@Component({
  selector: 'ap-empty-section',
  templateUrl: './empty-section.component.html',
  styleUrls: ['./empty-section.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class EmptySectionComponent implements OnInit {
  
  @Input() options: EmptyTable;

  constructor() { }

  ngOnInit(): void {
  }

}
