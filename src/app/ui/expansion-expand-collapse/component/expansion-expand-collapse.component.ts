import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild, ViewEncapsulation, LOCALE_ID, Input } from '@angular/core';
import { IDataService } from '@shared/models/IDataService';
import { InjectUtilityModule } from 'src/app/utils/inject-utility.module';
import { ConfigService } from 'src/app/services/config.service';

//represend data [{item1:..., item2:...}]
//this are the action which can have expansion panel or inside of expansionPanel like body, header
export enum ExpansionPanelAction {
  DATA_RECEIVED = "data_received",
  OPEN_DIALOG_HEADER = "open_dialog_header",
  OPEN_DIALOG_BODY = "open_dialog_body",
}

export class EmptySituation {
  constructor(public icon: string, public translationText1: string, public translationText2: string) { }
}

export class ExpansionConfig {
  expansionPanelHeader: string;
  expansionPanelBody: string;
  expansionContext: string; 
  expansionInstance: string;
  expansionTitle: string;
  expansionIcons: Array<string>;
  emptyExpansionPanelHeader: EmptySituation;
  emptyExpansionPanelBody: EmptySituation;
  expansionPanelHeader_ActionName: string; //name of object in data for header action icons
  expansionPanelBody_ActionName: string; //name of object in data for body action icons
  executeActionBodyPanel_click: string; //return name of click variable which we define and is return from API call
}
@Component({
  selector: 'expansion-expand-collapse',
  templateUrl: './expansion-expand-collapse.component.html',
  styleUrls: ['./expansion-expand-collapse.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExpansionExpandCollapseComponent implements OnInit {

  data: any[];
  isLoading: boolean = true;
  service: IDataService;
  totalCount: number;
  config: ExpansionConfig;

  private configService;
  private localeId;

  panelOpenState: boolean = false;

  @Output() executeExpansionPanelActionEvent: EventEmitter<any> = new EventEmitter();
  @Output() executeIconActionEvent: EventEmitter<any> = new EventEmitter();
  @Output() executeExpansionPanelBodyClickActionEvent: EventEmitter<any> = new EventEmitter();
  @Output() executeToggleEvent: EventEmitter<any> = new EventEmitter();

  @Input() executeOpenExpansionPanel: string; //in future it can be array if we need open more or open and list postiion on specific project
  letPanelOpen: boolean = false;
  item2_styleClass = "expasion-body-element body_item_unmarked";
  @ViewChild("bodyMarkedItem2") item2Marked: ElementRef;

  openExpansionPanelBodyOnClick: boolean = true;

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {
    this.config = new ExpansionConfig();
    this.data = [];

    this.localeId = InjectUtilityModule.injector.get(LOCALE_ID);
    this.configService = InjectUtilityModule.injector.get(ConfigService);
  }

  ngOnInit() {
  }

  setDataService(service: IDataService) {
    this.service = service;
  }

  setEmpty() {
    this.setData({ data: [], total: 0 });
  }

  public setData(received: any) {
    this.totalCount = received.total;
    var values = received.data;
    if (!(values === undefined) && values.length >= 0) {
      this.isLoading = false;
      this.data = values;

      //this functionality works only when you click on CompanyName
      // if (this.executeOpenExpansionPanel !== undefined && this.executeOpenExpansionPanel.length > 0) {
      //   this.data.forEach(element => {
      //     if (element[this.config.expansionPanelHeader] !== null && element[this.config.expansionPanelHeader] !== undefined) {
      //       element[this.config.expansionPanelHeader].expanded = (element[this.config.expansionPanelHeader].id === this.executeOpenExpansionPanel) ? true : false;
      //       console.log("group, exanded ", element[this.config.expansionPanelHeader], element[this.config.expansionPanelHeader].expanded);
      //       this.executeOpenExpansionPanel = "";
      //       console.log("SOM TU...");
      //     }
      //   });
      // }

      this.executeExpansionPanelActionEvent.emit({ name: ExpansionPanelAction.DATA_RECEIVED, data: received });
    }
  }

  getInitialData(query?: any) {
    var new_query = query ?? {};
    this.service?.getData(new_query).subscribe(data => {
      this.setData(data);
    });
  }

  setConfig(config: ExpansionConfig) {
    this.config = config;
  }

  isObject(obj: any) {
    return typeof (obj) === 'object';
  }

  isEmptyItem2(item2: any) {
    if (item2 === null) {
      return true;
    } else if (item2 === undefined) {
      return true;
    } else if (item2.length === 0) {
      return true;
    }
    return false;
  }

  getHelpUrl() {
    return this.configService.getUrlConfig()["help_" + this.localeId];
  }


  public postProcessData(func: any) {
    this.data = func(this.data);
  }

  openDialog(event: any, action: string, data: any) {
    this.executeIconActionEvent.emit({ action: action, data: data, event: event });
  }

  mouseClickOnHeaderIcon(event: any) {
    event.stopPropagation();
  }

  bodyItemStyle(marked: boolean, m: number, n: number) {
    if (marked) {
      let id = "adms-" + this.config.expansionContext + "-expansion-panel-header-" + m.toString() + "-body-" + n.toString() + "-mark";
      let el = document.getElementById(id);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      return "expasion-body-element body_item_marked";
    }
    return "expasion-body-element body_item_unmarked";
  }

  executeActionBodyPanel(event: any, data: any) {
    if (this.openExpansionPanelBodyOnClick) {
      this.executeExpansionPanelBodyClickActionEvent.emit({ data });
    }
  }
  /**
   * this triggers event to handle expand/collaps action
   * @param is 
   * @param item 
   */
  toggleExpansion(is:boolean,item:any){
    var group = item[this.config.expansionPanelHeader]
    group.expanded=is;
    this.executeToggleEvent.emit(group);
  }
 
}
