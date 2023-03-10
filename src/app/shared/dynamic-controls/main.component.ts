import { Component, Input, OnInit,ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { EcontrolType } from '@shared/models/EcontrolType.enum';
import { IdynamicControl, } from '@shared/models/IdynamicControl';



@Component({
  selector: 'ap-dynamic-control-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class DynamicControlMainComponent implements OnInit {

  @Input() data: any = {};
  @Input() options: Array<IdynamicControl>;
  @Output() change = new EventEmitter();

 

  constructor() { }

  ngOnInit() {
    
  }

  onChange(item){
    this.change.emit(item);
  }
}
