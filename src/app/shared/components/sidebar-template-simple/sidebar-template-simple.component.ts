import { Component, Input, OnInit,ViewEncapsulation } from '@angular/core';
import { EcontrolType } from '@shared/models/EcontrolType.enum';
import { IdynamicControl } from '@shared/models/IdynamicControl';
import { RightSidePanelContentConfig } from '@shared/models/RightSidePanelContentConfig';

@Component({
  selector: 'ap-sidebar-template-simple',
  templateUrl: './sidebar-template-simple.component.html',
  styleUrls: ['./sidebar-template-simple.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarTemplateSimpleComponent implements OnInit {

  @Input() data: any = {};
  @Input() options: RightSidePanelContentConfig<IdynamicControl>;
  public controlType = EcontrolType;

  constructor() { }

  ngOnInit() {
  }

}
