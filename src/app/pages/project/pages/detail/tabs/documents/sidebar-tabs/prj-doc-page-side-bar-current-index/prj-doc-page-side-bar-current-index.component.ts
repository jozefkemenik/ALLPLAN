import { Component, Input, OnInit } from '@angular/core';
import { EcontrolType } from '@shared/models/EcontrolType.enum';
import { IdynamicControl } from '@shared/models/IdynamicControl';
import { RightSidePanelContentConfig } from '@shared/models/RightSidePanelContentConfig';

//CUrrent index tab
interface IcurrentIndex extends IdynamicControl {
}

class CurrentIndex implements IcurrentIndex {
  id: string;
  key: string | number;
  //value: string | number | boolean | Date;
  label: string;
  type: EcontrolType;
  maxLength?: number;
  isExpanded?: boolean;
}

@Component({
  selector: 'ap-prj-doc-page-side-bar-current-index',
  templateUrl: './prj-doc-page-side-bar-current-index.component.html',
  styleUrls: ['./prj-doc-page-side-bar-current-index.component.scss']
})
export class PrjDocPageSideBarCurrentIndexComponent implements OnInit {
  
  @Input() data: any = {};
  @Input() options: RightSidePanelContentConfig<CurrentIndex>;

  //config: RightSidePanelContentConfig<CurrentIndex>; //this is going to be generalized when we do second tab

  constructor() {
  }

  ngOnInit() {
    this.options = this.getOptionsConfig();
  }

  //this is going to be generalized when we do second tab
  getOptionsConfig() {
    return {
      items: [
        {
          id: "rPanelCurrentIndex389",
          key: 389,
          label: 'ProjectDocumentSideBarTabCurrentIndexIndex',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelCurrentIndex426",
          key: 426,
          label: 'ProjectDocumentSideBarTabCurrentIndexType',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelCurrentIndex396",
          key: 396,
          label: 'ProjectDocumentSideBarTabCurrentIndexCreatedBy',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelCurrentIndex397",
          key: 397,
          label: 'ProjectDocumentSideBarTabCurrentIndexCreatedDate',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelCurrentIndex447",
          key: 447,
          label: 'ProjectDocumentSideBarTabCurrentIndexCreationNote',
          type: EcontrolType.longText,
          maxLength: 138, // 150 characters minus show more text
          isExpanded: false,
          readonly: true,
        },
        {
          id: "rPanelCurrentIndex374",
          key: 374,
          label: 'ProjectDocumentSideBarTabCurrentIndexReviewedBy',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelCurrentIndex387",
          key: 387,
          label: 'ProjectDocumentSideBarTabCurrentIndexReviewDate',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelCurrentIndex388",
          key: 388,
          label: 'ProjectDocumentSideBarTabCurrentIndexReviewNote',
          type: EcontrolType.longText,
          maxLength: 138, // 150 characters minus show more text
          isExpanded: false,
          readonly: true,
        },
        {
          id: "rPanelCurrentIndex428",
          key: 428,
          label: 'ProjectDocumentSideBarTabCurrentIndexApprovedBy',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelCurrentIndex386",
          key: 386,
          label: 'ProjectDocumentSideBarTabCurrentIndexApprovalDate',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelCurrentIndex372",
          key: 372,
          label: 'ProjectDocumentSideBarTabCurrentIndexApprovalNote',
          type: EcontrolType.longText,
          maxLength: 138, // 150 characters minus show more text
          isExpanded: false,
          readonly: true,
        }
      ]
    }
  }

}
