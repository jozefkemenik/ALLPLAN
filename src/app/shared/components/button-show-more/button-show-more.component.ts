import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ap-button-show-more',
  templateUrl: './button-show-more.component.html',
  styleUrls: ['./button-show-more.component.scss']
})
export class ButtonShowMoreComponent implements OnInit {

  @Input() inputIsExpanded: boolean;
  @Input() inputIsVisible: boolean;
  @Output() isExpandedEmitter = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  changeExpansion() {
    this.isExpandedEmitter.emit(!this.inputIsExpanded);
  }
}
