import { Component, EventEmitter, Inject, LOCALE_ID, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { BreadcrumbsService } from 'src/app/features/breadcrumbs/breadcrumbs.service';
import { HttpService } from 'src/app/core/services/http.service';
import { ITemplateRefType } from '@shared/components/sidebar/sidebar.component';
import { CommonService } from 'src/app/services/common.service';
import { RevisionService } from './revision.service';
import { EColumnConfigType, ITableConfig } from '@shared/components/table/models/TableConfig.model';
import { ETableAction, PayLoad, TableAction } from '@shared/components/table/models/TableAction.model';
import { DataAndTotalCountResult } from '@shared/models/api/DataAndTotalCountResult';
import { ProjectDocumentsService } from 'src/app/services/projectDocuments.service';
import { HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { SimpleDropDown } from '@shared/models/simpleDialog';
import { throwError } from 'rxjs';
import { RolesService } from '@shared/services/roles.service';
import { EOperationCompanyAdministrator, EOperationProjectEditor, EOperationProjectViewer } from '@shared/models/api/Role';
import { DocumentRevision } from '@shared/models/api/documentRevision';
import { DeleteRevisionDialogProvider } from './dialogs/deleteRevisionDialog/deleteRevisionDialog.component';
import { TableProvider } from '@shared/components/table/table.component';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'ap-project-detail-documents-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RevisionComponent implements OnInit {
  selectedTabIndex: number = 0;
  documentId: string;

  /** sidebar part */
  @ViewChild('sidebarContentTab1', { static: true, read: TemplateRef }) tab1: TemplateRef<any>;
  @ViewChild('sidebarContentTab2', { static: true, read: TemplateRef }) tab2: TemplateRef<any>;
  @ViewChild('sidebarContentTab3', { static: true, read: TemplateRef }) tab3: TemplateRef<any>;
  isOpenSidebar = false;
  sidebarData: any;
  sidebarTemplateTabs: ITemplateRefType[];
  tabIndex = 0;
  /** end sidebar part */

  loading = false; //loading data
  tableConfig: ITableConfig;

  @Output() getSelectionOutput = new EventEmitter<any[]>(); //to parent get information of every change on checked row/rows in table component
  dataTable: DataAndTotalCountResult<any>;

  dataLoading = false;

  dropDownItems: SimpleDropDown[];
  selectionTableData: any[] = [];

  companyId: string;
  projectId: string;

  constructor(
    public bs: BreadcrumbsService,
    private httpService: HttpService,
    @Inject(LOCALE_ID) public locale: string,
    protected commonService: CommonService,
    protected revisionService: RevisionService,
    protected projectDocService: ProjectDocumentsService,
    private rs: RolesService,
    public deleteRevisionDialogProvider: DeleteRevisionDialogProvider,
    private tableProvider: TableProvider,
  ) {
    this.dropDownItems = [
      { value: "button_download", icon: "custom-download-icon", disabled: true },
      { value: "button_delete", icon: "custom-delete-project-icon", disabled: true }];
    this.bs.subscribeUpdateBreacrumbs(() => {
      this.documentId = this.bs.params["_idDocument"];
      this.companyId = this.bs.params["_idCompany"];
      this.projectId = this.bs.params["_idProject"];
    });
    this.initTableConfig();
  }

  ngOnInit(): void {
    this.sidebarTemplateTabs = [
      { title: 'ProjectDocumentSideBarTabCurrentIndex', templateRef: this.tab1, context: "rPanelCurrentIndex", disabled: false, translation: 'youDoNotHaveRightRoleForTheFunction' },
      { title: 'ProjectDocumentSideBarTabTracking', templateRef: this.tab2, context: "rPanelTracking", translation: 'youDoNotHaveRightRoleForTheFunction' },
      { title: 'ProjectDocumentSideBarTabGeneral', templateRef: this.tab3, context: "rPanelGeneral", disabled: false, translation: 'youDoNotHaveRightRoleForTheFunction' }];

    this.selectedTabIndex = this.httpService.getTabIndex();
  }

  onTabChanged($event) {
    this.httpService.setTabIndex($event.index);
  }

  protected initTableConfig() {
    // var localeDateFormat = this.commonService.getLocaleDateTimeFormat(this.locale);
    this.tableConfig = {
      tableContext: "project-detail-documents-revision-versions",
      tableInstance: "",
      pageSizeOptions: [5, 20, 50],
      pageSizeIndex: 1,
      hasAction: true,
      sort: { key: "assignmentDate", direction: "desc" },
      //we can define condition on whole row
      //noActive:row=>row.id=='f8a94cc8-8007-4fdf-a518-609849769c50',
      emptyTable: {
        textOne: 'emptyProjectDocument1',
        textTwo: 'emptyProjectDocument2',

      },
      confColumns: [{
        key: 'fileName',
        header: 'fileName',
        type: EColumnConfigType.Str,
        sticky: true,
        initialWidth: "30%",
        isLink: true,
      },
      {
        key: 'index',
        header: 'index',
        type: EColumnConfigType.Str
      },
      {
        key: 'indexCreator',
        header: 'indexCreator',
        type: EColumnConfigType.Str,
      }, {
        key: 'indexDate',
        header: 'indexDate',
        type: EColumnConfigType.ShortDate,
      },
      {
        key: 'indexNote',
        header: 'indexNote',
        type: EColumnConfigType.Str,
      },
      {
        key: 'uploadBy',
        header: 'uploadBy',
        type: EColumnConfigType.Str,
      },
      {
        key: 'assignmentDate',
        header: 'assignmentDate',
        type: EColumnConfigType.LongDate
      },

      {
        key: 'lastDownloadDate',
        header: 'lastDownloadDate',
        type: EColumnConfigType.LongDate
      },
      ]
    };
  }

  /**
 * 
 * @param action 
 */
  onTableAction(action: TableAction) {
    switch (action.eTableAction) {
      case ETableAction.REFRESH:
        this.load(action.payLoad);
        break;
      case ETableAction.LINK_CLICKED:
        this.openLink(action.data.id);
        break;
      case ETableAction.ACTIONS:
        this.DownloadFile(action.data);
        break;
      case ETableAction.SELECTION:
        //this.getSelectionOutput.emit(action.data);
        this.getSelectionOutputData(action.data);
        break;
    }
  }

  /**
* 
* @param pl 
*/
  private load(pl: PayLoad) {
    pl['documentId'] = this.documentId;
    this.revisionService.getData(pl).then((res) => {
      this.addActionsForRow(res.data)
      this.dataTable = res;
    })
  }

  /**
 * 
 * @param id 
 */
  private openLink(id: string) {
    this.isOpenSidebar = true;
    this.dataLoading = true;
    this.projectDocService.getDocumentDetail(id).then(
      resp => {
        this.sidebarData = resp;
        this.isOpenSidebar = true;
        this.sidebarTemplateTabs[1].disabled = !resp.canTrackDownloads;
      }
      , err => {
        console.log(err);
      }).finally(() => {
        this.dataLoading = false;
      });
  }

  //TODO make this inside share files -> used in dashboard as well
  private async DownloadFile(val) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append(`id`, val.row.id);
    await this.projectDocService.revisionDownload(queryParams, val.row.fileName).then((data: any) => {
      if (data.class === "svg-mat-icon-visited") {
        let actualDate = formatDate(new Date(), 'dd.MM.yyyy - HH:mm:ss', 'en');
        val.action.tooltip = actualDate;
      }
      val.action.class = data.class;
    });
  }

  //to data which we have add new data with actions which can be used on row and are seen in last column
  private addActionsForRow(rows: Array<any>) {
    rows.forEach(rowData => {
      rowData["actions"] =
        [{
          name: ETableAction.DOWNLOAD,
          tooltip: !rowData["downloadDate"] ? 'notDownloadedYet' : formatDate(rowData["downloadDate"], 'dd.MM.yyyy - HH:mm:ss', 'en'),
          icon: "custom-download-icon",
          class: !rowData["downloadDate"] ? "svg-mat-icon" : "svg-mat-icon-visited",
          disabled: false
        }];
    });
  }

  getOutput(emitValue: any) {
    switch (emitValue) {
      case "button_download":
        this.multipleDownloads();
        //todo later
        break;
      case "button_delete":
        let data = {
          selected: this.selectionTableData as DocumentRevision[]
        };
        //error toast message
        ///todo refresh table
        this.deleteRevisionDialogProvider.open(data).then(
          resp => {
            if (resp) {
              // this triggers LOAD methd on table instance
              this.tableProvider.refresh('project-detail-documents-revision-versions');
            }
          }
          , err => {
          })
        break;
      default:
        throwError(emitValue + " action is not ssupported");
        break;
    }
  }

  multipleDownloads() {
    this.downloadFiles();
  }

  private async downloadFiles() {
    let queryParams = new HttpParams();

    this.selectionTableData.forEach(value => {
      queryParams = queryParams.append(`id`, value.id);
    });

    await this.projectDocService.revisionDownload(queryParams, this.selectionTableData[0].fileName).then((json: any) => {
      let actualDate = formatDate(new Date(), 'dd.MM.yyyy - HH:mm:ss', 'en');
      if (json.class == "svg-mat-icon-visited") {
        this.selectionTableData.forEach(value => {
          //check if some id is excluded first
          let isExcluded = false;
          if (json.excluded.length > 0) {
            isExcluded = json.excluded.find((o, i) => {
              if (o === value.revisionId) return true;
            });
          }
          //find download action 
          value.actions.find((o, i) => {
            if (o.name === ETableAction.DOWNLOAD && !isExcluded) {
              value.actions[i].tooltip = actualDate;
              value.actions[i].class = json.class;
              return true; // stop searching
            }
          });
        });
      }
    });
  }

  //get all data from rows which are selected in table component
  getSelectionOutputData(outputDataFromChild: any) {
    this.selectionTableData = outputDataFromChild;
    this.dropDownItems[0].disabled = !((this.selectionTableData?.length > 0)); // download dropdown
    this.dropDownItems[1].disabled = !((this.selectionTableData?.length > 0)); //delete dropdown
  }

}
