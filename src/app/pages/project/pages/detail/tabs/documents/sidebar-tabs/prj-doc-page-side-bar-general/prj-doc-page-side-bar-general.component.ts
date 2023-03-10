import { Component, Input, OnInit } from '@angular/core';
import { EcontrolType } from '@shared/models/EcontrolType.enum';
import { IdynamicControl } from '@shared/models/IdynamicControl';
import { RightSidePanelContentConfig } from '@shared/models/RightSidePanelContentConfig';

interface Igeneral extends IdynamicControl {
}

class General implements Igeneral {
  id: string;
  key: string | number;
  //value: string | number | boolean | Date;
  label: string;
  type: EcontrolType;
  maxLength?: number;
  isExpanded?: boolean;
}

@Component({
  selector: 'ap-prj-doc-page-side-bar-general',
  templateUrl: './prj-doc-page-side-bar-general.component.html',
  styleUrls: ['./prj-doc-page-side-bar-general.component.scss']
})
export class PrjDocPageSideBarGeneralComponent implements OnInit {

  @Input() data: any = {};
  @Input() options: RightSidePanelContentConfig<General>;

  constructor() { }

  ngOnInit() {
    this.options = this.getOptionsConfig();
  }

  //this is going to be generalized when we do second tab
  getOptionsConfig() {
    return {
      items: [
        {
          id: "cadProject",
          key: "cadProject",
          label: 'ProjectDocumentSideBarTabGeneralCADProjectName',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelGeneral445",
          key: 445,
          label: 'ProjectDocumentSideBarTabGeneralLayoutName',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelGeneral_DataType",
          key: "dataType",
          label: 'ProjectDocumentSideBarTabGeneralFileType',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelGeneral434",
          key: 434,
          label: 'ProjectDocumentSideBarTabGeneralDisplayMode',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelGeneral376",
          key: 376,
          label: 'ProjectDocumentSideBarTabGeneralScale',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelGeneral222",
          key: 222,
          label: 'ProjectDocumentSideBarTabGeneralHeight',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelGeneral758",
          key: 758,
          label: 'ProjectDocumentSideBarTabGeneralWidth',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelGeneral375",
          key: 375,
          label: 'ProjectDocumentSideBarTabGeneralPaperFormat',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelGeneral430",
          key: 430,
          label: 'ProjectDocumentSideBarTabGeneralHierarchicCode',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelGeneral439",
          key: 439,
          label: 'ProjectDocumentSideBarTabGeneralDescription',
          type: EcontrolType.text,
          readonly: true,
        },
        {
          id: "rPanelGeneral_revisionId",
          key: "revisionId",
          label: 'ProjectDocumentSideBarTabGeneralDocGuid',
          type: EcontrolType.text,
          readonly: true,
        }
      ]
    }
  }

}
