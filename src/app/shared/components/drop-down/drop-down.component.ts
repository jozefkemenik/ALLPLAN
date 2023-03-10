import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { SimpleDropDown } from '@shared/models/simpleDialog';

@Component({
  selector: 'ap-dropdown',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DropDownComponent implements OnInit {

  @Input() items: SimpleDropDown[];
  @Output() output = new EventEmitter<SimpleDropDown>();

  constructor() {
  }

  ngOnInit() {
  }

  click(event: any, value: any) {
    this.output.emit(value);
  }

}
