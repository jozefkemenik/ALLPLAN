import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ap-shared-spinner-button',
  templateUrl: './button-with-spinner.component.html',
  styleUrls: ['./button-with-spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ButtonWithSpinnerComponent implements OnInit {

  //spinner config
  @Input() idBtn: string;
  @Input() diameter: number;
  @Input() mode: string;
  @Input() isLoading: boolean = false; // if false then disabled = true

  //button config
  @Input() buttonLabel: string;
  @Input() disabled: boolean = false; //use when there is checkbox action in parent to enable/disable button

  @Output() buttonAction = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  clickAction(event: any) {
    this.buttonAction.emit({ action: "click", data: {} });
  }

}
