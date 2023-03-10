import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ap-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {

  @Input() model: string = "";
  @Input() option: any;
  editedValue: string; //new edited value -> todo output decorator and new send to BE

  constructor() { }

  ngOnInit() {
  }
  //TODO edit mode ... edited value -> send back to parent new value, save new value via service by ENTER key or some button
  //TODO how to solve 'show more/ show less' in edit mode?? on which action we save new data in edit mode ENTER key/something else...

}
