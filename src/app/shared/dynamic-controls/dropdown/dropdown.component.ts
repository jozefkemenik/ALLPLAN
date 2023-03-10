import { Component, Input, Output, OnInit ,ViewEncapsulation,EventEmitter} from '@angular/core';

@Component({
  selector: 'ap-dc-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownComponent implements OnInit {

  @Input() model: any;
  @Output() modelChange = new EventEmitter();


  @Input() option: any;
  editedValue: string; 

  constructor() { }
  ngOnInit() {
  }
  select(item){
    this.modelChange.emit(item)
  }
}
