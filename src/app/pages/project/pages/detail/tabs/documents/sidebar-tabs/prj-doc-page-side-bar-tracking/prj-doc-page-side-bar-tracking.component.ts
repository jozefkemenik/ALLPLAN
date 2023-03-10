import { Component, Input, OnInit } from '@angular/core';
import { EcontrolType } from '@shared/models/EcontrolType.enum';
import { IdynamicControl } from '@shared/models/IdynamicControl';
import { RightSidePanelContentConfig } from '@shared/models/RightSidePanelContentConfig';

interface ITracking extends IdynamicControl {
}

class Tracking implements ITracking {
  id: string;
  key: string | number;
  //value: string | number | boolean | Date;
  label: string;
  type: EcontrolType;
  maxLength?: number;
  isExpanded?: boolean;
}

@Component({
  selector: 'ap-prj-doc-page-side-bar-tracking',
  templateUrl: './prj-doc-page-side-bar-tracking.component.html',
  styleUrls: ['./prj-doc-page-side-bar-tracking.component.scss']
})
export class PrjDocPageSideBarTrackingComponent implements OnInit {

  @Input() data: any = {};
  @Input() options: RightSidePanelContentConfig<Tracking>;

  constructor() {
    this.options = this.getOptionsConfig();
  }

  ngOnInit() {
  }

  //this is going to be generalized when we do second tab
  getOptionsConfig() {
    return {
      class: "ap-sidebar-template-simple--group",
      items: [
        {
          id: "rPanelTrackingSenderName",
          key: "senderName",
          label: 'senderName',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelTrackingRecipientName",
          key: "recipientName",
          label: 'recipientName',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelTrackingAssignmentDate",
          key: "assignmentDate",
          label: 'assignmentDate',
          type: EcontrolType.date,
          readonly: true,
        },
        {
          id: "rPanelTrackingDownloadDate",
          key: "downloadDate",
          label: 'downloadDate',
          type: EcontrolType.date,
          readonly: true,
        },
      ]
    }
  }

}
