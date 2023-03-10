import { Component, Input, OnInit } from '@angular/core';
import { IdynamicControl } from '@shared/models/IdynamicControl';

@Component({
  selector: 'ap-long-text',
  templateUrl: './long-text.component.html',
  styleUrls: ['./long-text.component.scss']
})
export class LongTextComponent implements OnInit {

  @Input() model: string = "";
  @Input() option: IdynamicControl;
  editedValue: string; //new edited value -> todo output decorator and new send to BE

  constructor() { }

  ngOnInit() { }
  //TODO edit mode ... edited value -> send back to parent new value, save new value via service by ENTER key or some button
  //TODO how to solve 'show more/ show less' in edit mode?? on which action we save new data in edit mode ENTER key/something else...

}
